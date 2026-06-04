import { create } from "zustand";
import { loadSetting, saveSetting } from "@/lib/tauri/store";
import { setActiveLang } from "@/lib/wpep";
import { loadLangBundle } from "@/lib/i18n";

export type ThemeMode = "light" | "dark" | "system";
export type LangCode = "zh" | "en";

export interface Settings {
    theme: ThemeMode;
    lang: LangCode;
    notifyAlert: boolean;
    notifyVoidTrader: boolean;
    notifyBaro: boolean;
    autoRefreshSec: number;
}

const DEFAULTS: Settings = {
    theme: "system",
    lang: "zh",
    notifyAlert: true,
    notifyVoidTrader: true,
    notifyBaro: false,
    autoRefreshSec: 30,
};

interface SettingsState extends Settings {
    hydrated: boolean;
    hydrate: () => Promise<void>;
    update: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    ...DEFAULTS,
    hydrated: false,
    hydrate: async () => {
        if (get().hydrated) return;
        const loaded = await loadSetting<Settings>("settings", DEFAULTS);
        set({ ...DEFAULTS, ...loaded, hydrated: true });
        applyTheme(loaded.theme ?? DEFAULTS.theme);
        setActiveLang(loaded.lang ?? DEFAULTS.lang);
        void loadLangBundle(loaded.lang ?? DEFAULTS.lang);
    },
    update: async (key, value) => {
        const next = { ...get(), [key]: value } as Settings;
        set({ [key]: value } as Partial<SettingsState>);
        if (key === "theme") applyTheme(value as ThemeMode);
        if (key === "lang") {
            setActiveLang(value as LangCode);
            void loadLangBundle(value as LangCode);
        }
        await saveSetting<Settings>("settings", {
            theme: next.theme,
            lang: next.lang,
            notifyAlert: next.notifyAlert,
            notifyVoidTrader: next.notifyVoidTrader,
            notifyBaro: next.notifyBaro,
            autoRefreshSec: next.autoRefreshSec,
        });
    },
}));

function applyTheme(mode: ThemeMode) {
    const root = document.documentElement;
    const dark =
        mode === "dark" ||
        (mode === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", dark);
}
