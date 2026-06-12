import {
    ExportRelics,
    ExportWarframes,
    ExportWeapons,
    ExportUpgrades,
    ExportSyndicates,
    ExportRegions,
    ExportMissionTypes,
    ExportFactions,
    ExportNightwave,
    ExportResources,
    ExportArcanes,
    ExportRewards,
    dict_zh,
    dict_en, ExportImages,
} from "warframe-public-export-plus";

export const Dict = { zh: dict_zh, en: dict_en } as const;
export type Lang = keyof typeof Dict;

let activeLang: Lang = "zh";
export const setActiveLang = (lang: Lang) => {
    activeLang = lang;
    void ensureEventDict(lang);
};
export const getActiveLang = (): Lang => activeLang;

// tr() 进程级缓存：同 key + 同语言只查一次字典，命中后返回引用稳定的字符串
const trCache: Record<Lang, Map<string, string>> = {
    zh: new Map(),
    en: new Map(),
};

// 运行时活动字典：标准字典 miss 后回退到此
const EVENT_DICT_VERSION = "9";
const EVENT_DICT_URL = (l: Lang) =>
    `https://oracle.browse.wf/dicts/${l}.json?${EVENT_DICT_VERSION}`;
const eventDict: Record<Lang, Record<string, string> | undefined> = {
    zh: undefined,
    en: undefined,
};
const eventDictInflight: Partial<Record<Lang, Promise<void>>> = {};

export const ensureEventDict = (lang: Lang = activeLang): Promise<void> => {
    if (eventDict[lang]) return Promise.resolve();
    const existing = eventDictInflight[lang];
    if (existing) return existing;
    const p = fetch(EVENT_DICT_URL(lang))
        .then((r) => {
            if (!r.ok) throw new Error(`event dict ${lang} HTTP ${r.status}`);
            return r.json() as Promise<Record<string, string>>;
        })
        .then((data) => {
            eventDict[lang] = data;
            trCache[lang].clear(); // 让已缓存的 miss 项重新解析
        })
        .catch((e) => {
            console.warn("[wpep] load event dict failed", lang, e);
        })
        .finally(() => {
            delete eventDictInflight[lang];
        });
    eventDictInflight[lang] = p;
    return p;
};

const resolveName = (key: string): string => {
    if (key in Dict.zh || key in Dict.en) return key;
    const f = (ExportFactions as Record<string, { name?: string }>)[key];
    if (f?.name) return f.name;
    const m = (ExportMissionTypes as Record<string, { name?: string }>)[key];
    if (m?.name) return m.name;
    const r = (ExportRegions as Record<string, { name?: string }>)[key];
    if (r?.name) return r.name;
    return key;
};
function serializeKey(key: string): string {
    // 对于科研词条的预处理
    // 科研词条: 迷人弧犬 MagneticHounds
    // 科研词条: 钝重兵刃 ComboCountChance
    // 科研词条: 补给短缺 MaxAmmo
    return key.replace("EMPBlackHole","MagneticHounds")
        .replace('DullBlades', 'ComboCountChance')
        .replace('Undersupplied', 'MaxAmmo');
}
export function serializeValue(value: string): string {
    // 处理value中的特殊字符
    // 异常 异常颜色 技能描述
    return value.replace(/<DT_[^>]*>/g, "")
        // 缩短技能
        .replace("技能持续时间减少 |val|", "技能持续时间减少 50")
        // 嗜睡护盾
        .replace('护盾充能延迟增加 |val|', '护盾充能延迟增加 500');
}

export const tr = (key: string | undefined | null, lang?: Lang): string => {
    if (!key) return "";
    key = serializeKey(key);
    const l = lang ?? activeLang;
    const cache = trCache[l];
    const hit = cache.get(key);
    if (hit !== undefined) return hit;
    const path = resolveName(key);
    let value =
        Dict[l][path] ??
        Dict[l][key] ??
        eventDict[l]?.[path] ??
        eventDict[l]?.[key] ??
        key;
    value = serializeValue(value);
    cache.set(key, value);
    return value;
};

// Images: key -> https://content.warframe.com/PublicExport{key}!{contentHash}
const IMAGE_BASE = "https://content.warframe.com/PublicExport";
const IMAGE_SECOND = "https://browse.wf";
const imageUrlCache = new Map<string, string>();
export const trImage = (key: string | undefined | null): string => {
    if (!key) return "";
    const hit = imageUrlCache.get(key);
    if (hit !== undefined) return hit;
    const entry = (ExportImages as Record<string, { contentHash?: string }>)[key];
    const url = entry?.contentHash
        ? `${IMAGE_BASE}${key}!${entry.contentHash}`
        : `${IMAGE_SECOND}${key}`;
    imageUrlCache.set(key, url);
    return url;
};

// 启动时预热：高频字典一次性灌入缓存
export const warmupTrCache = (lang: Lang = "zh") => {
    for (const r of Object.values(ExportRegions)) tr((r as any)?.name, lang);
    for (const f of Object.values(ExportFactions)) tr((f as any)?.name, lang);
    for (const m of Object.values(ExportMissionTypes)) tr((m as any)?.name, lang);
};

export const Relics = ExportRelics;
export const Warframes = ExportWarframes;
export const Weapons = ExportWeapons;
export const Upgrades = ExportUpgrades;
export const Syndicates = ExportSyndicates;
export const Regions = ExportRegions;
export const MissionTypes = ExportMissionTypes;
export const Factions = ExportFactions;
export const Nightwave = ExportNightwave;
export const Resources = ExportResources;
export const Arcanes = ExportArcanes;
export const Rewards = ExportRewards;
export const Images = ExportImages;

export {
    findItem,
    getItem,
    itemName,
    itemIcon,
    itemDetail,
    rewardName,
    isRewardTable,
    rewardTableDetail,
    rewardTableDrops,
    normalizeItemKey,
} from "./items";
export type {
    ItemLookup,
    ItemSource,
    ItemDetail,
    RewardNameOptions,
    RewardDrop,
    RewardRotation,
} from "./items";
