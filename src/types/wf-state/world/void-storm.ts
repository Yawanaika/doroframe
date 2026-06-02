import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface VoidStorm extends Base {
    node: string;
    activeMissionTier: string;
    isHard?: boolean;
}

export function voidStormFromJson(json: any): VoidStorm {
    return {
        ...parseBase(json),
        node: json?.Node ?? "",
        activeMissionTier: json?.ActiveMissionTier ?? "",
        isHard: json?.IsHard ?? false,
    };
}

export function voidStormToJson(s: VoidStorm) {
    return {
        ...serializeBase(s),
        node: s.node,
        activeMissionTier: s.activeMissionTier,
        isHard: s.isHard,
    };
}
