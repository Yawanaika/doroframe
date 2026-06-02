import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface Sorty extends Base {
    boss: string;
    reward: string;
    seed: number;
    variants: Variant[];
    twitter?: boolean;
}

interface Variant {
    missionType: string;
    modifierType?: string;
    node: string;
    tileset?: string;
}

export function sortyFromJson(json: any): Sorty {
    const rawVariants: any[] = json?.Variants ?? json?.Missions ?? [];
    return {
        ...parseBase(json),
        boss: json?.Boss ?? "",
        reward: json?.Reward ?? "",
        seed: json?.Seed ?? 0,
        variants: rawVariants.map(variantFromJson),
        twitter: json?.Twitter,
    };
}

export function sortyToJson(s: Sorty) {
    return {
        ...serializeBase(s),
        boss: s.boss,
        reward: s.reward,
        seed: s.seed,
        variants: s.variants.map(variantToJson),
        twitter: s.twitter,
    };
}

function variantFromJson(json: any): Variant {
    return {
        missionType: json?.missionType ?? "",
        modifierType: json?.modifierType,
        node: json?.node ?? "",
        tileset: json?.tileset,
    };
}

function variantToJson(v: Variant) {
    return {
        missionType: v.missionType,
        modifierType: v.modifierType,
        node: v.node,
        tileset: v.tileset,
    };
}
