use std::time::{Duration, Instant};

use serde_json::Value;
use tokio::sync::Mutex;

const WORLD_STATE_URL: &str = "https://api.warframe.com/cdn/worldState.php";
// const WORLD_STATE_MOCK_URL: &str = "http://127.0.0.1:4523/m2/7149342-6873232-default/366666521";
const CACHE_TTL: Duration = Duration::from_secs(20);

pub struct WorldHttp {
    client: reqwest::Client,
    cache: Mutex<Option<(Instant, Value)>>,
}

impl WorldHttp {
    pub fn new() -> Self {
        let client = reqwest::Client::builder()
            .user_agent("DoroFrame/0.1")
            .timeout(Duration::from_secs(15))
            .build()
            .expect("build reqwest client");
        Self {
            client,
            cache: Mutex::new(None),
        }
    }
}

#[tauri::command]
pub async fn get_world_state(state: tauri::State<'_, WorldHttp>) -> Result<Value, String> {
    {
        let cache = state.cache.lock().await;
        if let Some((at, ref value)) = *cache {
            if at.elapsed() < CACHE_TTL {
                return Ok(value.clone());
            }
        }
    }

    let resp = state
        .client
        .get(WORLD_STATE_URL)
        .send()
        .await
        .map_err(|e| format!("worldstate request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("worldstate http {}", resp.status()));
    }

    let body: Value = resp
        .json()
        .await
        .map_err(|e| format!("worldstate decode failed: {e}"))?;

    {
        let mut cache = state.cache.lock().await;
        *cache = Some((Instant::now(), body.clone()));
    }

    Ok(body)
}
