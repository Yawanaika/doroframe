import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const SUPPORTED_LANGS = ["zh", "en"] as const;
export type UiLang = (typeof SUPPORTED_LANGS)[number];

const resources = {
    zh: {
        common: {
            "nav.state": "Warframe 状态",
            "nav.weekly": "周常任务",
            "nav.market.items": "WM 订单",
            "nav.market.auctions": "WM 拍卖",
            "nav.market.me": "WM 个人信息",
            "nav.inventory.relic": "遗物图鉴",
            "nav.settings": "设置",
            "state.title.alert": "警报",
            "state.title.arby": "仲裁",
            "state.title.sortie": "每日突击",
            "state.title.lite-sortie": "执刑官",
            "state.title.syndicate": "集团每日",
            "state.title.invasion": "入侵",
            "state.title.void-trader": "虚空商人",
            "state.title.prime-vault": "Prime 宝库",
            "state.title.void-storm": "虚空裂缝",
            "state.title.daily-deal": "每日折扣",
            "state.title.goal": "限时活动",
            "state.title.conquest": "九重天",
            "state.title.descent": "深层科研",
            "state.title.endless-xp": "无尽回廊",
            "state.title.season-info": "午夜电波",
            "state.title.calendar": "1999 日历",
            "common.loading": "加载中…",
            "common.error": "加载失败",
            "common.empty": "暂无数据",
            "event.expiry":"剩余",
            "event.grace":"兑换"
        },
    },
    en: {
        common: {
            "nav.state": "World State",
            "nav.weekly": "Weekly",
            "nav.market.items": "Market · Items",
            "nav.market.auctions": "Market · Auctions",
            "nav.market.me": "Market · Me",
            "nav.inventory.relic": "Relics",
            "nav.settings": "Settings",
            "state.title.alert": "Alerts",
            "state.title.arby": "Arbitration",
            "state.title.sortie": "Sortie",
            "state.title.lite-sortie": "Archon Hunt",
            "state.title.syndicate": "Syndicates",
            "state.title.invasion": "Invasions",
            "state.title.void-trader": "Void Trader",
            "state.title.prime-vault": "Prime Vault",
            "state.title.void-storm": "Void Storms",
            "state.title.daily-deal": "Daily Deal",
            "state.title.goal": "Events",
            "state.title.conquest": "Empyrean",
            "state.title.descent": "Deep Archimedea",
            "state.title.endless-xp": "Elite Sanctuary",
            "state.title.season-info": "Nightwave",
            "state.title.calendar": "1999 Calendar",
            "common.loading": "Loading…",
            "common.error": "Failed to load",
            "common.empty": "No data",
            "event.expiry":"Expiry",
            "event.grace":"Grace Period"
        },
    },
} as const;

void i18n.use(initReactI18next).init({
    resources,
    lng: "zh",
    fallbackLng: "zh",
    defaultNS: "common",
    interpolation: { escapeValue: false },
});

export { i18n };
