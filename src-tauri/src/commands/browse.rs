use std::time::{Duration, Instant};

use serde_json::{Map, Value};
use tokio::sync::Mutex;

const BROWSE_URL: &str = "https://browse.wf/";
const BROWSE_ORACLE_URL: &str = "https://oracle.browse.wf/";
// arbys / sp-incursions 是长期排期表，缓存久一些；bounty-cycle 实时性强，短缓存
const SCHEDULE_TTL: Duration = Duration::from_secs(24 * 60 * 60);
const BOUNTY_CYCLE_TTL: Duration = Duration::from_secs(15);

type Cache = Mutex<Option<(Instant, Value)>>;

pub struct BrowseHttp {
    client: reqwest::Client,
    // 每个端点独立缓存，避免相互覆盖
    arby: Cache,
    sp_incursions: Cache,
    bounty_cycle: Cache,
}

impl BrowseHttp {
    pub fn new() -> Self {
        let client = reqwest::Client::builder()
            .user_agent("DoroFrame/0.1")
            .timeout(Duration::from_secs(15))
            .build()
            .expect("build reqwest client");
        Self {
            client,
            arby: Mutex::new(None),
            sp_incursions: Mutex::new(None),
            bounty_cycle: Mutex::new(None),
        }
    }
}

async fn cached(cache: &Cache, ttl: Duration) -> Option<Value> {
    let guard = cache.lock().await;
    if let Some((at, ref value)) = *guard {
        if at.elapsed() < ttl {
            return Some(value.clone());
        }
    }
    None
}

async fn store(cache: &Cache, value: Value) {
    let mut guard = cache.lock().await;
    *guard = Some((Instant::now(), value));
}

/// arbys.txt：每行 `timestamp,node` → { "timestamp": "node" }
fn parse_arby(text: &str) -> Value {
    let mut map = Map::new();
    for line in text.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        if let Some((ts, node)) = line.split_once(',') {
            map.insert(ts.to_string(), Value::String(node.to_string()));
        }
    }
    Value::Object(map)
}

/// sp-incursions.txt：每行 `timestamp;node,node,...` → { "timestamp": ["node", ...] }
fn parse_incursions(text: &str) -> Value {
    let mut map = Map::new();
    for line in text.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        if let Some((ts, nodes)) = line.split_once(';') {
            let nodes = nodes
                .split(',')
                .filter(|s| !s.is_empty())
                .map(|s| Value::String(s.to_string()))
                .collect();
            map.insert(ts.to_string(), Value::Array(nodes));
        }
    }
    Value::Object(map)
}

#[tauri::command]
pub async fn get_arby(state: tauri::State<'_, BrowseHttp>) -> Result<Value, String> {
    if let Some(value) = cached(&state.arby, SCHEDULE_TTL).await {
        return Ok(value);
    }

    let resp = state
        .client
        .get(format!("{BROWSE_URL}arbys.txt"))
        .send()
        .await
        .map_err(|e| format!("arby request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("arby http {}", resp.status()));
    }

    let text = resp
        .text()
        .await
        .map_err(|e| format!("arby decode failed: {e}"))?;

    let body = parse_arby(&text);
    store(&state.arby, body.clone()).await;
    Ok(body)
}

#[tauri::command]
pub async fn get_sp_incursions(state: tauri::State<'_, BrowseHttp>) -> Result<Value, String> {
    if let Some(value) = cached(&state.sp_incursions, SCHEDULE_TTL).await {
        return Ok(value);
    }

    let resp = state
        .client
        .get(format!("{BROWSE_URL}sp-incursions.txt"))
        .send()
        .await
        .map_err(|e| format!("sp-incursions request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("sp-incursions http {}", resp.status()));
    }

    let text = resp
        .text()
        .await
        .map_err(|e| format!("sp-incursions decode failed: {e}"))?;

    let body = parse_incursions(&text);
    store(&state.sp_incursions, body.clone()).await;
    Ok(body)
}

#[tauri::command]
pub async fn get_bounty_cycle(state: tauri::State<'_, BrowseHttp>) -> Result<Value, String> {
    if let Some(value) = cached(&state.bounty_cycle, BOUNTY_CYCLE_TTL).await {
        return Ok(value);
    }

    let resp = state
        .client
        .get(format!("{BROWSE_ORACLE_URL}bounty-cycle"))
        .send()
        .await
        .map_err(|e| format!("bounty-cycle request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("bounty-cycle http {}", resp.status()));
    }

    let body: Value = resp
        .json()
        .await
        .map_err(|e| format!("bounty-cycle decode failed: {e}"))?;

    store(&state.bounty_cycle, body.clone()).await;
    Ok(body)
}
