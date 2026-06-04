// 统一物品字典：按 key 在多个 Export* 数据源中查找详细内容
// 设计参考 doroprime/lib/utils/cache_builder.dart 的 findItemData / getItemFromDataSource

import {
    ExportAbilities,
    ExportAchievements,
    ExportAnimals,
    ExportArcanes,
    ExportAvionics,
    ExportBoosterPacks,
    ExportBoosters,
    ExportBounties,
    ExportBundles,
    ExportChallenges,
    ExportCodex,
    ExportCreditBundles,
    ExportCustoms,
    ExportDojoRecipes,
    ExportDrones,
    ExportEnemies,
    ExportFactions,
    ExportFlavour,
    ExportFocusUpgrades,
    ExportFusionBundles,
    ExportGear,
    ExportImages,
    ExportIntrinsics,
    ExportKeys,
    ExportMissionTypes,
    ExportModSet,
    ExportNightwave,
    ExportRailjackWeapons,
    ExportRecipes,
    ExportRegions,
    ExportRelics,
    ExportResources,
    ExportSentinels,
    ExportSyndicates,
    ExportSystems,
    ExportTextIcons,
    ExportTilesets,
    ExportUpgrades,
    ExportVendors,
    ExportVirtuals,
    ExportWarframes,
    ExportWeapons,
} from "warframe-public-export-plus";
import { tr, trImage } from "./index";

export type ItemSource =
    | "resources"
    | "upgrades"
    | "weapons"
    | "warframes"
    | "recipes"
    | "sentinels"
    | "customs"
    | "arcanes"
    | "relics"
    | "flavour"
    | "abilities"
    | "achievements"
    | "animals"
    | "avionics"
    | "boosterPacks"
    | "boosters"
    | "bounties"
    | "bundles"
    | "challenges"
    | "codex"
    | "creditBundles"
    | "dojoRecipes"
    | "drones"
    | "enemies"
    | "factions"
    | "focusUpgrades"
    | "fusionBundles"
    | "gear"
    | "images"
    | "intrinsics"
    | "keys"
    | "missionTypes"
    | "modSet"
    | "nightwave"
    | "railjackWeapons"
    | "regions"
    | "syndicates"
    | "systems"
    | "textIcons"
    | "tilesets"
    | "vendors"
    | "virtuals";

// 源名 → 数据表；顺序即查找优先级（高频在前）
const SOURCES: ReadonlyArray<readonly [ItemSource, Record<string, unknown>]> = [
    ["resources", ExportResources as Record<string, unknown>],
    ["upgrades", ExportUpgrades as Record<string, unknown>],
    ["weapons", ExportWeapons as Record<string, unknown>],
    ["warframes", ExportWarframes as Record<string, unknown>],
    ["recipes", ExportRecipes as Record<string, unknown>],
    ["sentinels", ExportSentinels as Record<string, unknown>],
    ["customs", ExportCustoms as Record<string, unknown>],
    ["arcanes", ExportArcanes as Record<string, unknown>],
    ["relics", ExportRelics as Record<string, unknown>],
    ["flavour", ExportFlavour as Record<string, unknown>],
    ["abilities", ExportAbilities as Record<string, unknown>],
    ["achievements", ExportAchievements as Record<string, unknown>],
    ["animals", ExportAnimals as Record<string, unknown>],
    ["avionics", ExportAvionics as Record<string, unknown>],
    ["boosterPacks", ExportBoosterPacks as Record<string, unknown>],
    ["boosters", ExportBoosters as Record<string, unknown>],
    ["bounties", ExportBounties as Record<string, unknown>],
    ["bundles", ExportBundles as Record<string, unknown>],
    ["challenges", ExportChallenges as Record<string, unknown>],
    ["codex", ExportCodex as unknown as Record<string, unknown>],
    ["creditBundles", ExportCreditBundles as Record<string, unknown>],
    ["dojoRecipes", ExportDojoRecipes as unknown as Record<string, unknown>],
    ["drones", ExportDrones as Record<string, unknown>],
    ["enemies", ExportEnemies as unknown as Record<string, unknown>],
    ["factions", ExportFactions as Record<string, unknown>],
    ["focusUpgrades", ExportFocusUpgrades as Record<string, unknown>],
    ["fusionBundles", ExportFusionBundles as Record<string, unknown>],
    ["gear", ExportGear as Record<string, unknown>],
    ["images", ExportImages as Record<string, unknown>],
    ["intrinsics", ExportIntrinsics as Record<string, unknown>],
    ["keys", ExportKeys as Record<string, unknown>],
    ["missionTypes", ExportMissionTypes as Record<string, unknown>],
    ["modSet", ExportModSet as Record<string, unknown>],
    ["nightwave", ExportNightwave as unknown as Record<string, unknown>],
    ["railjackWeapons", ExportRailjackWeapons as Record<string, unknown>],
    ["regions", ExportRegions as Record<string, unknown>],
    ["syndicates", ExportSyndicates as Record<string, unknown>],
    ["systems", ExportSystems as unknown as Record<string, unknown>],
    ["textIcons", ExportTextIcons as Record<string, unknown>],
    ["tilesets", ExportTilesets as Record<string, unknown>],
    ["vendors", ExportVendors as Record<string, unknown>],
    ["virtuals", ExportVirtuals as Record<string, unknown>],
];

export interface ItemLookup<T = Record<string, unknown>> {
    key: string;          // 命中时使用的 key（可能已经过 normalize）
    source: ItemSource;   // 命中的数据源
    item: T;              // 原始条目
}

// /Lotus/StoreItems/X → /Lotus/X
export const normalizeItemKey = (key: string): string =>
    key.replace(/^\/Lotus\/StoreItems\//, "/Lotus/");

// 查找缓存：key（原始 or 规范化后）→ 结果引用
const cache = new Map<string, ItemLookup | null>();

/**
 * 按优先级在所有 Export 数据源中查找物品。
 * 命中返回 { key, source, item }，否则 undefined。
 */
export const findItem = <T = Record<string, unknown>>(
    key: string | undefined | null,
): ItemLookup<T> | undefined => {
    if (!key) return undefined;
    const cached = cache.get(key);
    if (cached !== undefined) return (cached ?? undefined) as ItemLookup<T> | undefined;

    const tryKeys = [key, normalizeItemKey(key)];
    for (const k of tryKeys) {
        for (const [source, table] of SOURCES) {
            const item = table[k];
            if (item && typeof item === "object") {
                const hit: ItemLookup = { key: k, source, item: item as Record<string, unknown> };
                cache.set(key, hit);
                return hit as ItemLookup<T>;
            }
        }
    }
    cache.set(key, null);
    return undefined;
};

// 便利访问器
export const getItem = <T = Record<string, unknown>>(
    key: string | undefined | null,
): T | undefined => findItem<T>(key)?.item;

/**
 * 取物品的本地化名称：item.name → tr()，缺失时回退到 key。
 * Recipes 的命名字段是 resultType（指向真正成品）。
 */
export const itemName = (key: string | undefined | null): string => {
    const hit = findItem(key);
    if (!hit) return key ? tr(key) : "";
    const item = hit.item as { name?: string; resultType?: string };
    const nameKey =
        hit.source === "recipes" ? item.resultType ?? item.name : item.name;
    return tr(nameKey) || tr(hit.key) || hit.key;
};

/** 取物品图标 URL（item.icon → trImage） */
export const itemIcon = (key: string | undefined | null): string => {
    const item = getItem<{ icon?: string }>(key);
    return trImage(item?.icon);
};

// ── rewardName: 移植 cache_builder.dart 的 getRewardName + _appendItemCount ──

const ERA_NAME: Record<string, string> = {
    Lith: "古纪",
    Meso: "前纪",
    Neo: "中纪",
    Axi: "后纪",
    Requiem: "安魂",
    Vanguard: "先锋",
};

const VPQ_NAME: Record<string, string> = {
    VPQ_BRONZE: "完整",
    VPQ_SILVER: "优良",
    VPQ_GOLD: "无暇",
    VPQ_PLATINUM: "光辉",
};

const SPECIAL_REWARD_NAMES: Record<string, string> = {
    "/Lotus/StoreItems/Upgrades/Mods/Fusers/LegendaryModFuser": "传说核心",
    "/Lotus/StoreItems/Types/Lore/Fragments/GrineerGhoulFragments/GhoulFragmentRewards":
        "Grineer碎裂者 资料库碎片",
};

const TITLE_RE = /\|TITLE_START\|(.*?)\|TITLE_END\|/;

interface RelicLike {
    era?: string;
    quality?: string;
    category?: string;
}

const relicDisplayName = (item: RelicLike): string => {
    const era = item.era ? ERA_NAME[item.era] ?? item.era : "";
    const quality = item.quality ? VPQ_NAME[item.quality] ?? "未知" : "未知";
    return `${era} ${item.category ?? ""} 遗物 (${quality})`.trim();
};

const stripTitleTags = (s: string): string => {
    const m = TITLE_RE.exec(s);
    if (m) return m[1];
    return s.replace(/\|COLOR\|/g, "").replace(/\|NO_COLOR\|/g, "");
};

export interface RewardNameOptions {
    /** 奖励数量；>1 时拼接 " x N"；rewardName === "内融核心" 时按 fusionPoints 倍乘 */
    itemCount?: number;
    /** 强制使用此名称（用于已知 specialRewardNames 之外的覆盖） */
    override?: string;
}

/**
 * 取一份奖励的显示名称。
 * 处理流程：
 *   1. SPECIAL_REWARD_NAMES 命中直接返回；
 *   2. 通过 findItem 查到 item，按 name → resultType → era（遗物）顺序取名；
 *   3. titleTag 含 |TITLE_START|...| 包裹时抽取中间文本；
 *   4. rewardKey 以 "Blueprint" 结尾时追加 " 蓝图"；
 *   5. itemCount 处理（含内融核心特殊倍乘）。
 */
export const rewardName = (
    key: string | undefined | null,
    opts: RewardNameOptions = {},
): string => {
    if (!key) return "未知";
    if (opts.override) return opts.override;
    if (SPECIAL_REWARD_NAMES[key]) return SPECIAL_REWARD_NAMES[key];

    const hit = findItem<{
        name?: string;
        resultType?: string;
        era?: string;
        quality?: string;
        category?: string;
        titleTag?: string;
        fusionPoints?: number;
    }>(key);

    let name: string | undefined;

    if (hit) {
        const { item, source } = hit;

        // 1) name 字段 → tr
        if (item.name) name = tr(item.name) || undefined;

        // 2) recipes：实际成品在 resultType
        if (!name && source === "recipes" && item.resultType) {
            name = rewardName(item.resultType);
        }

        // 3) 遗物
        if (!name && item.era) name = relicDisplayName(item);

        // 4) titleTag |TITLE_START|...|TITLE_END|
        if (!name && item.titleTag) {
            const raw = tr(item.titleTag);
            if (raw && raw !== item.titleTag) name = stripTitleTags(raw);
        }
    }

    if (!name) name = tr(key) || "未知";

    // Blueprint 后缀
    if (key.endsWith("Blueprint") && name !== "未知") name += " 蓝图";

    // itemCount 处理
    const count = opts.itemCount;
    if (typeof count === "number" && count > 1) {
        let n = count;
        if (name === "内融核心") {
            const fp = hit?.item.fusionPoints;
            if (typeof fp === "number") n *= fp;
        }
        name = `${name} x ${n}`;
    }

    return name;
};
