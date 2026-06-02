import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface ActiveMission extends Base {
    region: number;
    seed: number;
    node: string;
    missionType: string;
    modifier: string;
    hard?: boolean;
}

export function activeMissionFromJson(json: any): ActiveMission {
    return {
        ...parseBase(json),
        region: json?.Region ?? 0,
        seed: json?.Seed ?? 0,
        node: json?.Node ?? "",
        missionType: json?.MissionType ?? "",
        modifier: json?.Modifier ?? "",
        hard: json?.Hard,
    };
}

export function activeMissionToJson(m: ActiveMission) {
    return {
        ...serializeBase(m),
        region: m.region,
        seed: m.seed,
        node: m.node,
        missionType: m.missionType,
        modifier: m.modifier,
        hard: m.hard,
    };
}
