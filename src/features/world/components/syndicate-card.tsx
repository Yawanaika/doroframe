import { memo } from "react";
import type { Syndicate } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useSyndicateMissionsQuery } from "@/features/world/queries";
import { tr } from "@/lib/wpep";
import {useTranslation} from "react-i18next";

const SyndicateRow = memo(function SyndicateRow({
    syndicate,
}: {
    syndicate: Syndicate;
}) {
    const [sj] = useTranslation("syndicate.jobs");
    return (
        <EventCard
            title={tr(`/Lotus/Language/Menu/Syndicate${syndicate.tag}`) || syndicate.tag}
            subtitle={`集团每日 · 节点 ${syndicate.nodes?.length ?? 0}`}
        >
            <div className="flex flex-wrap gap-1.5 text-sm">
                {syndicate.jobs?.length ? (
                    <span className="w-full text-xs text-muted-foreground">
                        {syndicate.jobs.map((j) => {
                            return (
                                <div>
                                    {sj(j.jobType)}
                                </div>
                            )
                        })}
                    </span>
                ) : null}
            </div>
        </EventCard>
    );
});

export function SyndicateList() {
    const { data, isPending, isError, error } = useSyndicateMissionsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无集团每日任务" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((s) => (
                <SyndicateRow key={s.tag} syndicate={s} />
            ))}
        </div>
    );
}
