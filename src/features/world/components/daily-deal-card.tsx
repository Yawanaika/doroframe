import { memo } from "react";
import type { DailyDeal } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useDailyDealsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { tr } from "@/lib/wpep";

const DailyDealRow = memo(function DailyDealRow({ deal }: { deal: DailyDeal }) {
    const sec = useCountdown(deal.expiry);
    return (
        <EventCard
            title={tr(deal.storeItem) || deal.storeItem}
            subtitle={`${deal.amountSold}/${deal.amountTotal} 已售`}
            badge={`-${deal.discount}%`}
            countdown={formatCountdown(sec)}
        >
            <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">{deal.salePrice} P</Badge>
                <span className="text-muted-foreground line-through">
                    {deal.originalPrice} P
                </span>
            </div>
        </EventCard>
    );
});

export function DailyDealList() {
    const { data, isPending, isError, error } = useDailyDealsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无每日折扣" />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((d) => (
                <DailyDealRow key={d.id} deal={d} />
            ))}
        </div>
    );
}
