import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface Goal extends Base {
    node: string;
    healthPct: number;
    desc: string;
    tag: string;
    faction: string;
    icon?: string;
    interimGoals: number[];
    interimRewards: Reward[];
    rewardGoal?: number;
    reward?: Reward;
}

interface Reward {
    credits?: number;
    xp?: number;
    items: string[];
}

export function goalFromJson(json: any): Goal {
    return {
        ...parseBase(json),
        node: json?.VictimNode ?? json?.Node ?? "",
        healthPct: json?.HealthPct ?? 0,
        desc: json?.Desc ?? "",
        tag: json?.Tag ?? "",
        faction: json?.Faction ?? "",
        icon: json?.Icon,
        interimGoals: json?.InterimGoals ?? [],
        interimRewards: (json?.InterimRewards ?? []).map(rewardFromJson),
        rewardGoal: json?.Goal,
        reward: json?.Reward ? rewardFromJson(json.Reward) : undefined,
    };
}

export function goalToJson(g: Goal) {
    return {
        ...serializeBase(g),
        node: g.node,
        healthPct: g.healthPct,
        desc: g.desc,
        tag: g.tag,
        faction: g.faction,
        icon: g.icon,
        interimGoals: g.interimGoals,
        interimRewards: g.interimRewards.map(rewardToJson),
        rewardGoal: g.rewardGoal,
        reward: g.reward ? rewardToJson(g.reward) : undefined,
    };
}

function rewardFromJson(json: any): Reward {
    return {
        credits: json?.credits ?? 0,
        xp: json?.xp ?? 0,
        items: json?.items ?? [],
    };
}

function rewardToJson(r: Reward) {
    return {
        credits: r.credits,
        xp: r.xp,
        items: r.items,
    };
}
