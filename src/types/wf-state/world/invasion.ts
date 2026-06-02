import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";
import {
    CountedItem,
    countedItemFromJson,
    countedItemToJson,
} from "@/types/wf-state/world/mission.ts";

export interface Invasion extends Base {
    faction: string;
    defenderFaction: string;
    node: string;
    count: number;
    goal: number;
    locTag: string;
    completed: boolean;
    chainId: string;
    attackerReward?: AdReward;
    attackerMissionInfo: AdMissionInfo;
    defenderReward?: AdReward;
    defenderMissionInfo: AdMissionInfo;
}

interface AdReward {
    countedItems: CountedItem[];
}

interface AdMissionInfo {
    seed: number;
    faction: string;
}

export function invasionFromJson(json: any): Invasion {
    return {
        ...parseBase(json),
        faction: json?.Faction ?? "",
        defenderFaction: json?.DefenderFaction ?? "",
        node: json?.Node ?? "",
        count: json?.Count ?? 0,
        goal: json?.Goal ?? 0,
        locTag: json?.LocTag ?? "",
        completed: json?.Completed ?? false,
        chainId: json?.ChainID?.$oid ?? "",
        attackerReward: adRewardFromJson(json?.AttackerReward),
        attackerMissionInfo: adMissionInfoFromJson(json?.AttackerMissionInfo),
        defenderReward: adRewardFromJson(json?.DefenderReward),
        defenderMissionInfo: adMissionInfoFromJson(json?.DefenderMissionInfo),
    };
}

export function invasionToJson(inv: Invasion) {
    return {
        ...serializeBase(inv),
        faction: inv.faction,
        defenderFaction: inv.defenderFaction,
        node: inv.node,
        count: inv.count,
        goal: inv.goal,
        locTag: inv.locTag,
        completed: inv.completed,
        chainId: inv.chainId,
        attackerReward: inv.attackerReward ? adRewardToJson(inv.attackerReward) : undefined,
        attackerMissionInfo: adMissionInfoToJson(inv.attackerMissionInfo),
        defenderReward: inv.defenderReward ? adRewardToJson(inv.defenderReward) : undefined,
        defenderMissionInfo: adMissionInfoToJson(inv.defenderMissionInfo),
    };
}

function adRewardFromJson(json: any): AdReward | undefined {
    if (!json) return undefined;
    return {
        countedItems: (json?.countedItems ?? []).map(countedItemFromJson),
    };
}

function adRewardToJson(r: AdReward) {
    return {
        countedItems: r.countedItems.map(countedItemToJson),
    };
}

function adMissionInfoFromJson(json: any): AdMissionInfo {
    return {
        seed: json?.seed ?? 0,
        faction: json?.faction ?? "",
    };
}

function adMissionInfoToJson(info: AdMissionInfo) {
    return {
        seed: info.seed,
        faction: info.faction,
    };
}
