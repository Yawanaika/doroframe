// warframe.market WebSocket（阶段一：只读实时刷新）。
// WebView 原生 WebSocket 不能带 Cookie 头，故在 Rust 侧建连：单后台 task 拥有连接、
// 订阅集合与重连；命令通过 channel 投递指令；服务端推送原样 emit 给前端按 type 分发。
// 不含出价/撤价（RPC correlation 留到阶段二）。

use std::collections::HashSet;
use std::sync::Mutex;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use tauri::{AppHandle, Emitter};
use tokio::net::TcpStream;
use tokio::sync::mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender};
use tokio_tungstenite::tungstenite::handshake::client::generate_key;
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::{connect_async, MaybeTlsStream, WebSocketStream};

const URL: &str = "wss://warframe.market/socket?platform=pc";
const EVENT: &str = "market://ws-event";

type Ws = WebSocketStream<MaybeTlsStream<TcpStream>>;

enum WsCmd {
    Subscribe(String),
    Unsubscribe(String),
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

/// 已连接时主循环：读 ws 帧 → emit；同时消费 cmd（订阅/退订/关闭）。
async fn serve(
    app: &AppHandle,
    ws: &mut Ws,
    cmd_rx: &mut UnboundedReceiver<WsCmd>,
    subs: &mut HashSet<String>,
) -> Served {
    loop {
        tokio::select! {
            msg = ws.next() => match msg {
                Some(Ok(Message::Text(t))) => {
                    if let Ok(v) = serde_json::from_str::<serde_json::Value>(t.as_str()) {
                        let _ = app.emit(EVENT, v);
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
                Some(WsCmd::Shutdown) | None => return false,
            },
        }
    }
}

async fn run(app: AppHandle, token: Option<String>, mut cmd_rx: UnboundedReceiver<WsCmd>) {
    let mut subs: HashSet<String> = HashSet::new();
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
        match serve(&app, &mut ws, &mut cmd_rx, &mut subs).await {
            Served::Shutdown => return,
            Served::Disconnected => attempt += 1,
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
