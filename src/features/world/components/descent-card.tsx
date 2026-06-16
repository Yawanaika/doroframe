import { memo } from "react";
import type { Descent } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useDescentsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { useTranslation } from "react-i18next";

// BOSS / 绝灵骥 / 特定关卡显示挑战名，其余显示关卡类型
const DT_BOSS = "DT_BOSS";
const DT_UNIQUE = "DT_UNIQUE";
const DT_MIMICS = "DT_MIMICS";
const MECH_COMBAT_ONLY = "MechCombatOnly";
// 忏悔行：以下情形不展示
const HIDE_PENANCE = new Set([
    "BasicRace",
    "BasicBreakTargets",
    "BasicLootCreatures",
    "BasicLoot",
    "CollectionBasic",
    MECH_COMBAT_ONLY,
]);
const MILESTONE_INDEXES = new Set([7, 14, 21]);

const DescentRow = memo(function DescentRow({ descent, index }: { descent: Descent , index: number }) {
    const sec = useCountdown(descent.expiry);
    const [t] = useTranslation("descent.dict");
    const week = t("week").replace("{}",String(index));
    return (
        <EventCard title={week} countdown={formatCountdown(sec)}>
            <div className="flex h-48 flex-col gap-1.5 overflow-y-auto text-sm">
                {descent.challenges.map((c) => {
                    // 同一挑战可能带 NC_ 前缀（如 NC_Darkness / Darkness 均表示同一挑战）
                    const challenge = c.challenge.startsWith("NC_")
                        ? c.challenge.slice(3)
                        : c.challenge;
                    const isMilestone = MILESTONE_INDEXES.has(c.index);
                    // 标题后缀：里程碑 / BOSS / 绝灵骥 / 机甲战斗 → 挑战名，否则关卡类型
                    const useChallengeTitle =
                        isMilestone ||
                        c.type === DT_BOSS ||
                        c.type === DT_UNIQUE ||
                        challenge === MECH_COMBAT_ONLY;
                    const suffix = useChallengeTitle
                        ? t(challenge) || challenge
                        : t(c.type) || c.type;
                    const showPenance =
                        !isMilestone &&
                        c.type !== DT_BOSS &&
                        c.type !== DT_UNIQUE &&
                        c.type !== DT_MIMICS &&
                        !HIDE_PENANCE.has(challenge);
                    return (
                        <div key={c.index} className="flex flex-col">
                            <span className="font-medium">
                                炼狱 {c.index} - {suffix}
                            </span>
                            {showPenance ? (
                                <span className="text-muted-foreground text-xs">
                                    忏悔：{t(challenge) || challenge}
                                </span>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </EventCard>
    );
});

export function DescentList() {
    const { data, isPending, isError, error } = useDescentsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无沉沦之地" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((d,i) => (
                <DescentRow key={d.id} descent={d} index={i+1}/>
            ))}
        </div>
    );
}
