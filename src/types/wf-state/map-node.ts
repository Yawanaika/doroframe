export interface MapNode {
    code: string;
    name: string;
    systemIndex: number;
    systemName: string;
    nodeType: string;
    masteryReq: number;
    missionType: string;
    missionIndex: number;
    missionName: string;
    faction?: string;
    factionIndex?: number;
    factionName?: string;
    secondaryFaction?: string;
    secondaryFactionIndex?: number;
    secondaryFactionName?: string;
    minEnemyLevel: number;
    maxEnemyLevel: number;
    mastreyExp: number;
    levelOverride?: string;
    rewardManifests?: string[];
    cacheRewardManifest?: string;
    nextNodes?: string[];
    questReq?: string;
    hidden?: boolean;
}