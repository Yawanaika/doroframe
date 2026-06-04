import { memo } from "react";
import type { EndlessXpChoice } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useEndlessXpChoicesQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { tr } from "@/lib/wpep";

const ChoiceRow = memo(function ChoiceRow({
    choice,
}: {
    choice: EndlessXpChoice;
}) {
    const sec = useCountdown(choice.expiry);
    return (
        <EventCard
            title="无尽回廊"
            subtitle={tr(choice.category) || choice.category}
            countdown={formatCountdown(sec)}
        >
            <div className="flex flex-wrap gap-1.5 text-sm">
                {choice.choice.map((c) => (
                    <Badge key={c} variant="outline">
                        {tr(c) || c}
                    </Badge>
                ))}
            </div>
        </EventCard>
    );
});

export function EndlessXpList() {
    const { data, isPending, isError, error } = useEndlessXpChoicesQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无无尽回廊" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((c) => (
                <ChoiceRow key={c.id} choice={c} />
            ))}
        </div>
    );
}
