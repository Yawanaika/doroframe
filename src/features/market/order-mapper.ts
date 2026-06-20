import type { SubmitItemOrder } from "@/types/wf-market";
import { PER_TRADE_TAGS } from "@/features/market/constants";

/** 下单表单草稿 */
export interface SubmitOrderDraft {
    itemId: string;
    orderType: string;
    visible: boolean;
    platinum?: number;
    quantity?: number;
    amberStars?: number;
    cyanStars?: number;
    charges?: number;
    rank?: number;
    subtype?: string;
    /** 批量交易批次大小：bulkTradable 物品开启批量交易时为输入值，否则交由 tag 规则兜底 */
    perTrade?: number;
    tags: string[];
}

/** 草稿 → 提交请求体 */
export function draftToSubmitOrder(draft: SubmitOrderDraft): SubmitItemOrder {
    if (draft.platinum == null || draft.quantity == null) {
        throw new Error("platinum and quantity must be valid integers");
    }

    const order: SubmitItemOrder = {
        itemId: draft.itemId,
        type: draft.orderType,
        platinum: draft.platinum,
        quantity: draft.quantity,
        visible: draft.visible,
        amberStars: draft.amberStars,
        cyanStars: draft.cyanStars,
    };

    if (draft.charges != null) order.charges = draft.charges;
    if (draft.rank != null) order.rank = draft.rank;
    if (draft.subtype != null) order.subtype = draft.subtype;
    // 显式 perTrade（批量交易输入/默认 1）优先，否则按 tag 规则兜底
    if (draft.perTrade != null) order.perTrade = draft.perTrade;
    else if (draft.tags.some((t) => PER_TRADE_TAGS.has(t))) order.perTrade = 1;

    return order;
}
