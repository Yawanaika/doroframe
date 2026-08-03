import { memo } from "react";
import type {
    WeeklyVaultBonusReward,
    WeeklyVaultBonusRewardItem,
} from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useWeeklyVaultBonusRewardsQuery } from "@/features/world/queries";
import { itemDetail, rewardName, tr } from "@/lib/wpep";
import { useTranslation } from "react-i18next";

const WeeklyRewardRow = memo(function WeeklyRewardRow({
    reward,
}: {
    reward: WeeklyVaultBonusRewardItem;
}) {
    const [t] = useTranslation();
    const detail = itemDetail(reward.reward);
    const name = rewardName(reward.reward, { itemCount: reward.itemCount });
    
    return (
        <div
            className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 ${
                reward.rewardClaimed ? "opacity-60" : ""
            }`}
        >
            <span className="w-16 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                {t("weekly-vault.points", {
                    count: reward.pointThreshold.toLocaleString(),
                })}
            </span>
            {detail?.icon ? (
                <img
                    src={detail.icon}
                    alt=""
                    className="size-9 shrink-0 rounded-md object-contain"
                    loading="lazy"
                />
            ) : (
                <div className="size-9 shrink-0 rounded-md bg-muted" aria-hidden="true" />
            )}
            <span
                className={`min-w-0 flex-1 text-sm font-medium ${
                    reward.rewardClaimed ? "line-through" : ""
                }`}
            >
                {name}
            </span>
        </div>
    );
});

const WeeklyRewardCard = memo(function WeeklyRewardCard({
    weeklyReward,
    index,
}: {
    weeklyReward: WeeklyVaultBonusReward;
    index: number;
}) {
    const [t] = useTranslation();
    const rewards = [...weeklyReward.rewards].sort(
        (a, b) => a.pointThreshold - b.pointThreshold,
    );

    return (
        <EventCard
            title={index == 0
                ? t("weekly-vault.week")
                : t("weekly-vault.next-week")}
            subtitle={tr(weeklyReward.bonusRegion) || weeklyReward.bonusRegion}
        >
            {rewards.length ? (
                <div className="divide-y divide-border">
                    {rewards.map((reward, index) => (
                        <WeeklyRewardRow
                            key={`${reward.pointThreshold}-${reward.reward}-${index}`}
                            reward={reward}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">{t("weekly-vault.no-rewards")}</p>
            )}
        </EventCard>
    );
});

export function WeeklyVaultBonusRewardList() {
    const { data, isPending, isError, error } = useWeeklyVaultBonusRewardsQuery();
    const [t] = useTranslation();

    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text={t("weekly-vault.empty")} />;

    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((weeklyReward,index) => (
                <WeeklyRewardCard
                    key={`${weeklyReward.weekCount}-${weeklyReward.bonusRegion}`}
                    weeklyReward={weeklyReward}
                    index={index}
                />
            ))}
        </div>
    );
}
