import {asDateMs, Base, parseBase, serializeBase} from "@/types/wf-state/world/base.ts";

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
    gracePeriod?: string;
    bonusGoal?: number;
    bonusReward?: Reward;
}

interface Reward {
    credits?: number;
    xp?: number;
    items: string[];
    countedItems?: countedItem[];
}

interface countedItem {
    itemType: string;
    itemCount: number;
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
        gracePeriod: asDateMs(json?.GracePeriod),
        bonusGoal: json?.BonusGoal,
        bonusReward: json?.BonusReward ? rewardFromJson(json.BonusReward) : undefined,
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
        gracePeriod: g.gracePeriod,
        bonusGoal: g.bonusGoal,
        bonusReward: g.bonusReward ? rewardToJson(g.bonusReward) : undefined,
    };
}

function rewardFromJson(json: any): Reward {
    return {
        credits: json?.credits ?? 0,
        xp: json?.xp ?? 0,
        items: json?.items ?? [],
        countedItems: json?.countedItems ? json.countedItems.map(countedItemFromJson) : [],
    };
}

function rewardToJson(r: Reward) {
    return {
        credits: r.credits,
        xp: r.xp,
        items: r.items,
        countedItems: r.countedItems?.map(countedItemToJson),
    };
}

function countedItemFromJson(json: any): countedItem {
    return {
        itemType: json?.ItemType ?? "",
        itemCount: json?.ItemCount ?? 0,
    };
}

function countedItemToJson(c: countedItem) {
    return {
        itemType: c.itemType,
        itemCount: c.itemCount,
    };
}