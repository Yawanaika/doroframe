import { memo } from "react";
import type { Alert } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useAlertsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import {itemIcon, rewardName, tr} from "@/lib/wpep";

const AlertRow = memo(function AlertRow({ alert }: { alert: Alert }) {
    const node = resolveNode(alert.missionInfo.location);
    const sec = useCountdown(alert.expiry);
    const reward = alert.missionInfo.missionReward;
    return (
        <EventCard
            title={tr(alert.missionInfo.missionType) }
            subtitle={`${node.nameZh} · ${node.systemNameZh} | ${alert.missionInfo.minEnemyLevel}-${alert.missionInfo.maxEnemyLevel}`}
            badge={tr(alert.missionInfo.faction)}
            countdown={formatCountdown(sec)}
        >
            <div className="flex items-center gap-2 text-sm">
                {reward.credits > 0 ? (
                    <Badge variant="outline">
                        {reward.credits}
                        <img src="/images/Credits.png" alt="Credits" className="w-4 h-4"/>
                    </Badge>
                ) : null}
                {reward.items.map((it) => (
                    <Badge key={it} variant="outline">
                        {rewardName(it)}
                        <img src={itemIcon(it)} alt={rewardName(it)} className="w-4 h-4" onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}/>
                    </Badge>
                ))}
                {reward.countedItems.map((it) => (
                    <Badge key={it.itemType} variant="outline">
                        {rewardName(it.itemType)}
                        <img src={itemIcon(it.itemType)} alt={rewardName(it.itemType)} className="w-4 h-4" onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}/>
                        × {it.itemCount}
                    </Badge>
                ))}
            </div>
        </EventCard>
    );
});

export function AlertList() {
    const { data, isPending, isError, error } = useAlertsQuery();

    if (isPending) {
        return (
            <div className="grid gap-3">
                <CardSkeleton />
                <CardSkeleton />
            </div>
        );
    }
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="当前没有进行中的警报" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
            ))}
        </div>
    );
}
