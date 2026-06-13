import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGS = ["zh", "en"] as const;
export type UiLang = (typeof SUPPORTED_LANGS)[number];

// 对应 public/lang/{lang}/*.json 的文件名（不含后缀）
const DATA_FILES = [
    "common",
    "sorty.boss",
    "sorty.modifer",
    "sorty.modifer.desc",
    "relic.dict",
    "void.dict",
    "invasion.dict",
    "descent.dict",
    "syndicate.jobs",
    "npc",
    "month",
    "calender",
] as const;

// 按语言记录已 fetch 过的文件，避免切回去再拉一次
const loadedFiles: Partial<Record<UiLang, Set<string>>> = {};

const fetchLocaleFile = async (
    lang: UiLang,
    ns: string,
): Promise<Record<string, string> | null> => {
    try {
        const r = await fetch(`/lang/${lang}/${ns}.json`);
        if (!r.ok) return null;
        return (await r.json()) as Record<string, string>;
    } catch {
        return null;
    }
};

/** 从 public/lang/{lang}/*.json 加载翻译，并与回退字典合并 */
export const loadLangBundle = async (lang: UiLang = "zh"): Promise<void> => {
    const done = loadedFiles[lang] ?? new Set<string>();
    const toLoad = DATA_FILES.filter((ns) => !done.has(ns));
    if (toLoad.length === 0) {
        // 全部已加载，只需切语言
        await i18n.changeLanguage(lang);
        return;
    }
    const results = await Promise.allSettled(
        toLoad.map((ns) => fetchLocaleFile(lang, ns)),
    );
    results.forEach((r, i) => {
        if (r.status === "fulfilled" && r.value) {
            i18n.addResourceBundle(lang, toLoad[i], r.value, true, true);
        }
    });
    toLoad.forEach((ns) => done.add(ns));
    loadedFiles[lang] = done;
    await i18n.changeLanguage(lang);
};

// 初始化：先用回退字典启动，再异步覆盖 public/lang 文件
void i18n.use(initReactI18next).init({
    // resources: FALLBACK as Record<string, Record<string, Record<string, string>>>,
    lng: "zh",
    fallbackLng: "zh",
    defaultNS: "common",
    interpolation: { escapeValue: false },
});

// 预加载默认语言文件（不阻塞渲染；loadedFiles 记录避免重复 fetch）
void loadLangBundle("zh");

export { i18n };
