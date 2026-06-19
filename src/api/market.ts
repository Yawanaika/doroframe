import { invoke } from "@tauri-apps/api/core";
import {
    Item,
    itemFromJson,
    ItemOrder,
    itemOrderFromJson,
    SetInfo,
    setInfoFromJson,
    type SubmitItemOrder,
    submitItemOrderToJson,
} from "@/types/wf-market";
import type { LangCode } from "@/store/settings";
import {TopOrders, topOrdersFromJson} from "@/types/wf-market/v2/top-orders.ts";
import {Transaction, transactionFromJson} from "@/types/wf-market/v2/transaction.ts";
import {
    Riven,
    rivenFromJson,
    RivenAttribute,
    rivenAttributeFromJson,
} from "@/types/wf-market/v2/riven.ts";
import {
    NemesisWeapon,
    nemesisWeaponFromJson,
    NemesisEphemera,
    nemesisEphemeraFromJson,
    NemesisQuirk,
    nemesisQuirkFromJson,
} from "@/types/wf-market/v2/nemesis.ts";

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

/** `GET /v2/orders/recent` —— 最近 4h 内、在线用户的可见订单（最多 500 条，按 createdAt 倒序）。
 * 无需登录；受 Platform/Crossplay header 影响。订单带 `user`（UserShort）。 */
export async function fetchRecentOrders(lang: LangCode): Promise<ItemOrder[]> {
    const raw = await invoke<unknown[]>("get_orders_recent", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(itemOrderFromJson);
}

/** `GET /v2/orders/item/{slug}/top` —— 指定物品的 Top5 买卖订单。
 * 注意：该端点 data 是单个对象 `{ sell, buy }`，不是数组。 */
export async function fetchItemOrdersTop(
    slug: string,
    lang: LangCode,
): Promise<TopOrders> {
    const raw = await invoke<unknown>("get_orders_top", {
        slug,
        language: toMarketLang(lang),
    });
    return topOrdersFromJson(raw ?? { sell: [], buy: [] });
}

/** `GET /v2/orders/user/{slug}` —— 当前用户的全部订单（带 token 可取回隐藏订单） */
export async function fetchUserOrders(
    slug: string,
    token: string | null,
    lang: LangCode,
): Promise<ItemOrder[]> {
    const raw = await invoke<unknown[]>("get_user_orders", {
        slug,
        token,
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

// ===== Riven / Lich / Sister 清单（🇬🇧 可翻译，manifest 性质，极少变动）=====

/** `GET /v2/riven/weapons` —— 全部可交易紫卡武器 */
export async function fetchRivenWeapons(lang: LangCode): Promise<Riven[]> {
    const raw = await invoke<unknown[]>("get_riven_weapons", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(rivenFromJson);
}

/** `GET /v2/riven/weapon/{slug}` —— 单个紫卡武器 */
export async function fetchRivenWeapon(
    slug: string,
    lang: LangCode,
): Promise<Riven> {
    const raw = await invoke<unknown>("get_riven_weapon", {
        slug,
        language: toMarketLang(lang),
    });
    return rivenFromJson(raw);
}

/** `GET /v2/riven/attributes` —— 全部紫卡词条 */
export async function fetchRivenAttributes(
    lang: LangCode,
): Promise<RivenAttribute[]> {
    const raw = await invoke<unknown[]>("get_riven_attributes", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(rivenAttributeFromJson);
}

/** `GET /v2/lich/weapons` —— 全部可交易利奇武器 */
export async function fetchLichWeapons(
    lang: LangCode,
): Promise<NemesisWeapon[]> {
    const raw = await invoke<unknown[]>("get_lich_weapons", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(nemesisWeaponFromJson);
}

/** `GET /v2/lich/weapon/{slug}` —— 单个利奇武器 */
export async function fetchLichWeapon(
    slug: string,
    lang: LangCode,
): Promise<NemesisWeapon> {
    const raw = await invoke<unknown>("get_lich_weapon", {
        slug,
        language: toMarketLang(lang),
    });
    return nemesisWeaponFromJson(raw);
}

/** `GET /v2/lich/ephemeras` —— 全部可交易利奇魂华 */
export async function fetchLichEphemeras(
    lang: LangCode,
): Promise<NemesisEphemera[]> {
    const raw = await invoke<unknown[]>("get_lich_ephemeras", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(nemesisEphemeraFromJson);
}

/** `GET /v2/lich/quirks` —— 全部可交易利奇怪癖 */
export async function fetchLichQuirks(
    lang: LangCode,
): Promise<NemesisQuirk[]> {
    const raw = await invoke<unknown[]>("get_lich_quirks", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(nemesisQuirkFromJson);
}

/** `GET /v2/sister/weapons` —— 全部可交易姐妹武器 */
export async function fetchSisterWeapons(
    lang: LangCode,
): Promise<NemesisWeapon[]> {
    const raw = await invoke<unknown[]>("get_sister_weapons", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(nemesisWeaponFromJson);
}

/** `GET /v2/sister/weapon/{slug}` —— 单个姐妹武器 */
export async function fetchSisterWeapon(
    slug: string,
    lang: LangCode,
): Promise<NemesisWeapon> {
    const raw = await invoke<unknown>("get_sister_weapon", {
        slug,
        language: toMarketLang(lang),
    });
    return nemesisWeaponFromJson(raw);
}

/** `GET /v2/sister/ephemeras` —— 全部可交易姐妹魂华 */
export async function fetchSisterEphemeras(
    lang: LangCode,
): Promise<NemesisEphemera[]> {
    const raw = await invoke<unknown[]>("get_sister_ephemeras", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(nemesisEphemeraFromJson);
}

/** `GET /v2/sister/quirks` —— 全部可交易姐妹怪癖 */
export async function fetchSisterQuirks(
    lang: LangCode,
): Promise<NemesisQuirk[]> {
    const raw = await invoke<unknown[]>("get_sister_quirks", {
        language: toMarketLang(lang),
    });
    return (raw ?? []).map(nemesisQuirkFromJson);
}

/** `PATCH /v2/orders/group/{id}` —— 批量改某订单组的可见性，需登录态。
 * `order` 仅含 `{ type, visible }`；返回受影响的订单数 `updated`。 */
export async function editOrdersGroup(
    id: string,
    order: SubmitItemOrder,
    token: string | null,
    lang: LangCode,
): Promise<number> {
    const raw = await invoke<{ updated?: number }>("edit_market_orders_group", {
        id,
        token,
        order: submitItemOrderToJson(order),
        language: toMarketLang(lang),
    });
    return raw?.updated ?? 0;
}

/** `POST /v2/order` —— 创建订单，需登录态（token 为 JWT cookie） */
export async function createOrder(
    order: SubmitItemOrder,
    token: string | null,
    lang: LangCode,
): Promise<void> {
    await invoke("create_market_order", {
        token,
        order: submitItemOrderToJson(order),
        language: toMarketLang(lang),
    });
}

/** `PATCH /v2/order/{id}` —— 编辑订单，需登录态（token 为 JWT cookie）。
 * `order` 仅需带要修改的字段；返回更新后的订单。 */
export async function editOrder(
    id: string,
    order: SubmitItemOrder,
    token: string | null,
    lang: LangCode,
): Promise<ItemOrder> {
    const raw = await invoke<unknown>("edit_market_order", {
        id,
        token,
        order: submitItemOrderToJson(order),
        language: toMarketLang(lang),
    });
    return itemOrderFromJson(raw);
}

export async function closeOrder(
    id: string,
    token: string | null,
    order: SubmitItemOrder,
    lang: LangCode,
): Promise<Transaction> {
    const raw = await invoke("close_market_order", {
        id,
        token,
        order: submitItemOrderToJson(order),
        language: toMarketLang(lang),
    });
    return transactionFromJson( raw);
}

export async function deleteOrder(
    id: string,
    token: string | null,
    lang: LangCode,
): Promise<ItemOrder> {
    const raw = await invoke("delete_market_order", {
        id,
        token,
        language: toMarketLang(lang),
    });
    return itemOrderFromJson( raw);
}
