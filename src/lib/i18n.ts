import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGS = ["zh", "en"] as const;
export type UiLang = (typeof SUPPORTED_LANGS)[number];

// 对应 public/data/{lang}/*.json 的文件名（不含后缀）
const DATA_FILES = ["common", "sorty.boss","sorty.modifer", "sorty.modifer.desc", "relic.dict", "void.dict"] as const;

// 硬编码回退：文件缺失时保证应用不崩
// const FALLBACK: Record<UiLang, Record<string, Record<string, string>>> = {
//     zh: {
//         common: {
//             "nav.state": "Warframe 状态",
//             "nav.weekly": "周常任务",
//             "nav.market.items": "WM 订单",
//             "nav.market.auctions": "WM 拍卖",
//             "nav.market.me": "WM 个人信息",
//             "nav.inventory.relic": "遗物图鉴",
//             "nav.settings": "设置",
//             "state.title.alert": "警报",
//             "state.title.arby": "仲裁",
//             "state.title.sortie": "每日突击",
//             "state.title.lite-sortie": "执刑官",
//             "state.title.syndicate": "集团每日",
//             "state.title.invasion": "入侵",
//             "state.title.void-trader": "虚空商人",
//             "state.title.prime-vault": "Prime 宝库",
//             "state.title.void-storm": "虚空裂缝",
//             "state.title.daily-deal": "每日折扣",
//             "state.title.goal": "限时活动",
//             "state.title.conquest": "九重天",
//             "state.title.descent": "深层科研",
//             "state.title.endless-xp": "无尽回廊",
//             "state.title.season-info": "午夜电波",
//             "state.title.calendar": "1999 日历",
//             "common.loading": "加载中…",
//             "common.error": "加载失败",
//             "common.empty": "暂无数据",
//             "event.expiry": "剩余",
//             "event.grace": "兑换",
//         },
//     },
//     en: {
//         common: {
//             "nav.state": "World State",
//             "nav.weekly": "Weekly",
//             "nav.market.items": "Market · Items",
//             "nav.market.auctions": "Market · Auctions",
//             "nav.market.me": "Market · Me",
//             "nav.inventory.relic": "Relics",
//             "nav.settings": "Settings",
//             "state.title.alert": "Alerts",
//             "state.title.arby": "Arbitration",
//             "state.title.sortie": "Sortie",
//             "state.title.lite-sortie": "Archon Hunt",
//             "state.title.syndicate": "Syndicates",
//             "state.title.invasion": "Invasions",
//             "state.title.void-trader": "Void Trader",
//             "state.title.prime-vault": "Prime Vault",
//             "state.title.void-storm": "Void Storms",
//             "state.title.daily-deal": "Daily Deal",
//             "state.title.goal": "Events",
//             "state.title.conquest": "Empyrean",
//             "state.title.descent": "Deep Archimedea",
//             "state.title.endless-xp": "Elite Sanctuary",
//             "state.title.season-info": "Nightwave",
//             "state.title.calendar": "1999 Calendar",
//             "common.loading": "Loading…",
//             "common.error": "Failed to load",
//             "common.empty": "No data",
//             "event.expiry": "Expiry",
//             "event.grace": "Grace Period",
//         },
//     },
// } as const;

// 按语言记录已 fetch 过的文件，避免切回去再拉一次
const loadedFiles: Partial<Record<UiLang, Set<string>>> = {};

const fetchLocaleFile = async (
    lang: UiLang,
    ns: string,
): Promise<Record<string, string> | null> => {
    try {
        const r = await fetch(`/data/${lang}/${ns}.json`);
        if (!r.ok) return null;
        return (await r.json()) as Record<string, string>;
    } catch {
        return null;
    }
};

/** 从 public/data/{lang}/*.json 加载翻译，并与回退字典合并 */
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

// 初始化：先用回退字典启动，再异步覆盖 public/data 文件
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
