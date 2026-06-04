import { LazyStore } from "@tauri-apps/plugin-store";

const isTauri = typeof (globalThis as any).__TAURI_INTERNALS__ !== "undefined";

let store: LazyStore | null = null;
function getStore(): LazyStore | null {
    if (!isTauri) return null;
    if (!store) store = new LazyStore("settings.json");
    return store;
}

export async function loadSetting<T>(key: string, fallback: T): Promise<T> {
    const s = getStore();
    if (!s) {
        try {
            const raw = localStorage.getItem(`doroframe:${key}`);
            return raw ? (JSON.parse(raw) as T) : fallback;
        } catch {
            return fallback;
        }
    }
    const v = await s.get<T>(key);
    return (v ?? fallback) as T;
}

export async function saveSetting<T>(key: string, value: T): Promise<void> {
    const s = getStore();
    if (!s) {
        try {
            localStorage.setItem(`doroframe:${key}`, JSON.stringify(value));
        } catch {
            /* noop */
        }
        return;
    }
    await s.set(key, value);
    await s.save();
}
