import { memo } from "react";
import type { Conquest } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useConquestsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { tr } from "@/lib/wpep";

const ConquestRow = memo(function ConquestRow({ conquest }: { conquest: Conquest }) {
    const sec = useCountdown(conquest.expiry);
    return (
        <EventCard
            title="九重天 · 征服"
            subtitle={`${conquest.missions.length} 个任务`}
            countdown={formatCountdown(sec)}
        >
            <div className="grid gap-1 text-sm">
                {conquest.missions.map((m, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                        <span>{tr(m.missionType) || m.missionType}</span>
                        <Badge variant="outline">{tr(m.faction)}</Badge>
                    </div>
                ))}
            </div>
        </EventCard>
    );
});

export function ConquestList() {
    const { data, isPending, isError, error } = useConquestsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无九重天任务" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((c) => (
                <ConquestRow key={c.id} conquest={c} />
            ))}
        </div>
    );
}
