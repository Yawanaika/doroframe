import { create } from "zustand";
import { loadSetting, saveSetting } from "@/lib/tauri/store";
import { setActiveLang } from "@/lib/wpep";
import { loadLangBundle } from "@/lib/i18n";

// ── 动态发现主题模块 ────────────────────────────────────────────

const primaryModules = import.meta.glob(
    "@/themes/primary/*.css",
    { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const baseModules = import.meta.glob(
    "@/themes/base/*.css",
    { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const chartModules = import.meta.glob(
    "@/themes/chart/*.css",
    { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

function extractNames(modules: Record<string, string>): string[] {
    return Object.keys(modules)
        .map((k) => k.split("/").pop()!.replace(".css", ""))
        .sort();
}

export const PRIMARY_OPTIONS = extractNames(primaryModules);
export const BASE_OPTIONS = extractNames(baseModules);
export const CHART_OPTIONS = extractNames(chartModules);

const DEFAULT = "islands";
export const DEFAULT_PRIMARY = DEFAULT;
export const DEFAULT_BASE = DEFAULT;
export const DEFAULT_CHART = DEFAULT;

// ── 组合 CSS ─────────────────────────────────────────────────────

function findModule(modules: Record<string, string>, dir: string, name: string): string {
    const target = `/${dir}/${name}.css`;
    for (const [key, value] of Object.entries(modules)) {
        if (key.endsWith(target)) return value;
    }
    return "";
}

function composeThemeCss(primary: string, base: string, chart: string): string {
    const p = findModule(primaryModules, "primary", primary);
    const b = findModule(baseModules, "base", base);
    const c = findModule(chartModules, "chart", chart);
    return `${p}\n${b}\n${c}`;
}

export function applyColorTheme(primary: string, base: string, chart: string) {
    let el = document.getElementById("color-theme-style") as HTMLStyleElement | null;
    if (!el) {
        el = document.createElement("style");
        el.id = "color-theme-style";
        document.head.appendChild(el);
    }
    el.textContent = composeThemeCss(primary, base, chart);
}

// ── 外观模式（浅色 / 深色 / 自动）──────────────────────────────

export type ThemeMode = "light" | "dark" | "system";

const systemMedia = window.matchMedia("(prefers-color-scheme: dark)");

export function applyTheme(mode: ThemeMode) {
    const dark =
        mode === "dark" || (mode === "system" && systemMedia.matches);
    document.documentElement.classList.toggle("dark", dark);
}

systemMedia.addEventListener("change", () => {
    const { theme } = useSettingsStore.getState();
    if (theme === "system") applyTheme(theme);
});

// ── Store ────────────────────────────────────────────────────────

export type LangCode = "zh" | "en";

export interface Settings {
    theme: ThemeMode;
    primaryColor: string;
    baseColor: string;
    chartColor: string;
    lang: LangCode;
    notifyAlert: boolean;
    notifyVoidTrader: boolean;
    notifyBaro: boolean;
    autoRefreshSec: number;
}

const DEFAULTS: Settings = {
    theme: "system",
    primaryColor: DEFAULT_PRIMARY,
    baseColor: DEFAULT_BASE,
    chartColor: DEFAULT_CHART,
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
        applyColorTheme(
            loaded.primaryColor ?? DEFAULTS.primaryColor,
            loaded.baseColor ?? DEFAULTS.baseColor,
            loaded.chartColor ?? DEFAULTS.chartColor,
        );
        applyTheme(loaded.theme ?? DEFAULTS.theme);
        setActiveLang(loaded.lang ?? DEFAULTS.lang);
        void loadLangBundle(loaded.lang ?? DEFAULTS.lang);
    },
    update: async (key, value) => {
        const prev = get();
        const next = { ...prev, [key]: value } as Settings;
        set({ [key]: value } as Partial<SettingsState>);
        if (key === "primaryColor" || key === "baseColor" || key === "chartColor") {
            applyColorTheme(
                key === "primaryColor" ? (value as string) : prev.primaryColor,
                key === "baseColor" ? (value as string) : prev.baseColor,
                key === "chartColor" ? (value as string) : prev.chartColor,
            );
        }
        if (key === "theme") applyTheme(value as ThemeMode);
        if (key === "lang") {
            setActiveLang(value as LangCode);
            void loadLangBundle(value as LangCode);
        }
        await saveSetting<Settings>("settings", {
            theme: next.theme,
            primaryColor: next.primaryColor,
            baseColor: next.baseColor,
            chartColor: next.chartColor,
            lang: next.lang,
            notifyAlert: next.notifyAlert,
            notifyVoidTrader: next.notifyVoidTrader,
            notifyBaro: next.notifyBaro,
            autoRefreshSec: next.autoRefreshSec,
        });
    },
}));
