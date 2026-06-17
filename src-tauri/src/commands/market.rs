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

/// 统一请求：带 Platform/Language header，解 `{ data, error }` 信封后返回 data。
/// 业务错误（error 非空）优先于 HTTP 状态码上报。
async fn fetch_data(
    client: &reqwest::Client,
    url: &str,
    language: &str,
) -> Result<Value, String> {
    let resp = client
        .get(url)
        .header("Platform", "pc")
        .header("Language", language)
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
        return Err(format!("market http {status}"));
    }

    match body.get_mut("data") {
        Some(data) => Ok(data.take()),
        None => Err("market response missing data".to_string()),
    }
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

/// `GET /v2/item/{slug}/set` —— 物品所属套装信息（主件 + 部件）。
#[tauri::command]
pub async fn get_market_set(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/item/{slug}/set"), &language).await
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
    let mut req = state
        .client
        .post(format!("{V2}/order"))
        .header("Content-Type", "application/json")
        .header("Platform", "pc")
        .header("Language", &language)
        .json(&order);
    if let Some(token) = token.filter(|t| !t.is_empty()) {
        req = req.header("Cookie", token);
    }

    let resp = req
        .send()
        .await
        .map_err(|e| format!("create order request failed: {e}"))?;

    let status = resp.status();
    let mut body: Value = resp
        .json()
        .await
        .map_err(|e| format!("create order decode failed: {e}"))?;

    if let Some(error) = body.get("error") {
        if !error.is_null() {
            return Err(format!("market api error: {error}"));
        }
    }
    if !status.is_success() {
        return Err(format!("create order http {status}: {body}"));
    }

    match body.get_mut("data") {
        Some(data) => Ok(data.take()),
        None => Err("create order response missing data".to_string()),
    }
}
