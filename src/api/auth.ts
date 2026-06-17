import { invoke } from "@tauri-apps/api/core";
import { userFromJson, type User } from "@/types/wf-market";

/**
 * Tauri 入口：登录/登出经由 Rust 端 `market_sign_*` command。
 * 登录返回的 JWT 通过 set-cookie 头传回，前端持久化后随后续请求注入。
 */

export interface SignInResult {
    token: string | null;
    user: User;
}

export async function signIn(
    email: string,
    password: string,
    deviceId: string,
): Promise<SignInResult> {
    const raw = await invoke<{ token: string | null; user: unknown }>(
        "market_sign_in",
        { email, password, deviceId },
    );
    return { token: raw.token, user: userFromJson(raw.user) };
}

export async function signOut(token: string | null): Promise<void> {
    await invoke("market_sign_out", { token });
}
