use std::time::{Duration, Instant};

use serde_json::Value;
use tokio::sync::Mutex;

const V1: &str = "https://api.warframe.market/v1";
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
/// 按 `envelope` 解信封字段（v2 为 `data`，v1 为 `payload`）后返回其值，
/// 业务错误（error 非空）优先于 HTTP 状态码上报。
async fn request_envelope(
    client: &reqwest::Client,
    method: reqwest::Method,
    url: &str,
    language: &str,
    token: Option<&str>,
    body: Option<&Value>,
    envelope: &str,
) -> Result<Value, String> {
    let mut req = client
        .request(method, url)
        .header("Platform", "pc")
        .header("Language", language);
    if let Some(token) = token.filter(|t| !t.is_empty()) {
        req = req.header("Cookie", token);
        // v1接口需要Authorization
        req = req.header("Authorization", token);
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

    match body.get_mut(envelope) {
        Some(value) => Ok(value.take()),
        None => Err(format!("market response missing {envelope}")),
    }
}

/// v2 信封请求：解 `{ data, error }` 后返回 data。
async fn request_data(
    client: &reqwest::Client,
    method: reqwest::Method,
    url: &str,
    language: &str,
    token: Option<&str>,
    body: Option<&Value>,
) -> Result<Value, String> {
    request_envelope(client, method, url, language, token, body, "data").await
}

/// v1 信封请求：解 `{ payload, error }` 后返回 payload（拍卖等 v1 端点用）。
async fn request_payload(
    client: &reqwest::Client,
    method: reqwest::Method,
    url: &str,
    language: &str,
    token: Option<&str>,
    body: Option<&Value>,
) -> Result<Value, String> {
    request_envelope(client, method, url, language, token, body, "payload").await
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

/// `GET /v2/orders/item/{slug}/top` —— 指定物品某变体的 Top5 买卖订单。
/// 可选 rank/rankLt/charges/amberStars/cyanStars/subtype 过滤，
/// 使行情参考与正在编辑的订单变体一致；缺省则返回该物品的整体 Top5。
#[tauri::command]
pub async fn get_orders_top(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    language: String,
    rank: Option<i64>,
    rank_lt: Option<i64>,
    charges: Option<i64>,
    amber_stars: Option<i64>,
    cyan_stars: Option<i64>,
    subtype: Option<String>,
) -> Result<Value, String> {
    let mut params: Vec<(&str, String)> = Vec::new();
    if let Some(v) = rank {
        params.push(("rank", v.to_string()));
    }
    // rankLt 优先于 rank：匹配「低于该值」的 rank（未满级订单归为一档）
    if let Some(v) = rank_lt {
        params.push(("rankLt", v.to_string()));
    }
    if let Some(v) = charges {
        params.push(("charges", v.to_string()));
    }
    if let Some(v) = amber_stars {
        params.push(("amberStars", v.to_string()));
    }
    if let Some(v) = cyan_stars {
        params.push(("cyanStars", v.to_string()));
    }
    if let Some(v) = subtype.filter(|s| !s.is_empty()) {
        params.push(("subtype", v));
    }

    let base = format!("{V2}/orders/item/{slug}/top");
    let url = if params.is_empty() {
        base
    } else {
        reqwest::Url::parse_with_params(&base, &params)
            .map_err(|e| format!("build top url failed: {e}"))?
            .to_string()
    };
    fetch_data(&state.client, &url, &language).await
}

// ===== 拍卖（v1）=====
// 拍卖端点全部走 v1，信封为 `{ payload, error }`，故用 request_payload 取值。

/// `GET /v1/auctions` —— 拍卖大厅默认列表（payload.auctions 数组）。
#[tauri::command]
pub async fn get_auctions(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    let mut payload =
        request_payload(&state.client, reqwest::Method::GET, &format!("{V1}/auctions"), &language, None, None)
            .await?;
    Ok(payload
        .get_mut("auctions")
        .map(|v| v.take())
        .unwrap_or(Value::Array(vec![])))
}

/// `GET /v1/auctions/search` —— 按条件搜索拍卖（payload.auctions 数组）。
/// `params` 为搜索条件对象，遍历其非空项拼成 query string。
#[tauri::command]
pub async fn search_auctions(
    state: tauri::State<'_, MarketHttp>,
    language: String,
    params: Value,
) -> Result<Value, String> {
    let mut query: Vec<(String, String)> = Vec::new();
    if let Some(obj) = params.as_object() {
        for (k, v) in obj {
            if v.is_null() {
                continue;
            }
            // 字符串原样取，其余用 JSON 文本（数字/布尔），跳过空串
            let s = match v {
                Value::String(s) => s.clone(),
                _ => v.to_string(),
            };
            if s.is_empty() {
                continue;
            }
            query.push((k.clone(), s));
        }
    }

    let base = format!("{V1}/auctions/search");
    let url = if query.is_empty() {
        base
    } else {
        reqwest::Url::parse_with_params(&base, &query)
            .map_err(|e| format!("build search url failed: {e}"))?
            .to_string()
    };

    let mut payload =
        request_payload(&state.client, reqwest::Method::GET, &url, &language, None, None).await?;
    Ok(payload
        .get_mut("auctions")
        .map(|v| v.take())
        .unwrap_or(Value::Array(vec![])))
}

/// `POST /v1/auctions/create` —— 创建拍卖订单（payload.auction 单对象）。
/// 需登录态：携带 JWT cookie。`body` 为 AuctionOrderParams JSON。
#[tauri::command]
pub async fn create_auction(
    state: tauri::State<'_, MarketHttp>,
    token: Option<String>,
    body: Value,
    language: String,
) -> Result<Value, String> {
    let mut payload = request_payload(
        &state.client,
        reqwest::Method::POST,
        &format!("{V1}/auctions/create"),
        &language,
        token.as_deref(),
        Some(&body),
    )
    .await?;
    Ok(payload
        .get_mut("auction")
        .map(|v| v.take())
        .unwrap_or(payload))
}

/// `GET /v1/profile/{slug}/auctions` —— 指定用户上架的拍卖（payload.auctions 数组）。
/// 携带 JWT cookie 时可取回自己不可见的拍卖；本应用用于「我的拍卖」。
#[tauri::command]
pub async fn get_user_auctions(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    token: Option<String>,
    language: String,
) -> Result<Value, String> {
    let mut payload = request_payload(
        &state.client,
        reqwest::Method::GET,
        &format!("{V1}/profile/{slug}/auctions"),
        &language,
        token.as_deref(),
        None,
    )
    .await?;
    Ok(payload
        .get_mut("auctions")
        .map(|v| v.take())
        .unwrap_or(Value::Array(vec![])))
}

/// `GET /v1/profile/auctions/participant` —— 当前登录用户参与出价的拍卖（payload.auctions 数组）。
/// 需登录态：携带 JWT cookie。
#[tauri::command]
pub async fn get_my_auction_participant(
    state: tauri::State<'_, MarketHttp>,
    token: Option<String>,
    language: String,
) -> Result<Value, String> {
    let mut payload = request_payload(
        &state.client,
        reqwest::Method::GET,
        &format!("{V1}/profile/auctions/participant"),
        &language,
        token.as_deref(),
        None,
    )
    .await?;
    Ok(payload
        .get_mut("auctions")
        .map(|v| v.take())
        .unwrap_or(Value::Array(vec![])))
}

/// `GET /v2/riven/weapons` —— 全部可交易紫卡（裂罅）武器列表。
#[tauri::command]
pub async fn get_riven_weapons(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/riven/weapons"), &language).await
}

/// `GET /v2/riven/weapon/{slug}` —— 单个紫卡武器详情。
#[tauri::command]
pub async fn get_riven_weapon(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/riven/weapon/{slug}"), &language).await
}

/// `GET /v2/riven/attributes` —— 全部紫卡词条。
#[tauri::command]
pub async fn get_riven_attributes(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/riven/attributes"), &language).await
}

/// `GET /v2/lich/weapons` —— 全部可交易赤毒武器列表。
#[tauri::command]
pub async fn get_lich_weapons(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/lich/weapons"), &language).await
}

/// `GET /v2/lich/weapon/{slug}` —— 单个赤毒武器详情。
#[tauri::command]
pub async fn get_lich_weapon(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/lich/weapon/{slug}"), &language).await
}

/// `GET /v2/lich/ephemeras` —— 全部可交易赤毒幻纹。
#[tauri::command]
pub async fn get_lich_ephemeras(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/lich/ephemeras"), &language).await
}

/// `GET /v2/lich/quirks` —— 全部可交易赤毒怪癖。
#[tauri::command]
pub async fn get_lich_quirks(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/lich/quirks"), &language).await
}

/// `GET /v2/sister/weapons` —— 全部可交易姐妹武器列表。
#[tauri::command]
pub async fn get_sister_weapons(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/sister/weapons"), &language).await
}

/// `GET /v2/sister/weapon/{slug}` —— 单个姐妹武器详情。
#[tauri::command]
pub async fn get_sister_weapon(
    state: tauri::State<'_, MarketHttp>,
    slug: String,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/sister/weapon/{slug}"), &language).await
}

/// `GET /v2/sister/ephemeras` —— 全部可交易姐妹幻纹。
#[tauri::command]
pub async fn get_sister_ephemeras(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/sister/ephemeras"), &language).await
}

/// `GET /v2/sister/quirks` —— 全部可交易姐妹怪癖。
#[tauri::command]
pub async fn get_sister_quirks(
    state: tauri::State<'_, MarketHttp>,
    language: String,
) -> Result<Value, String> {
    fetch_data(&state.client, &format!("{V2}/sister/quirks"), &language).await
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
