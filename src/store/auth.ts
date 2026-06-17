import { create } from "zustand";
import { loadSetting, saveSetting } from "@/lib/tauri/store";
import { signIn as apiSignIn, signOut as apiSignOut } from "@/api/auth";
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
    hydrated: boolean;
    isLoggedIn: () => boolean;
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
    hydrated: false,
    isLoggedIn: () => {
        const { token } = get();
        return !!token && token.length > 0;
    },
    hydrate: async () => {
        if (get().hydrated) return;
        const loaded = await loadSetting<PersistedAuth>(STORE_KEY, EMPTY);
        set({ token: loaded.token, user: loaded.user, hydrated: true });
    },
    signIn: async (email, password) => {
        const deviceId = await deviceName();
        const { token, user } = await apiSignIn(email, password, deviceId);
        set({ token, user });
        await persist(token, user);
    },
    signOut: async () => {
        const { token } = get();
        try {
            await apiSignOut(token);
        } finally {
            set({ token: null, user: null });
            await persist(null, null);
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
