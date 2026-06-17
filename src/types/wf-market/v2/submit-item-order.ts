/** 提交订单请求体 —— 对应 doroprime SubmitItemOrder */
export interface SubmitItemOrder {
    id?: string;
    itemId?: string;
    type?: string;
    platinum?: number;
    quantity?: number;
    visible?: boolean;
    perTrade?: number;
    rank?: number;
    charges?: number;
    subtype?: string;
    amberStars?: number;
    cyanStars?: number;
    createdAt?: string;
    updatedAt?: string;
}

/** 仅序列化非空字段 */
export function submitItemOrderToJson(o: SubmitItemOrder): Record<string, unknown> {
    const json: Record<string, unknown> = {};
    if (o.id != null) json.id = o.id;
    if (o.itemId != null) json.itemId = o.itemId;
    if (o.type != null) json.type = o.type;
    if (o.platinum != null) json.platinum = o.platinum;
    if (o.quantity != null) json.quantity = o.quantity;
    if (o.visible != null) json.visible = o.visible;
    if (o.perTrade != null) json.perTrade = o.perTrade;
    if (o.rank != null) json.rank = o.rank;
    if (o.charges != null) json.charges = o.charges;
    if (o.subtype != null) json.subtype = o.subtype;
    if (o.amberStars != null) json.amberStars = o.amberStars;
    if (o.cyanStars != null) json.cyanStars = o.cyanStars;
    if (o.createdAt != null) json.createdAt = o.createdAt;
    if (o.updatedAt != null) json.updatedAt = o.updatedAt;
    return json;
}
