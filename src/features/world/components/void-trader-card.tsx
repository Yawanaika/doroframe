import { memo } from "react";
import type { VoidTrader } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useVoidTradersQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import { tr } from "@/lib/wpep";
import {useTranslation} from "react-i18next";

const VoidTraderRow = memo(function VoidTraderRow({
    trader,
}: {
    trader: VoidTrader;
}) {
    const sec = useCountdown(trader.expiry);
    const arrivalSec = useCountdown(trader.activation);
    const node = resolveNode(trader.node);
    const arrived = arrivalSec === 0;
    const [t] = useTranslation();
    return (
        <EventCard
            title={tr(trader.charater)}
            subtitle={`${node.nameZh} · ${node.systemNameZh}`}
            image={"/images/Baro'Ki Teel.png"}
            badge={arrived ? t("trader.arrived") : t("trader.departed")}
            countdown={
                arrived
                    ? `${formatCountdown(sec)} ${t("trader.leave")} `
                    : `${formatCountdown(arrivalSec)} ${t("trader.arrived")}`
            }
        >
            {trader.manifest?.length ? (
                <div className="flex flex-wrap gap-1.5 text-sm">
                    {trader.manifest.slice(0, 8).map((it) => (
                        <Badge key={it.itemType} variant="outline">
                            {tr(it.itemType) || it.itemType} · {it.primePrice}DC
                        </Badge>
                    ))}
                    {trader.manifest.length > 8 ? (
                        <Badge variant="secondary">
                            +{trader.manifest.length - 8}
                        </Badge>
                    ) : null}
                </div>
            ) : (
                <span className="text-xs text-muted-foreground">
                    {t("trader.manifest.unpublished")}
                </span>
            )}
        </EventCard>
    );
});

export function VoidTraderList() {
    const { data, isPending, isError, error } = useVoidTradersQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    return (
        <div className="grid gap-3">
            {data.map((t) => (
                <VoidTraderRow key={t.id} trader={t} />
            ))}
        </div>
    );
}
