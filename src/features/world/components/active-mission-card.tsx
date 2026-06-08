import { memo } from "react";
import type { ActiveMission } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useActiveMissionsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import {modifyVoidEnemyLevel, sortVoidEvents} from "@/features/world/sort-void-events.ts";
import {useTranslation} from "react-i18next";

const ActiveMissionRow = memo(function ActiveMissionRow({
    mission,
}: {
    mission: ActiveMission;
}) {
    const sec = useCountdown(mission.expiry);
    const node = resolveNode(mission.node);
    const [vd] = useTranslation('void.dict');
    const maxEnemyLevel = modifyVoidEnemyLevel(mission.hard, mission.modifier, node.maxEnemyLevel);
    const minEnemyLevel = modifyVoidEnemyLevel(mission.hard, mission.modifier, node.minEnemyLevel);
    return (
        <EventCard
            title={`${node.missionTypeZh} (${minEnemyLevel} - ${maxEnemyLevel})`}
            subtitle={`${node.nameZh}· ${node.systemNameZh}`}
            image={mission.modifier === 'VoidT6'?[
                'void/VoidT1.png',
                'void/VoidT2.png',
                'void/VoidT3.png',
                'void/VoidT4.png',
            ]:`/void/${mission.modifier}.png`}
            badge={mission.hard ? "钢铁" : "普通"}
            countdown={formatCountdown(sec)}
        >
            <div className="text-xs text-muted-foreground">{`${vd(mission.modifier)} ${node.factionNameZh}` }</div>
        </EventCard>
    );
});

export function ActiveMissionList() {
    const { data, isPending, isError, error } = useActiveMissionsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无虚空裂缝" />;
    const sortedData = sortVoidEvents(data);
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {sortedData.map((m) => (
                <ActiveMissionRow key={m.id} mission={m} />
            ))}
        </div>
    );
}
