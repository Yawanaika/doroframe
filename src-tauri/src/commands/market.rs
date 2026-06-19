use std::time::{Duration, Instant};

use serde_json::Value;
use tokio::sync::Mutex;

const V2: &str = "https://api.warframe.market/v2";
// items 列表极少变动，长缓存；orders/set 实时性强，不缓存。
const ITEMS_TTL: Duration = Duration::from_secs(6 * 60 * 60);

pub struct MarketHttp {
    client: reqwest::Client,
    // 按语言缓存 items（Language header 会影响 i18n 内容）
    items: Mutex<Option<(Instant, String, Value)>>,
}

impl MarketHttp {
    pub fn new() -> Self {
        let client = reqwest::Client::builder()
            .user_agent("DoroFrame/0.1")
            .timeout(Duration::from_secs(20))
            .build()
            .expect("build reqwest client");
        Self {
            client,
            items: Mutex::new(None),
        }
    }
}

/// 通用请求：支持任意 HTTP 方法，带 Platform/Language header；
/// `token` 非空时注入 JWT Cookie，`body` 存在时作为 JSON 请求体。
/// 解 `{ data, error }` 信封后返回 data，业务错误（error 非空）优先于 HTTP 状态码上报。
async fn request_data(
    client: &reqwest::Client,
    method: reqwest::Method,
    url: &str,
    language: &str,
    token: Option<&str>,
    body: Option<&Value>,
) -> Result<Value, String> {
    let mut req = client
        .request(method, url)
        .header("Platform", "pc")
        .header("Language", language);
    if let Some(token) = token.filter(|t| !t.is_empty()) {
        req = req.header("Cookie", token);
    }
    if let Some(body) = body {
        req = req.header("Content-Type", "application/json").json(body);
    }

    let resp = req
        .send()
        .await
        .map_err(|e| format!("market request failed: {e}"))?;

    let status = resp.status();
    let mut body: Value = resp
        .json()
        .await
        .map_err(|e| format!("market decode failed: {e}"))?;

    if let Some(error) = body.get("error") {
        if !error.is_null() {
            return Err(format!("market api error: {error}"));
        }
    }
    if !status.is_success() {
        return Err(format!("market http {status}: {body}"));
    }

    match body.get_mut("data") {
        Some(data) => Ok(data.take()),
        None => Err("market response missing data".to_string()),
    }
}

/// GET 便捷封装（无 token、无请求体）。
async fn fetch_data(
    client: &reqwest::Client,
    url: &str,
    language: &str,
) -> Result<Value, String> {
    request_data(client, reqwest::Method::GET, url, language, None, None).await
}

/// `GET /v2/items` —— 全量物品列表，用于构建搜索建议。
#[tauri::command]
pub async fn get_market_items(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    {
        let cache = state.items.lock().await;
        if let Some((at, ref lang, ref value)) = *cache {
            if lang == &language && at.elapsed() < ITEMS_TTL {
                return Ok(value.clone());
            }
        }
    }

    let data = fetch_data(&state.client, &format!("{V2}/items"), &language).await?;

    {
        let mut cache = state.items.lock().await;
        *cache = Some((Instant::now(), language, data.clone()));
    }

    Ok(data)
}

/// `GET /v2/orders/item/{slug}` —— 指定物品的全部买卖订单。
#[tauri::command]
pub async fn get_market_orders(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    language: String,
) -> Result<Value, String> {
    fetch_data(
        &state.client,
        &format!("{V2}/orders/item/{slug}"),
        &language,
    )
    .await
}

/// `GET /v2/orders/recent` —— 最近 4 小时内、在线非封禁用户的可见订单（最多 500 条，
/// 按 createdAt 倒序）。受 Platform/Crossplay header 影响，服务端 1 分钟缓存。无需登录。
#[tauri::command]
pub async fn get_orders_recent(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/orders/recent"), &language).await
}

/// `GET /v2/orders/item/{slug}/top` —— 指定物品的Top5订单。
#[tauri::command]
pub async fn get_orders_top(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    language: String,
) -> Result<Value, String>{
    fetch_data(&state.client, &format!("{V2}/orders/item/{slug}/top"), &language).await
}

/// `GET /v2/item/{slug}/set` —— 物品所属套装信息（主件 + 部件）。
#[tauri::command]
pub async fn get_market_set(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/item/{slug}/set"), &language).await
}

/// `GET /v2/orders/user/{slug}` —— 当前登录用户的全部订单。
/// 公开订单无需登录也能拉取；携带 JWT cookie 可一并取回不可见(visible=false)的订单。
#[tauri::command]
pub async fn get_user_orders(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    token: Option<String>,
    language: String,
) -> Result<Value, String> {
    request_data(
        &state.client,
        reqwest::Method::GET,
        &format!("{V2}/orders/user/{slug}"),
        &language,
        token.as_deref(),
        None,
    )
    .await
}

/// `PATCH /v2/order/{id}` —— 编辑订单（platinum/quantity/visible/rank/subtype 等）。
/// 需登录态：携带 JWT cookie。`order` 为部分字段的 SubmitItemOrder JSON。
/// 成功后返回更新后的订单数据。
#[tauri::command]
pub async fn edit_market_order(
    state: tauri::State<'_, MarketHttp>,
    id: String,
    token: Option<String>,
    order: Value,
    language: String,
) -> Result<Value, String> {
    request_data(
        &state.client,
        reqwest::Method::PATCH,
        &format!("{V2}/order/{id}"),
        &language,
        token.as_deref(),
        Some(&order),
    )
    .await
}

/// `PATCH /v2/orders/group/{id}` —— 批量改某虚拟订单组的可见性。需登录态：携带 JWT cookie。
/// `id` 为组 id（当前支持 `all` / `ungrouped`）；`order` 为 `{ visible, type }`，
/// 按 type（sell/buy）筛选该组订单并统一设置 visible。返回 `{ updated: <数量> }`。
#[tauri::command]
pub async fn edit_market_orders_group(
    state: tauri::State<'_, MarketHttp>,
    id: String,
    token: Option<String>,
    order: Value,
    language: String,
) -> Result<Value, String> {
    request_data(
        &state.client,
        reqwest::Method::PATCH,
        &format!("{V2}/orders/group/{id}"),
        &language,
        token.as_deref(),
        Some(&order),
    )
    .await
}

/// `POST /v2/order` —— 创建订单。需登录态：携带 JWT cookie。
/// 成功后返回创建的订单数据。
#[tauri::command]
pub async fn create_market_order(
    state: tauri::State<'_, MarketHttp>,
    token: Option<String>,
    order: Value,
    language: String,
) -> Result<Value, String> {
    request_data(
        &state.client,
        reqwest::Method::POST,
        &format!("{V2}/order"),
        &language,
        token.as_deref(),
        Some(&order),
    )
    .await
}

/// `POST /v2/order/{id}/close` —— 关闭（成交）订单。需登录态：携带 JWT cookie。
/// `order` 通常为 `{ quantity }`，关闭部分数量；返回成交记录。
#[tauri::command]
pub async fn close_market_order(
    state: tauri::State<'_, MarketHttp>,
    id: String,
    token: Option<String>,
    order: Value,
    language: String,
) -> Result<Value, String> {
    request_data(
        &state.client,
        reqwest::Method::POST,
        &format!("{V2}/order/{id}/close"),
        &language,
        token.as_deref(),
        Some(&order),
    )
    .await
}

/// `DELETE /v2/order/{id}` —— 删除订单。需登录态：携带 JWT cookie。无请求体。
#[tauri::command]
pub async fn delete_market_order(
    state: tauri::State<'_, MarketHttp>,
    id: String,
    token: Option<String>,
    language: String,
) -> Result<Value, String> {
    request_data(
        &state.client,
        reqwest::Method::DELETE,
        &format!("{V2}/order/{id}"),
        &language,
        token.as_deref(),
        None,
    )
    .await
}
