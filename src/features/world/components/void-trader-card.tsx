import { memo } from "react";
import type { VoidTrader } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useVoidTradersQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import {itemDetail, itemIcon, itemName, tr} from "@/lib/wpep";
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
            {trader.manifest ? (
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {trader.manifest.map((it) => {
                        const item = itemDetail(it.itemType);
                        return (
                            <EventCard
                                key={it.itemType}
                                title={item?.name? item.name : itemName(it.itemType)}
                                subtitle={it.limit? `限购: ${it.limit}` : ""}
                                image={item?.icon? item.icon : itemIcon(it.itemType)}
                            >
                                <div className="flex flex-col gap-1">
                                    {it.primePrice > 0 && (
                                        <div className="flex items-center gap-1">
                                            {it.primePrice}
                                            <img src="/images/PrimeBucks.png" alt="" role="presentation" className="w-4 h-4"/>
                                        </div>
                                    )}
                                    
                                    {it.regularPrice > 0 && (
                                        <div className="flex items-center gap-1">
                                            {it.regularPrice}
                                            <img src="/images/Credits.png" alt="" role="presentation" className="w-4 h-4"/>
                                        </div>
                                    )}
                                </div>
                            </EventCard>
                        )
                    })}
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
    if (!data?.length) return <CardEmpty text="暂无虚空商人" />;
    return (
        <div className="grid gap-3">
            {data.map((t) => (
                <VoidTraderRow key={t.id} trader={t} />
            ))}
        </div>
    );
}
