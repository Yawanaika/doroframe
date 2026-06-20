// 拍卖搜索参数（v1）。toQuery 产出 snake_case 记录，对齐 dart AuctionSearchParams.toJson：
// buyout_policy 为 all 时省略、空串字段省略，其余非空即写入。

export interface AuctionSearchParams {
    /** riven | lich | sister */
    type?: string;
    weaponUrlName?: string;
    sortBy?: string;
    /** all | direct | auction */
    buyoutPolicy?: string;
    /** riven 正面词条 slug，逗号分隔 */
    positiveStats?: string;
    /** riven 负面词条 slug（或 none/has），逗号分隔 */
    negativeStats?: string;
    polarity?: string;
    modRank?: string;
    reRollsMin?: number;
    reRollsMax?: number;
    masteryRankMin?: number;
    masteryRankMax?: number;
    /** lich/sister 是否带幻纹 */
    hasEphemera?: boolean;
    damageMin?: number;
    damageMax?: number;
    element?: string;
    quirk?: string;
}

/** 转成发往后端的 snake_case query 记录（省略空/all 项）。 */
export function auctionSearchParamsToQuery(
    p: AuctionSearchParams,
): Record<string, string | number | boolean> {
    const q: Record<string, string | number | boolean> = {};
    if (p.type) q.type = p.type;
    if (p.weaponUrlName) q.weapon_url_name = p.weaponUrlName;
    if (p.sortBy) q.sort_by = p.sortBy;
    if (p.buyoutPolicy && p.buyoutPolicy !== "all") q.buyout_policy = p.buyoutPolicy;
    if (p.positiveStats) q.positive_stats = p.positiveStats;
    if (p.negativeStats) q.negative_stats = p.negativeStats;
    if (p.polarity) q.polarity = p.polarity;
    if (p.modRank) q.mod_rank = p.modRank;
    if (p.reRollsMin != null) q.re_rolls_min = p.reRollsMin;
    if (p.reRollsMax != null) q.re_rolls_max = p.reRollsMax;
    if (p.masteryRankMin != null) q.mastery_rank_min = p.masteryRankMin;
    if (p.masteryRankMax != null) q.mastery_rank_max = p.masteryRankMax;
    if (p.hasEphemera != null) q.has_ephemera = p.hasEphemera;
    if (p.damageMin != null) q.damage_min = p.damageMin;
    if (p.damageMax != null) q.damage_max = p.damageMax;
    if (p.element) q.element = p.element;
    if (p.quirk) q.quirk = p.quirk;
    return q;
}
