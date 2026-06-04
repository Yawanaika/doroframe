import { memo } from "react";
import type { ActiveMission } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useActiveMissionsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import { tr } from "@/lib/wpep";

const ActiveMissionRow = memo(function ActiveMissionRow({
    mission,
}: {
    mission: ActiveMission;
}) {
    const sec = useCountdown(mission.expiry);
    const node = resolveNode(mission.node);
    return (
        <EventCard
            title={node.nameZh || mission.node}
            subtitle={`${tr(mission.missionType) || mission.missionType}`}
            badge={mission.hard ? "钢铁" : undefined}
            countdown={formatCountdown(sec)}
        >
            <div className="flex flex-wrap gap-1.5 text-sm">
                {mission.modifier ? (
                    <Badge variant="outline">{tr(mission.modifier)}</Badge>
                ) : null}
            </div>
        </EventCard>
    );
});

export function ActiveMissionList() {
    const { data, isPending, isError, error } = useActiveMissionsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无仲裁" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((m) => (
                <ActiveMissionRow key={m.id} mission={m} />
            ))}
        </div>
    );
}
