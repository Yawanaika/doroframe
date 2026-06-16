// warframe.market 静态资源与 i18n 取值辅助

import type { Item } from "@/types/wf-market";
import type { I18n } from "@/types/wf-market/i18n";
import type { LangCode } from "@/store/settings";

const ASSETS_BASE = "https://warframe.market/static/assets";
export const DEFAULT_AVATAR = `${ASSETS_BASE}/user/default-avatar.png`;

/** 拼接 warframe.market 静态资源 URL（icon / avatar 等相对路径） */
export const assetUrl = (path: string | undefined | null): string =>
    path ? `${ASSETS_BASE}/${path}` : "";

/** 头像 URL，缺失时回退默认头像 */
export const avatarUrl = (path: string | undefined | null): string =>
    path ? assetUrl(path) : DEFAULT_AVATAR;

/** 按当前语言取 i18n 数据块：中文优先 zhHans，回退 en */
export const pickI18n = (i18n: I18n, lang: LangCode) =>
    lang === "zh" ? i18n.zhHans ?? i18n.en : i18n.en;

/** 物品本地化显示名 */
export const itemDisplayName = (item: Item, lang: LangCode): string =>
    pickI18n(item.i18n, lang).name;

/** 物品图标 URL（套装主件用 icon，部件用 subIcon 回退 icon） */
export const itemIconUrl = (
    item: Item,
    lang: LangCode,
    sub = false,
): string => {
    const data = pickI18n(item.i18n, lang);
    const path = sub ? data.subIcon ?? data.icon : data.icon ?? data.subIcon;
    return assetUrl(path);
};
