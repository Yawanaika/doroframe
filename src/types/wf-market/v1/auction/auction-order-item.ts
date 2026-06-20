// 拍卖订单内的物品（v1）。riven 与 lich/sister 共用此结构，按 type 区分使用的字段。
// v1 字段为 snake_case，fromJson 负责映射、toJson 负责回写（创建拍卖用）。

/** riven 词条项：词条 slug + 数值 + 正/负面 */
export interface Attribute {
    urlName: string;
    value: number;
    positive: boolean;
}

export function attributeFromJson(json: any): Attribute {
    return {
        urlName: json.url_name,
        value: json.value,
        positive: json.positive,
    };
}

export function attributeToJson(attr: Attribute): any {
    return {
        url_name: attr.urlName,
        value: attr.value,
        positive: attr.positive,
    };
}

export interface AuctionOrderItem {
    /** riven Mod 名（如 "Visi-critacan"）；lich/sister 无 */
    name?: string;
    /** riven | lich | sister */
    type: string;
    /** riven 极性 */
    polarity?: string;
    /** 武器 slug */
    weaponUrlName: string;
    /** riven 精通段位 */
    masteryLevel?: number;
    /** riven Mod 等级 */
    modRank?: number;
    /** riven 循环次数 */
    reRolls?: number;
    /** riven 词条列表 */
    attributes?: Attribute[];
    /** lich/sister 伤害加成 */
    damage?: number;
    /** lich/sister 是否带幻纹 */
    havingEphemera?: boolean;
    /** lich/sister 元素 */
    element?: string;
    /** lich/sister 怪癖 */
    quirk?: string;
}

export function auctionOrderItemFromJson(json: any): AuctionOrderItem {
    return {
        name: json?.name,
        type: json.type,
        polarity: json?.polarity,
        weaponUrlName: json.weapon_url_name,
        masteryLevel: json?.mastery_level,
        modRank: json?.mod_rank,
        reRolls: json?.re_rolls,
        attributes: Array.isArray(json?.attributes)
            ? json.attributes.map(attributeFromJson)
            : undefined,
        damage: json?.damage,
        havingEphemera: json?.having_ephemera,
        element: json?.element,
        quirk: json?.quirk,
    };
}

/** 创建拍卖时回写：仅输出非 undefined 字段（对齐 dart toJson 的条件写入）。 */
export function auctionOrderItemToJson(item: AuctionOrderItem): any {
    const out: any = {
        type: item.type,
        weapon_url_name: item.weaponUrlName,
    };
    if (item.name != null) out.name = item.name;
    if (item.polarity != null) out.polarity = item.polarity;
    if (item.masteryLevel != null) out.mastery_level = item.masteryLevel;
    if (item.modRank != null) out.mod_rank = item.modRank;
    if (item.reRolls != null) out.re_rolls = item.reRolls;
    if (item.attributes != null) out.attributes = item.attributes.map(attributeToJson);
    if (item.damage != null) out.damage = item.damage;
    if (item.havingEphemera != null) out.having_ephemera = item.havingEphemera;
    if (item.element != null) out.element = item.element;
    if (item.quirk != null) out.quirk = item.quirk;
    return out;
}
