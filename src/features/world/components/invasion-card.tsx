import { memo } from "react";
import type { Invasion } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useInvasionsQuery } from "@/features/world/queries";
import { resolveNode } from "@/lib/wpep/nodes";
import { tr } from "@/lib/wpep";

const InvasionRow = memo(function InvasionRow({
    invasion,
}: {
    invasion: Invasion;
}) {
    const node = resolveNode(invasion.node);
    const progress = Math.round((invasion.count / Math.max(1, invasion.goal)) * 100);
    const left = invasion.goal - invasion.count;
    const side = left > 0 ? "防守方领先" : "进攻方领先";
    return (
        <EventCard
            title={node.nameZh || invasion.node}
            subtitle={`${tr(invasion.faction)} vs ${tr(invasion.defenderFaction)}`}
            badge={invasion.completed ? "已结束" : side}
            countdown={`${progress}%`}
        >
            <div className="flex flex-wrap items-center gap-2 text-sm">
                {invasion.attackerReward?.countedItems.map((it) => (
                    <Badge key={`a-${it.itemType}`} variant="outline">
                        进攻 · {tr(it.itemType) || it.itemType} × {it.itemCount}
                    </Badge>
                ))}
                {invasion.defenderReward?.countedItems.map((it) => (
                    <Badge key={`d-${it.itemType}`} variant="outline">
                        防守 · {tr(it.itemType) || it.itemType} × {it.itemCount}
                    </Badge>
                ))}
            </div>
        </EventCard>
    );
});

export function InvasionList() {
    const { data, isPending, isError, error } = useInvasionsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="当前没有入侵任务" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((iv) => (
                <InvasionRow key={iv.id} invasion={iv} />
            ))}
        </div>
    );
}
