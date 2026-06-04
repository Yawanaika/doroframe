import { memo } from "react";
import type { Goal } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useGoalsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import {tr, trImage} from "@/lib/wpep";
import {Tooltip,TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const GoalRow = memo(function GoalRow({ goal }: { goal: Goal }) {
    const sec = useCountdown(goal.expiry);
    const gpSec = useCountdown(goal.gracePeriod);
    const node = resolveNode(goal.node);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <EventCard
                    title={tr(goal.desc) || goal.desc || "限时活动"}
                    subtitle={node.nameZh || undefined}
                    badge={tr(goal.faction)}
                    image={trImage(goal.icon)}
                    countdown={formatCountdown(sec)}
                    redemption = {formatCountdown(gpSec)}
                >
                    <div className="flex flex-wrap gap-1.5 text-sm">
                        {goal.reward?.items.map((it) => (
                            <Badge key={it} variant="outline">
                                {tr(it) || it}
                            </Badge>
                        ))}
                    </div>
                </EventCard>
            </TooltipTrigger>
            <TooltipContent align="center">
                <p>这是卡片的提示信息</p>
            </TooltipContent>
        </Tooltip>
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
