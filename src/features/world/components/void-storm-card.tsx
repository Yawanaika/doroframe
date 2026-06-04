import { memo } from "react";
import type { VoidStorm } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useVoidStormsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";

const VoidStormRow = memo(function VoidStormRow({ storm }: { storm: VoidStorm }) {
    const sec = useCountdown(storm.expiry);
    const node = resolveNode(storm.node);
    return (
        <EventCard
            title={node.nameZh || storm.node}
            subtitle={storm.activeMissionTier}
            badge={storm.isHard ? "钢铁" : "普通"}
            countdown={formatCountdown(sec)}
        >
            <div className="text-xs text-muted-foreground">{node.factionNameZh}</div>
        </EventCard>
    );
});

export function VoidStormList() {
    const { data, isPending, isError, error } = useVoidStormsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无虚空裂缝" />;
    return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.map((s) => (
                <VoidStormRow key={s.id} storm={s} />
            ))}
        </div>
    );
}
