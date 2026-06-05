import { memo } from "react";
import type { Sorty } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useSortiesQuery, useLiteSortiesQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import { tr } from "@/lib/wpep";
import {useTranslation} from "react-i18next";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const Narmer = "/Lotus/Language/Cosmetics/ColourPickerNarmerName";

const SortyRow = memo(function SortyRow({
    sorty,
    title,
}: {
    sorty: Sorty;
    title: string;
}) {
    const sec = useCountdown(sorty.expiry);
    const [t] = useTranslation();
    const [tb] = useTranslation('sorty.boss');
    const [tsm] = useTranslation('sorty.modifer');
    const [tsmd] = useTranslation('sorty.modifer.desc');
    return (
        <EventCard
            title={t(title).replace("|Boss|",tb(sorty.boss))}
            countdown={formatCountdown(sec)}
        >
            <div className="grid gap-1.5 text-sm">
                {sorty.variants.map((v, i) => {
                    const node = resolveNode(v.node);
                    return (
                        <div key={i} className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">
                                {node.nameZh} · {node.systemNameZh} · {tr(v.missionType)}
                            </span>
                                {v.modifierType ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge variant="outline">{tsm(v.modifierType)}</Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{tsmd(v.modifierType)}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : null}
                            <div>
                                <Badge variant="outline">{
                                    title === "sorty.title"
                                    ? node.factionNameZh
                                    : tr(Narmer)
                                }</Badge>
                            </div>
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
    return (
        <div className="grid gap-3">
            {data.map((s) => (
                <SortyRow key={s.id} sorty={s} title={"sorty.title"} />
            ))}
        </div>
    );
}

export function LiteSortyList() {
    const { data, isPending, isError, error } = useLiteSortiesQuery();
    if (isPending) return <CardSkeleton rows={3} />;
    if (isError) return <CardError message={String(error)} />;
    return (
        <div className="grid gap-3">
            {data.map((s) => (
                <SortyRow key={s.id} sorty={s} title={"sorty.title.lite"} />
            ))}
        </div>
    );
}
