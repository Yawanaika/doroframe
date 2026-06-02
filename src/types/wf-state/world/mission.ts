export interface CountedItem {
    itemType: string;
    itemCount: number;
}

export function countedItemFromJson(json: any): CountedItem {
    return {
        itemType: json?.ItemType ?? "",
        itemCount: json?.ItemCount ?? 0,
    };
}

export function countedItemToJson(item: CountedItem) {
    return {
        ItemType: item.itemType,
        ItemCount: item.itemCount,
    };
}

export interface MissionReward {
    credits: number;
    items: string[];
    countedItems: CountedItem[];
}

export function missionRewardFromJson(json: any): MissionReward {
    return {
        credits: json?.credits ?? 0,
        items: json?.items ?? [],
        countedItems: (json?.countedItems ?? []).map(countedItemFromJson),
    };
}

export function missionRewardToJson(reward: MissionReward) {
    return {
        credits: reward.credits,
        items: reward.items,
        countedItems: reward.countedItems.map(countedItemToJson),
    };
}

export interface MissionInfo {
    location: string;
    missionType: string;
    faction: string;
    difficulty: string;
    levelOverride: string;
    minEnemyLevel: number;
    maxEnemyLevel: number;
    descText: string;
    maxWaveNum?: number;
    missionReward: MissionReward;
}

export function missionInfoFromJson(json: any): MissionInfo {
    return {
        location: json?.location ?? "",
        missionType: json?.missionType ?? "",
        faction: json?.faction ?? "",
        difficulty: String(json?.difficulty ?? ""),
        levelOverride: json?.levelOverride ?? "",
        minEnemyLevel: json?.minEnemyLevel ?? 0,
        maxEnemyLevel: json?.maxEnemyLevel ?? 0,
        descText: json?.descText ?? "",
        maxWaveNum: json?.maxWaveNum,
        missionReward: missionRewardFromJson(json?.missionReward),
    };
}

export function missionInfoToJson(info: MissionInfo) {
    return {
        location: info.location,
        missionType: info.missionType,
        faction: info.faction,
        difficulty: info.difficulty,
        levelOverride: info.levelOverride,
        minEnemyLevel: info.minEnemyLevel,
        maxEnemyLevel: info.maxEnemyLevel,
        descText: info.descText,
        maxWaveNum: info.maxWaveNum,
        missionReward: missionRewardToJson(info.missionReward),
    };
}
