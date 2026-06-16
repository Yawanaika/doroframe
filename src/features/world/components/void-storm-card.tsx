import { memo } from "react";
import type { VoidStorm } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useVoidStormsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import {useTranslation} from "react-i18next";
import {sortVoidEvents} from "@/features/world/sort-void-events.ts";

const VoidStormRow = memo(function VoidStormRow({ storm }: { storm: VoidStorm }) {
    const sec = useCountdown(storm.expiry);
    const node = resolveNode(storm.node);
    const [t] = useTranslation();
    const [vd] = useTranslation('void.dict');
    return (
        <EventCard
            title={`${node.missionTypeZh} (${node.minEnemyLevel + 10} - ${node.maxEnemyLevel + 10})`}
            subtitle={`${node.nameZh}· ${node.systemNameZh}`}
            prefixImg={`/images/void/${storm.activeMissionTier}.png`}
            badge={storm.hard ? t("event.hard") : t("event.normal")}
            countdown={formatCountdown(sec)}
        >
            <div className="text-xs text-muted-foreground">{`${vd(storm.activeMissionTier)} ${node.factionNameZh}` }</div>
        </EventCard>
    );
});

export function VoidStormList() {
    const { data, isPending, isError, error } = useVoidStormsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无虚空风暴" />;
    const sortedData = sortVoidEvents(data);
    return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sortedData.map((s) => (
                <VoidStormRow key={s.id} storm={s} />
            ))}
        </div>
    );
}
