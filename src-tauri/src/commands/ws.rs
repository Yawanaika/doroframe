// warframe.market WebSocket。
// WebView 原生 WebSocket 不能带 Cookie 头，故在 Rust 侧建连：单后台 task 拥有连接、
// 订阅集合与重连；命令通过 channel 投递指令；服务端推送原样 emit 给前端按 type 分发。

use std::collections::{HashMap, HashSet};
use std::sync::Mutex;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use serde_json::Value;
use tauri::{AppHandle, Emitter};
use tokio::net::TcpStream;
use tokio::sync::mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender};
use tokio::sync::oneshot;
use tokio_tungstenite::tungstenite::handshake::client::generate_key;
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::{connect_async, MaybeTlsStream, WebSocketStream};

const URL: &str = "wss://warframe.market/socket?platform=pc";
const EVENT: &str = "market://ws-event";
const BID_SET: &str = "@WS/rpc/auctions/bid/SET";
const BID_REMOVE: &str = "@WS/rpc/auctions/bid/REMOVE";

type Ws = WebSocketStream<MaybeTlsStream<TcpStream>>;

enum WsCmd {
    Subscribe(String),
    Unsubscribe(String),
    /// 出价/撤价 RPC：发送 frame，应答按 correlation(auction_id::bid_id) 经 resp 回传
    Rpc {
        frame: Value,
        corr: String,
        resp: oneshot::Sender<Value>,
    },
    Shutdown,
}

/// 仅持有指向当前后台 task 的 sender；std Mutex 因为只短暂 lock、不跨 await。
pub struct WsManager {
    cmd_tx: Mutex<Option<UnboundedSender<WsCmd>>>,
}

impl WsManager {
    pub fn new() -> Self {
        Self {
            cmd_tx: Mutex::new(None),
        }
    }
}

fn sub_frame(id: &str) -> Message {
    let s = serde_json::json!({
        "type": "@WS/SUBSCRIBE/AUCTION",
        "payload": { "auction_id": id },
    })
    .to_string();
    Message::Text(s.into())
}

/// 从应答帧的顶层 correlation 构造 RPC key（auction_id::bid_id）。全程不 unwrap。
fn corr_key(v: &Value) -> Option<String> {
    let c = v.get("correlation")?;
    match (
        c.get("auction_id").and_then(|x| x.as_str()),
        c.get("bid_id").and_then(|x| x.as_str()),
    ) {
        (Some(a), Some(b)) => Some(format!("{a}::{b}")),
        _ => None,
    }
}

async fn connect(token: &Option<String>) -> Result<Ws, String> {
    let mut builder = http::Request::builder()
        .uri(URL)
        .header("Host", "warframe.market")
        .header("Connection", "Upgrade")
        .header("Upgrade", "websocket")
        .header("Sec-WebSocket-Version", "13")
        .header("Sec-WebSocket-Key", generate_key());
    if let Some(t) = token {
        if !t.is_empty() {
            builder = builder.header("Cookie", t.as_str());
        }
    }
    let req = builder.body(()).map_err(|e| format!("ws build request: {e}"))?;
    let (ws, _) = connect_async(req)
        .await
        .map_err(|e| format!("ws connect: {e}"))?;
    Ok(ws)
}

enum Served {
    Shutdown,
    Disconnected,
}

/// 已连接时主循环：读 ws 帧 → 命中 correlation 则回传 RPC，否则 emit；同时消费 cmd。
async fn serve(
    app: &AppHandle,
    ws: &mut Ws,
    cmd_rx: &mut UnboundedReceiver<WsCmd>,
    subs: &mut HashSet<String>,
    pending: &mut HashMap<String, oneshot::Sender<Value>>,
) -> Served {
    loop {
        tokio::select! {
            msg = ws.next() => match msg {
                Some(Ok(Message::Text(t))) => {
                    if let Ok(v) = serde_json::from_str::<Value>(t.as_str()) {
                        match corr_key(&v).and_then(|k| pending.remove(&k)) {
                            Some(resp) => { let _ = resp.send(v); } // RPC 应答，不广播
                            None => { let _ = app.emit(EVENT, v); }
                        }
                    }
                }
                Some(Ok(_)) => {} // ping/pong/binary：tungstenite 自动回 pong，忽略
                Some(Err(_)) | None => return Served::Disconnected,
            },
            cmd = cmd_rx.recv() => match cmd {
                Some(WsCmd::Subscribe(id)) => {
                    if subs.insert(id.clone()) {
                        let _ = ws.send(sub_frame(&id)).await;
                    }
                }
                Some(WsCmd::Unsubscribe(id)) => {
                    // 仅本地移除；服务端到下次重连才停推（与参考实现一致）
                    subs.remove(&id);
                }
                Some(WsCmd::Rpc { frame, corr, resp }) => {
                    pending.insert(corr, resp);
                    let _ = ws.send(Message::Text(frame.to_string().into())).await;
                }
                Some(WsCmd::Shutdown) | None => return Served::Shutdown,
            },
        }
    }
}

/// 退避期间仍消费 cmd（只更新订阅集合，不发帧）。返回 false 表示收到 Shutdown。
async fn backoff_drain(
    cmd_rx: &mut UnboundedReceiver<WsCmd>,
    subs: &mut HashSet<String>,
    secs: u64,
) -> bool {
    let sleep = tokio::time::sleep(Duration::from_secs(secs));
    tokio::pin!(sleep);
    loop {
        tokio::select! {
            _ = &mut sleep => return true,
            cmd = cmd_rx.recv() => match cmd {
                Some(WsCmd::Subscribe(id)) => { subs.insert(id); }
                Some(WsCmd::Unsubscribe(id)) => { subs.remove(&id); }
                // 未连接时无法发 RPC；drop resp → 命令侧 rx 得 Err("ws not connected")
                Some(WsCmd::Rpc { resp, .. }) => { drop(resp); }
                Some(WsCmd::Shutdown) | None => return false,
            },
        }
    }
}

async fn run(app: AppHandle, token: Option<String>, mut cmd_rx: UnboundedReceiver<WsCmd>) {
    let mut subs: HashSet<String> = HashSet::new();
    let mut pending: HashMap<String, oneshot::Sender<Value>> = HashMap::new();
    let mut attempt: u32 = 0;
    loop {
        if attempt > 0 {
            // min(30, 2^attempt) 秒纯指数退避；attempt.min(5) 防移位溢出
            let secs = (1u64 << attempt.min(5)).min(30);
            if !backoff_drain(&mut cmd_rx, &mut subs, secs).await {
                return;
            }
        }
        let mut ws = match connect(&token).await {
            Ok(ws) => ws,
            Err(_) => {
                attempt += 1;
                continue;
            }
        };
        attempt = 0;
        // 重连后重发全部订阅
        for id in subs.iter() {
            let _ = ws.send(sub_frame(id)).await;
        }
        match serve(&app, &mut ws, &mut cmd_rx, &mut subs, &mut pending).await {
            Served::Shutdown => return,
            // 断线：drop 在途 RPC 应答（rx 得 Err → 命令侧 "ws closed"）
            Served::Disconnected => {
                pending.clear();
                attempt += 1;
            }
        }
    }
}

/// 连接（或 token 变更后重连）。已有 task 则先 Shutdown，立即换上新 channel 的 tx。
#[tauri::command]
pub fn ws_connect(app: AppHandle, state: tauri::State<'_, WsManager>, token: Option<String>) {
    let (tx, rx) = unbounded_channel();
    {
        let mut guard = state.cmd_tx.lock().unwrap();
        if let Some(old) = guard.take() {
            let _ = old.send(WsCmd::Shutdown);
        }
        *guard = Some(tx);
    }
    tauri::async_runtime::spawn(run(app, token, rx));
}

#[tauri::command]
pub fn ws_subscribe_auction(state: tauri::State<'_, WsManager>, auction_id: String) {
    if auction_id.is_empty() {
        return;
    }
    if let Some(tx) = state.cmd_tx.lock().unwrap().as_ref() {
        let _ = tx.send(WsCmd::Subscribe(auction_id));
    }
}

#[tauri::command]
pub fn ws_unsubscribe_auction(state: tauri::State<'_, WsManager>, auction_id: String) {
    if auction_id.is_empty() {
        return;
    }
    if let Some(tx) = state.cmd_tx.lock().unwrap().as_ref() {
        let _ = tx.send(WsCmd::Unsubscribe(auction_id));
    }
}

#[tauri::command]
pub fn ws_disconnect(state: tauri::State<'_, WsManager>) {
    if let Some(old) = state.cmd_tx.lock().unwrap().take() {
        let _ = old.send(WsCmd::Shutdown);
    }
}

/// 发一个 RPC（出价/撤价）并等待按 correlation 匹配的应答（10s 超时）。
/// value 为整数白金（None 时不带，撤价用）。
async fn rpc(
    state: &tauri::State<'_, WsManager>,
    rpc_type: &str,
    auction_id: String,
    bid_id: String,
    value: Option<i64>,
) -> Result<Value, String> {
    let mut payload = serde_json::json!({ "auction_id": auction_id, "bid_id": bid_id });
    if let Some(v) = value {
        payload["value"] = serde_json::json!(v);
    }
    let frame = serde_json::json!({ "type": rpc_type, "payload": payload });
    let corr = format!("{auction_id}::{bid_id}");

    let (resp_tx, resp_rx) = oneshot::channel();
    {
        let guard = state.cmd_tx.lock().unwrap();
        let tx = guard.as_ref().ok_or("ws not connected")?;
        tx.send(WsCmd::Rpc {
            frame,
            corr,
            resp: resp_tx,
        })
        .map_err(|_| "ws not connected")?;
    }

    match tokio::time::timeout(Duration::from_secs(10), resp_rx).await {
        Ok(Ok(v)) => {
            // 业务失败：@WS/ERROR（payload 为字符串）或带 error 字段
            let is_error = v
                .get("type")
                .and_then(|t| t.as_str())
                .map(|t| t.ends_with("ERROR"))
                .unwrap_or(false)
                || v.get("error").map(|e| !e.is_null()).unwrap_or(false)
                || v.get("payload").map(|p| p.is_string()).unwrap_or(false);
            if is_error {
                let msg = v
                    .get("payload")
                    .and_then(|p| p.as_str())
                    .or_else(|| v.get("error").and_then(|e| e.as_str()))
                    .unwrap_or("ws rpc error");
                return Err(msg.to_string());
            }
            Ok(v)
        }
        Ok(Err(_)) => Err("ws closed".into()),
        Err(_) => Err("rpc timeout".into()),
    }
}

/// 出价/加价：bid_id 由前端生成（首次新 id；加价复用已有 id）。
#[tauri::command]
pub async fn ws_bid_set(
    state: tauri::State<'_, WsManager>,
    auction_id: String,
    bid_id: String,
    value: i64,
) -> Result<Value, String> {
    rpc(&state, BID_SET, auction_id, bid_id, Some(value)).await
}

/// 撤价：bid_id 为我的出价 id。
#[tauri::command]
pub async fn ws_bid_remove(
    state: tauri::State<'_, WsManager>,
    auction_id: String,
    bid_id: String,
) -> Result<Value, String> {
    rpc(&state, BID_REMOVE, auction_id, bid_id, None).await
}
