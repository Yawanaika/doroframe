import { memo } from "react";
import type { Sorty } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useSortiesQuery, useLiteSortiesQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import { tr } from "@/lib/wpep";

const SortyRow = memo(function SortyRow({
    sorty,
    title,
}: {
    sorty: Sorty;
    title: string;
}) {
    const sec = useCountdown(sorty.expiry);
    // console.log(
    //     sorty.variants.map((v) => {
    //         return v.modifierType;
    //     })
    // )
    return (
        <EventCard
            title={title}
            subtitle={tr(sorty.boss) || sorty.boss}
            badge={tr(sorty.reward) || undefined}
            countdown={formatCountdown(sec)}
        >
            <div className="grid gap-1.5 text-sm">
                {sorty.variants.map((v, i) => {
                    const node = resolveNode(v.node);
                    return (
                        <div key={i} className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">
                                {node.nameZh} · {tr(v.missionType) || v.missionType}
                            </span>
                            {v.modifierType ? (
                                <Badge variant="outline">{tr(v.modifierType)}</Badge>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </EventCard>
    );
});

export function SortyList() {
    const { data, isPending, isError, error } = useSortiesQuery();
    if (isPending) return <CardSkeleton rows={3} />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="今日无每日突击" />;
    return (
        <div className="grid gap-3">
            {data.map((s) => (
                <SortyRow key={s.id} sorty={s} title="每日突击" />
            ))}
        </div>
    );
}

export function LiteSortyList() {
    const { data, isPending, isError, error } = useLiteSortiesQuery();
    if (isPending) return <CardSkeleton rows={3} />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="今日无执刑官突击" />;
    return (
        <div className="grid gap-3">
            {data.map((s) => (
                <SortyRow key={s.id} sorty={s} title="执刑官" />
            ))}
        </div>
    );
}
