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
