import type { SubmitItemOrder } from "@/types/wf-market";
import { PER_TRADE_TAGS } from "./constants";

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
    if (draft.tags.some((t) => PER_TRADE_TAGS.has(t))) order.perTrade = 1;

    return order;
}
