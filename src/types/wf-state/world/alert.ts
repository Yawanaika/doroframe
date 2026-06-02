import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";
import {
    MissionInfo,
    missionInfoFromJson,
    missionInfoToJson,
} from "@/types/wf-state/world/mission.ts";

export interface Alert extends Base {
    tag: string;
    forceUnlock?: boolean;
    missionInfo: MissionInfo;
    icon?: string;
}

export function alertFromJson(json: any): Alert {
    return {
        ...parseBase(json),
        tag: json?.Tag ?? "",
        forceUnlock: json?.ForceUnlock ?? false,
        missionInfo: missionInfoFromJson(json?.MissionInfo),
        icon: json?.Icon,
    };
}

export function alertToJson(alert: Alert) {
    return {
        ...serializeBase(alert),
        tag: alert.tag,
        forceUnlock: alert.forceUnlock,
        missionInfo: missionInfoToJson(alert.missionInfo),
        icon: alert.icon,
    };
}
