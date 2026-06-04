import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useSeasonInfoQuery } from "@/features/world/queries";
import { tr } from "@/lib/wpep";

export function SeasonInfoCard() {
    const { data, isPending, isError, error } = useSeasonInfoQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data) return <CardEmpty text="无午夜电波" />;
    const daily = data.activeChallenges.filter((c) => c.daily);
    const weekly = data.activeChallenges.filter((c) => !c.daily);
    return (
        <EventCard
            title={`午夜电波 · 季 ${data.season}`}
            subtitle={`阶段 ${data.phase} · ${tr(data.affiliationTag)}`}
            badge={`${data.activeChallenges.length} 挑战`}
        >
            <div className="space-y-2 text-sm">
                <div>
                    <div className="mb-1 text-xs text-muted-foreground">每日</div>
                    <div className="flex flex-wrap gap-1.5">
                        {daily.map((c) => (
                            <Badge key={c.id} variant="outline">
                                {tr(c.challenge) || c.challenge}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="mb-1 text-xs text-muted-foreground">每周</div>
                    <div className="flex flex-wrap gap-1.5">
                        {weekly.map((c) => (
                            <Badge key={c.id} variant="outline">
                                {tr(c.challenge) || c.challenge}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </EventCard>
    );
}
