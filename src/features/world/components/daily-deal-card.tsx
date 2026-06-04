import { memo } from "react";
import type { DailyDeal } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardError, CardSkeleton } from "@/components/card-states";
import { useDailyDealsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import {itemDetail, tr} from "@/lib/wpep";
import {useTranslation} from "react-i18next";

const DailyDealRow = memo(function DailyDealRow({ deal }: { deal: DailyDeal }) {
    const sec = useCountdown(deal.expiry);
    const detail = itemDetail(deal.storeItem);
    const [t] = useTranslation();
    return (
        <EventCard
            title={tr(detail?.name) || deal.storeItem}
            subtitle={`${deal.amountSold}/${deal.amountTotal} ${t("deal.sales")}`}
            image={detail?.icon}
            imageAlt={detail?.description}
            badge={`-${deal.discount}%`}
            countdown={formatCountdown(sec)}
        >
            <div className="flex items-center text-sm">
                <span className="text-muted-foreground tabular-nums flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {deal.salePrice}
                        <img src="/images/Platinum.png" alt="Platinum" className="w-4 h-4"/>
                    </div>
            
                    <div className="line-through flex items-center gap-1">
                        {deal.originalPrice}
                        <img src="/images/Platinum.png" alt="Platinum" className="w-4 h-4"/>
                    </div>
                </span>
            </div>
        </EventCard>
    );
});

export function DailyDealList() {
    const { data, isPending, isError, error } = useDailyDealsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((d) => (
                <DailyDealRow key={d.id} deal={d} />
            ))}
        </div>
    );
}
