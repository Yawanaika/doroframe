import {Base, parseBase, serializeBase} from "@/types/wf-state/world/base.ts";

export interface Conquest extends Base{
    type: string;
    missions: ConquestMission[];
    variables: string[];
}

interface ConquestMission {
    faction: string;
    missionType: string;
    difficulties: Difficulty[];
}

interface Difficulty {
    type: string;
    deviation: string;
    risks: string[];
}

export function conquestFromJson(json: any): Conquest {
    return {
        ...parseBase(json),
        type: json.Type,
        missions: (json?.Missions ?? []).map(conquestMissionFromJson),
        variables: json?.Variables ?? [],
    };
}

export function conquestToJson(c: Conquest) {
    return {
        ...serializeBase(c),
        type: c.type,
        missions: c.missions.map(conquestMissionToJson),
        variables: c.variables,
    };
}

function conquestMissionFromJson(json: any): ConquestMission {
    return {
        faction: json?.faction ?? "",
        missionType: json?.missionType ?? "",
        difficulties: (json?.difficulties ?? []).map(difficultyFromJson),
    };
}

function conquestMissionToJson(m: ConquestMission) {
    return {
        faction: m.faction,
        missionType: m.missionType,
        difficulties: m.difficulties.map(difficultyToJson),
    };
}

function difficultyFromJson(json: any): Difficulty {
    return {
        type: json?.type ?? "",
        deviation: json?.deviation ?? "",
        risks: json?.risks ?? [],
    };
}

function difficultyToJson(d: Difficulty) {
    return {
        type: d.type,
        deviation: d.deviation,
        risks: d.risks,
    };
}
