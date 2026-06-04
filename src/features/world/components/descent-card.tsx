import { memo } from "react";
import type { Descent } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useDescentsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { tr } from "@/lib/wpep";

const DescentRow = memo(function DescentRow({ descent }: { descent: Descent }) {
    const sec = useCountdown(descent.expiry);
    return (
        <EventCard
            title="深层科研 / 时光科研"
            subtitle={`挑战 ${descent.challenges.length}`}
            countdown={formatCountdown(sec)}
        >
            <div className="flex flex-wrap gap-1.5 text-sm">
                {descent.challenges.map((c) => (
                    <Badge key={c.index} variant="outline">
                        {tr(c.challenge) || c.challenge}
                    </Badge>
                ))}
            </div>
        </EventCard>
    );
});

export function DescentList() {
    const { data, isPending, isError, error } = useDescentsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无深层/时光科研" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((d) => (
                <DescentRow key={d.id} descent={d} />
            ))}
        </div>
    );
}
