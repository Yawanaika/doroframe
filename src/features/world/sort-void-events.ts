import type { ActiveMission, VoidStorm } from "@/types/wf-state";
import { resolveNode } from "@/lib/wpep/nodes";

/**
 * 虚空裂缝等级 → 排序权重
 *  对齐 doroprime/lib/constants/void_tier.dart
 */
const VOID_TIER_ORDER: Record<string, number> = {
    VoidT1: 1,
    VoidT2: 2,
    VoidT3: 3,
    VoidT4: 4,
    VoidT5: 5,
    VoidT6: 6,
};

type VoidEvent = ActiveMission | VoidStorm;

const isActiveMission = (item: VoidEvent): item is ActiveMission =>
    "modifier" in item;

const tierCodeOf = (item: VoidEvent): string =>
    isActiveMission(item) ? item.modifier : item.activeMissionTier;

const isHardOf = (item: VoidEvent): boolean =>
    !!item.hard;

const tierWeightOf = (code: string): number =>
    VOID_TIER_ORDER[code] ?? Number.MAX_SAFE_INTEGER;

/**
 * 按 (普通 → 钢铁) → (裂缝等级升序) → (节点等级升序) 排序。
 *
 * 同等级时进一步用节点最高敌人等级决胜：
 *   - 钢铁挑战：T5 → 170，其它 → maxEnemyLevel + 105
 *   - 普通挑战：T5 → 70，其它 → maxEnemyLevel + 5
 */
export function sortVoidEvents<T extends VoidEvent>(items: readonly T[]): T[] {
    return [...items].sort((a, b) => {
        const hardA = isHardOf(a);
        const hardB = isHardOf(b);
        if (hardA !== hardB) return hardA ? 1 : -1;

        const tierA = tierCodeOf(a);
        const tierB = tierCodeOf(b);
        const weightA = tierWeightOf(tierA);
        const weightB = tierWeightOf(tierB);
        if (weightA !== weightB) return weightA - weightB;

        const isT5A = tierA === "VoidT5";
        const isT5B = tierB === "VoidT5";
        const baseA = resolveNode(a.node).maxEnemyLevel;
        const baseB = resolveNode(b.node).maxEnemyLevel;

        const levelA = hardA
            ? isT5A ? 170 : baseA + 105
            : isT5A ? 70 : baseA + 5;
        const levelB = hardB
            ? isT5B ? 170 : baseB + 105
            : isT5B ? 70 : baseB + 5;

        return levelA - levelB;
    });
}

export function modifyVoidEnemyLevel(hard: boolean, tier: string, level: number){
    const isT5 = tier === "VoidT5";
    return hard
        ? isT5 ? 170 : level + 105
        : isT5 ? 70 : level + 5;
}
