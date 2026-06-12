import { memo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { Goal } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useGoalsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import {itemDetail, tr, trImage} from "@/lib/wpep";
import {Progress} from "@/components/ui/progress.tsx";
import {Button} from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {useTranslation} from "react-i18next";

type Reward = NonNullable<Goal["reward"]>;

// 把 interimGoals/interimRewards 与最终 rewardGoal/reward 合并成有序的奖励阶梯
type RewardTier = { score: number; reward: Reward };

function buildRewardTiers(goal: Goal): RewardTier[] {
    const tiers: RewardTier[] = goal.interimRewards.map((reward, i) => ({
        score: goal.interimGoals[i] ?? 0,
        reward,
    }));
    if (goal.reward) {
        tiers.push({ score: goal.rewardGoal ?? 0, reward: goal.reward });
    }
    return tiers;
}

const RewardItems = memo(function RewardItems({ reward }: { reward: Reward }) {
    const [t] = useTranslation();
    return (
        <div className="flex flex-wrap items-center gap-2 divide-y divide-border">
            {reward.credits ? (
                <span className="flex items-center gap-1 text-muted-foreground">
                    {reward.credits.toLocaleString()}
                    <img src={"/images/resources/Credits.png"} alt={"Credits"} className="size-4 object-contain" loading="lazy"/>
                </span>
            ) : null}
            {reward.xp ? (
                <span className="text-muted-foreground">
                    {reward.xp.toLocaleString()} {t("goal.xp")}
                </span>
            ) : null}
            {reward.items.map((it) => {
                const detail = itemDetail(it);
                return (
                    <span
                        key={it}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5"
                    >
                        {detail?.icon ? (
                            <img
                                src={detail.icon}
                                alt=""
                                className="size-4 object-contain"
                                loading="lazy"
                            />
                        ) : null}
                        {detail?.name ?? it}
                    </span>
                );
            })}
        </div>
    );
});

const GoalRewardLadder = memo(function GoalRewardLadder({ goal }: { goal: Goal }) {
    const [open, setOpen] = useState(false);
    const [t] = useTranslation();
    const tiers = buildRewardTiers(goal);
    if (!tiers.length) return null;
    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-muted-foreground"
                >
                    {t("goal.rewards")} · {tiers.length}
                    {open ? (
                        <ChevronUpIcon className="size-3.5" />
                    ) : (
                        <ChevronDownIcon className="size-3.5" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
                <div className="divide-y divide-border">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 py-2 first:pt-0 last:pb-0"
                        >
                            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium tabular-nums text-primary">
                                {tier.score.toLocaleString()}
                            </span>
                            <RewardItems reward={tier.reward} />
                        </div>
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
});

const GoalRow = memo(function GoalRow({ goal }: { goal: Goal }) {
    const sec = useCountdown(goal.expiry);
    const gpSec = useCountdown(goal.gracePeriod);
    const node = resolveNode(goal.node);
    const [t] = useTranslation();
    return (
        <EventCard
            title={tr(goal.desc) || goal.desc || "限时活动"}
            subtitle={`${node.nameZh} · ${node.systemNameZh}`}
            badge={ goal.faction === "FC_Tenno" ? "Tenno" : tr(goal.faction)}
            prefixImg={trImage(goal.icon)}
            countdown={formatCountdown(sec)}
            {...(goal.gracePeriod && { redemption: formatCountdown(gpSec) })}
        >
            {goal?.healthPct ?(
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{t("goal.pct")}</span>
                        <span>{(goal.healthPct * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={goal.healthPct * 100} />
                </div>
            ): null}
            <div className="mt-4">
                <GoalRewardLadder goal={goal} />
            </div>
        </EventCard>
    );
});

export function GoalList() {
    const { data, isPending, isError, error } = useGoalsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无限时活动" />;
    return (
        <div className="grid gap-3 md:grid-cols-1">
            {data.map((g) => (
                <GoalRow key={g.id} goal={g} />
            ))}
        </div>
    );
}
