import { invoke } from "@tauri-apps/api/core";
import {
    Item,
    itemFromJson,
    ItemOrder,
    itemOrderFromJson,
    SetInfo,
    setInfoFromJson,
} from "@/types/wf-market";
import type { LangCode } from "@/store/settings";

/**
 * Tauri 入口：市场数据统一经由 Rust 端 `get_market_*` command 拉取
 * （设置 Platform/Language header、解 `{ data, error }` 信封、规避 CORS），
 * 前端在边界处用 `*FromJson` 归一化成业务模型。
 */

// 设置页语言码 → warframe.market 的 Language header 取值
export type MarketLang = "zh-hans" | "en";
export const toMarketLang = (lang: LangCode): MarketLang =>
    lang === "zh" ? "zh-hans" : "en";

/** `GET /v2/items` —— 全量物品列表，用于构建搜索建议 */
export async function fetchMarketItems(lang: LangCode): Promise<Item[]> {
    const raw = await invoke<unknown[]>("get_market_items", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(itemFromJson);
}

/** `GET /v2/orders/item/{slug}` —— 指定物品的全部买卖订单 */
export async function fetchItemOrders(
    slug: string,
    lang: LangCode,
): Promise<ItemOrder[]> {
    const raw = await invoke<unknown[]>("get_market_orders", {
        slug,
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(itemOrderFromJson);
}

/** `GET /v2/item/{slug}/set` —— 物品所属套装（主件 + 部件） */
export async function fetchItemSet(
    slug: string,
    lang: LangCode,
): Promise<SetInfo> {
    const raw = await invoke<unknown>("get_market_set", {
        slug,
        language: toMarketLang(lang),
    });
    return setInfoFromJson(raw);
}
