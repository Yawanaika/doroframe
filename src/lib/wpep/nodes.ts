import { Regions, Factions, MissionTypes, tr } from "@/lib/wpep";

export interface NodeInfo {
    nameZh: string;
    systemNameZh: string;
    factionNameZh: string;
    missionTypeZh: string;
    maxEnemyLevel: number;
    minEnemyLevel: number;
}

// 解析 SolNode XXX 节点 key（来自 worldstate.location/missionInfo）为可显示信息
export function resolveNode(location: string | undefined): NodeInfo {
    const node = location ? (Regions as any)[location] : undefined;
    return {
        nameZh: tr(node?.name) || location || "",
        systemNameZh: tr(node?.systemName),
        factionNameZh: tr((Factions as any)[node?.faction]?.name),
        missionTypeZh: tr((MissionTypes as any)[node?.missionType]?.name)||tr(node?.missionName),
        maxEnemyLevel: node?.maxEnemyLevel || 0,
        minEnemyLevel: node?.minEnemyLevel || 0,
    };
}
