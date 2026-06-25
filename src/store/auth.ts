import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { loadSetting, saveSetting } from "@/lib/tauri/store";
import { resyncSubscriptions } from "@/features/market/ws/live";
import { signIn as apiSignIn, signOut as apiSignOut } from "@/api/auth";
import { parseTokenExpiry } from "@/lib/auth/token";
import type { User } from "@/types/wf-market";

/**
 * 认证状态：JWT(token) + user。对应 doroprime 的 AuthState。
 * token/user 经 tauri-plugin-store（web 回退 localStorage）持久化。
 */

interface PersistedAuth {
    token: string | null;
    user: User | null;
}

const STORE_KEY = "auth";
const EMPTY: PersistedAuth = { token: null, user: null };

interface AuthState {
    token: string | null;
    user: User | null;
    /** token(set-cookie) 的 Expires 解析出的毫秒时间戳；null 表示无过期信息。派生自 token，不单独持久化。 */
    expiresAt: number | null;
    hydrated: boolean;
    isLoggedIn: () => boolean;
    /** token 存在但已过 Expires 时间 —— 用于触发“登录过期”提示。 */
    isExpired: () => boolean;
    hydrate: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

async function persist(token: string | null, user: User | null): Promise<void> {
    await saveSetting<PersistedAuth>(STORE_KEY, { token, user });
}

export const useAuthStore = create<AuthState>((set, get) => ({
    token: null,
    user: null,
    expiresAt: null,
    hydrated: false,
    isLoggedIn: () => {
        const { token, expiresAt } = get();
        if (!token || token.length === 0) return false;
        // 已过 Expires 视为未登录，避免用过期 token 渲染已登录界面
        return !(expiresAt != null && Date.now() >= expiresAt);
    },
    isExpired: () => {
        const { token, expiresAt } = get();
        return !!token && expiresAt != null && Date.now() >= expiresAt;
    },
    hydrate: async () => {
        if (get().hydrated) return;
        const loaded = await loadSetting<PersistedAuth>(STORE_KEY, EMPTY);
        set({
            token: loaded.token,
            user: loaded.user,
            expiresAt: parseTokenExpiry(loaded.token),
            hydrated: true,
        });
        // await 确保 cmd_tx 已就位再补订阅，避免订阅先于连接而丢失
        if (loaded.token) {
            await invoke("ws_connect", { token: loaded.token });
            resyncSubscriptions();
        }
    },
    signIn: async (email, password) => {
        const deviceId = await deviceName();
        const { token, user } = await apiSignIn(email, password, deviceId);
        set({ token, user, expiresAt: parseTokenExpiry(token) });
        await persist(token, user);
        await invoke("ws_connect", { token });
        resyncSubscriptions();
    },
    signOut: async () => {
        const { token } = get();
        try {
            await apiSignOut(token);
        } finally {
            set({ token: null, user: null, expiresAt: null });
            await persist(null, null);
            void invoke("ws_disconnect");
        }
    },
}));

async function deviceName(): Promise<string> {
    const ua =
        typeof navigator !== "undefined" && navigator.userAgent
            ? navigator.userAgent
            : "doroframe";
    // 后端限制 device_id 最长 64 字符
    return ua.slice(0, 64);
}
