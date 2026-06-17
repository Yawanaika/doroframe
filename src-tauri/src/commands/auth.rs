use std::time::Duration;

use serde_json::{json, Value};

const V1: &str = "https://api.warframe.market/v1";

pub struct AuthHttp {
    client: reqwest::Client,
}

impl AuthHttp {
    pub fn new() -> Self {
        let client = reqwest::Client::builder()
            // 登录响应通过 set-cookie 返回 JWT，需要手动读取，禁用自动 cookie store
            .user_agent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 \
                 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            )
            .timeout(Duration::from_secs(20))
            .build()
            .expect("build reqwest client");
        Self { client }
    }
}

/// `POST /v1/auth/signin` —— 邮箱密码登录。
/// 成功后从 `set-cookie` 取出 JWT，连同 user 一并返回前端持久化。
#[tauri::command]
pub async fn market_sign_in(
    state: tauri::State<'_, AuthHttp>,
    email: String,
    password: String,
    device_id: String,
) -> Result<Value, String> {
    let resp = state
        .client
        .post(format!("{V1}/auth/signin"))
        .header("Content-Type", "application/json")
        .header("Platform", "pc")
        .header("Language", "zh-hans")
        .header("Authorization", "123")
        .json(&json!({
            "email": email,
            "password": password,
            "device_id": device_id,
        }))
        .send()
        .await
        .map_err(|e| format!("signin request failed: {e}"))?;

    let status = resp.status();
    let token = resp
        .headers()
        .get("set-cookie")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_string());

    let body: Value = resp
        .json()
        .await
        .map_err(|e| format!("signin decode failed: {e}"))?;

    if !status.is_success() {
        return Err(format!("signin http {status}: {body}"));
    }

    let user = body
        .get("payload")
        .and_then(|p| p.get("user"))
        .cloned()
        .ok_or_else(|| "signin response missing user".to_string())?;

    Ok(json!({ "token": token, "user": user }))
}

/// `GET /v1/auth/signout` —— 登出。携带当前 token，清除后端会话。
#[tauri::command]
pub async fn market_sign_out(
    state: tauri::State<'_, AuthHttp>,
    token: Option<String>,
) -> Result<(), String> {
    let mut req = state
        .client
        .get(format!("{V1}/auth/signout"))
        .header("Platform", "pc")
        .header("Language", "zh-hans");
    if let Some(token) = token.filter(|t| !t.is_empty()) {
        req = req.header("Cookie", token);
    }

    req.send()
        .await
        .map_err(|e| format!("signout request failed: {e}"))?;
    Ok(())
}
