import { memo } from "react";
import type { Syndicate } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useSyndicateMissionsQuery } from "@/features/world/queries";
import { tr } from "@/lib/wpep";
import { resolveNode } from "@/lib/wpep/nodes";

const SyndicateRow = memo(function SyndicateRow({
    syndicate,
}: {
    syndicate: Syndicate;
}) {
    return (
        <EventCard
            title={tr(`/Lotus/Language/Menu/Syndicate${syndicate.tag}`) || syndicate.tag}
            subtitle={`集团每日 · 节点 ${syndicate.nodes?.length ?? 0}`}
        >
            <div className="flex flex-wrap gap-1.5 text-sm">
                {(syndicate.nodes ?? []).map((n) => {
                    const node = resolveNode(n);
                    return (
                        <Badge key={n} variant="outline">
                            {node.nameZh}
                        </Badge>
                    );
                })}
                {syndicate.jobs?.length ? (
                    <span className="w-full text-xs text-muted-foreground">
                        悬赏 {syndicate.jobs.length} 个 ·{" "}
                        {syndicate.jobs.map((j) => tr(j.jobType) || j.jobType).join(" / ")}
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
