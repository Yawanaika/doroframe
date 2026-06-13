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
    ExportRewards,
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
import { i18n } from "@/lib/i18n";

// 字典文件：public/lang/{lang}/relic.dict.json
const RELIC_NS = "relic.dict";
const trRelic = (key: string, fallback = key): string => {
    const v = i18n.t(key, { ns: RELIC_NS, defaultValue: fallback });
    return typeof v === "string" ? v : fallback;
};

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
    const item = hit.item as { name?: string; resultType?: string; era?: string; category?: string };
    if (hit.source === "relics" && item.era) {
        return relicDisplayName(item);
    }
    const nameKey =
        hit.source === "recipes" ? item.resultType ?? item.name : item.name;
    return tr(nameKey) || tr(hit.key) || hit.key;
};

/** 取物品图标 URL（item.icon → trImage） */
export const itemIcon = (key: string | undefined | null): string => {
    const item = getItem<{ icon?: string }>(key);
    return trImage(item?.icon);
};

/**
 * 物品详细信息（用于 daily-deal / invasion / 奖励等场景）
 *   - name        本地化名称（item.name → tr；recipes 走 resultType）
 *   - description 物品描述（item.description → tr）
 *   - icon        图标 URL（item.icon → content.warframe.com）
 *   - source      命中的数据源（weapons / warframes / ...）
 *   - raw         原始 item 引用，便于按需访问其它字段
 */
export interface ItemDetail<T = Record<string, unknown>> {
    key: string;
    source: ItemSource;
    name: string;
    description: string;
    icon: string;
    raw: T;
}

export const itemDetail = <T = Record<string, unknown>>(
    key: string | undefined | null,
): ItemDetail<T> | undefined => {
    const hit = findItem<{
        name?: string;
        description?: string;
        icon?: string;
        resultType?: string;
        era?: string;
        category?: string;
        quantity?: number;
    }>(key);
    if (!hit) return undefined;

    const { item, source } = hit;
    // recipes 的"成品名"在 resultType 指向的条目里（description / icon 仍要回退到成品）
    const resultDetail =
        source === "recipes" && item.resultType
            ? itemDetail(item.resultType)
            : undefined;

    // 复用 rewardName 的命名逻辑：SPECIAL_REWARD_NAMES / recipes resultType /
    // 遗物名 / titleTag 提取 / Blueprint→蓝图后缀。
    // 传原始 key（而非 hit.key），以便 special 表（StoreItems 形式）能命中。
    let name = rewardName(key);

    // 去除名称内的特殊字符
    name = name.replace('<SHARD_RED_SIMPLE>', '') // 深红源力石
        .replace('<SHARD_BLUE_SIMPLE>', '') // 蔚蓝源力石
        .replace('<SHARD_GREEN_SIMPLE>', '') // 翡翠源力石
        .replace('<SHARD_YELLOW_SIMPLE>', '') // 琥珀源力石
        .replace('<SHARD_ORANGE_SIMPLE>', '') //黄玉源力石
        .replace('<SHARD_VIOLET_SIMPLE>', ''); //紫晶源力石

    const description =
        tr(item.description) || resultDetail?.description || "";

    const icon = item.icon
        ? trImage(item.icon)
        : resultDetail?.icon ?? "";

    return {
        key: hit.key,
        source,
        name,
        description,
        icon,
        raw: hit.item as T,
    };
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
    const era = item.era ? trRelic(item.era, item.era) : "";
    const suffix = trRelic("relic.desc", "");
    const quality = item.quality
        ? trRelic(item.quality, item.quality)
        : "";
    const qualityPart = quality ? ` (${quality})` : "";
    return `${era} ${item.category ?? ""} ${suffix}${qualityPart}`
        .replace(/\s+/g, " ")
        .trim();
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
const FUSION_BUNDLE_KEY = "/Lotus/Language/Items/FusionBundle";
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
        if (key === FUSION_BUNDLE_KEY) {
            const fp = hit?.item.fusionPoints;
            if (typeof fp === "number") n *= fp;
        }
        name = `${name} x ${n}`;
    }

    return name;
};


/** 奖励表（ExportRewards）原始掉落项 */
interface RawRewardDrop {
    type: string;
    itemCount: number;
    probability: number;
}

/** 解析后的单条掉落：物品 key + 数量 + 概率 + 物品明细 */
export interface RewardDrop {
    /** 物品 key（可再交给 itemDetail / rewardName 处理） */
    type: string;
    /** 掉落数量 */
    itemCount: number;
    /** 掉落概率（0~1） */
    probability: number;
    /** itemDetail(type) 的结果，未命中物品表时为 undefined */
    detail: ItemDetail | undefined;
}

/** 一个轮换（rotation）内的掉落列表 */
export type RewardRotation = RewardDrop[];

/**
 * 判断一个 key 是否为奖励表（drop table）引用。
 * 例：/Lotus/Types/Game/MissionDecks/DeimosMissionRewards/VaultBountyTierBTableCRewards
 */
export const isRewardTable = (key: string | undefined | null): boolean =>
    !!key && Array.isArray((ExportRewards as Record<string, unknown>)[key]);

/**
 * 解析奖励表 key，返回按轮换（rotation）分组的掉落明细。
 *
 * ExportRewards[key] 的结构是二维数组：外层为 rotation（赏金各阶段/A·B·C 轮换），
 * 内层为该轮的掉落项 { type, itemCount, probability }。每个 type 才是真正的物品 key，
 * 这里顺带调用 itemDetail() 补上 name/icon 等明细。
 *
 * 非奖励表 key（普通物品）返回 undefined —— 此时调用方应改走 itemDetail()/rewardName()。
 */
export const rewardTableDetail = (
    key: string | undefined | null,
): RewardRotation[] | undefined => {
    if (!key) return undefined;
    const table = (ExportRewards as Record<string, unknown>)[key];
    if (!Array.isArray(table)) return undefined;

    return (table as RawRewardDrop[][]).map((rotation) =>
        (rotation ?? []).map((d) => ({
            type: d.type,
            itemCount: d.itemCount,
            probability: d.probability,
            detail: itemDetail(d.type),
        })),
    );
};

/**
 * 解析奖励表并把所有轮换的掉落拍平为一维列表（不区分 rotation）。
 * 适合只想展示「掉落表里可能掉哪些东西」、不关心轮换归属的场景。
 */
export const rewardTableDrops = (
    key: string | undefined | null,
): RewardDrop[] | undefined => rewardTableDetail(key)?.flat();
