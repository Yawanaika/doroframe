// 拍卖搜索相关枚举常量。移植自 doroprime 的 auction_data.dart / weapon_element.dart /
// order_type.dart。展示名走 i18n（auction.* 键），此处仅保留 code 与分组关系。

/** 拍卖物品大类 */
export type SearchTypeCode = "riven" | "lich" | "sister";
export const SEARCH_TYPES: SearchTypeCode[] = ["riven", "lich", "sister"];

/** 买断策略：all=全部 / direct=一口价直售 / auction=竞拍 */
export type BuyoutPolicyCode = "all" | "direct" | "auction";
export const BUYOUT_POLICIES: BuyoutPolicyCode[] = ["all", "direct", "auction"];
/** 创建拍卖时仅允许 direct / auction */
export const CREATE_POLICIES: BuyoutPolicyCode[] = ["direct", "auction"];

/** 武器元素（lich/sister）。all 仅用于搜索的「任意」。 */
export const WEAPON_ELEMENTS = [
    "all",
    "cold",
    "electricity",
    "heat",
    "impact",
    "magnetic",
    "radiation",
    "toxin",
] as const;
export type WeaponElementCode = (typeof WEAPON_ELEMENTS)[number];
/** 创建拍卖的元素选项（去掉 all） */
export const CREATE_ELEMENTS = WEAPON_ELEMENTS.filter((e) => e !== "all");

/** 紫卡极性。any 仅用于搜索的「任意」。 */
export const POLARITIES = ["any", "madurai", "naramon", "vazarin"] as const;
export type PolarityCode = (typeof POLARITIES)[number];
/** 创建拍卖的极性选项（去掉 any） */
export const CREATE_POLARITIES = POLARITIES.filter((p) => p !== "any");

/** 排序选项随大类不同（对齐 warframe.market v1 auctions sort_by 枚举）。 */
export const SORT_OPTIONS: Record<SearchTypeCode, string[]> = {
    riven: ["price_asc", "price_desc", "positive_attr_asc", "positive_attr_desc"],
    lich: ["price_asc", "price_desc", "damage_asc", "damage_desc"],
    sister: ["price_asc", "price_desc", "damage_asc", "damage_desc"],
};

/** 负面词条搜索的两个自定义选项（置于具体词条之前） */
export const NEGATIVE_CUSTOM = ["none", "has"] as const;

/** lich/sister 伤害加成取值范围 */
export const DAMAGE_MIN = 25;
export const DAMAGE_MAX = 60;
