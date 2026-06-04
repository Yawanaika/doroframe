import { memo } from "react";
import type { KnownCalendarSeason } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useCalendarSeasonsQuery } from "@/features/world/queries";
import { tr } from "@/lib/wpep";

const SeasonRow = memo(function SeasonRow({
    season,
}: {
    season: KnownCalendarSeason;
}) {
    return (
        <EventCard
            title={`1999 日历 · ${tr(season.season) || season.season}`}
            subtitle={`Year ${season.yearIteration}`}
            badge={`v${season.version}`}
        >
            <div className="flex flex-wrap gap-1.5 text-sm">
                {season.days.slice(0, 8).map((d) => (
                    <Badge key={d.day} variant="outline">
                        Day {d.day}
                    </Badge>
                ))}
                {season.days.length > 8 ? (
                    <Badge variant="secondary">+{season.days.length - 8}</Badge>
                ) : null}
            </div>
        </EventCard>
    );
});

export function CalendarSeasonList() {
    const { data, isPending, isError, error } = useCalendarSeasonsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无 1999 日历" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((s) => (
                <SeasonRow key={s.id} season={s} />
            ))}
        </div>
    );
}
