// 订单列表的纯逻辑：喊话模板 + 默认排序。无 React 依赖，便于单测复用。

import type { ItemOrder } from "@/types/wf-market";
import { ORDER_TYPES, statusOf, type OrderTypeCode } from "@/features/market/constants";

/**
 * 喊话文案：按订单所有者语言切换中英模板。
 * 物品名同样随订单方语言走 —— 非中文订单方取英文名。
 */
export function whisper(order: ItemOrder, nameZh: string, nameEn: string): string {
    const def = ORDER_TYPES[(order.type as OrderTypeCode)] ?? ORDER_TYPES.sell;
    const who = order.user?.ingameName ?? "";
    const zh = (order.user?.locale ?? "en") === "zh-hans";
    const item = zh ? nameZh : nameEn;
    return zh
        ? `/w ${who} 你好! 我想以 ${order.platinum} 白金 ${def.actionZh}: "${item}"。(warframe.market)`
        : `/w ${who} Hi! I want to ${def.actionEn}: "${item}" for ${order.platinum} platinum. (warframe.market)`;
}

/** 订单排序：用户状态 → 价格(卖升买降) → rank 降 → 数量降。用作表格默认行序。 */
export function sortOrders(orders: ItemOrder[], orderType: OrderTypeCode): ItemOrder[] {
    return orders
        .filter((o) => o.type === orderType)
        .slice()
        .sort((a, b) => {
            const s = statusOf(b.user?.status).sort - statusOf(a.user?.status).sort;
            if (s !== 0) return s;
            const price =
                orderType === "sell"
                    ? a.platinum - b.platinum
                    : b.platinum - a.platinum;
            if (price !== 0) return price;
            const rank = (b.rank ?? 0) - (a.rank ?? 0);
            if (rank !== 0) return rank;
            return b.quantity - a.quantity;
        });
}
