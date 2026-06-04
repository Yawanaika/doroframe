import { memo } from "react";
import type { PrimeVault } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { usePrimeVaultTradersQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { tr } from "@/lib/wpep";

const PrimeVaultRow = memo(function PrimeVaultRow({
    vault,
}: {
    vault: PrimeVault;
}) {
    const sec = useCountdown(vault.expiry);
    return (
        <EventCard
            title="Prime 宝库"
            subtitle={`常驻 ${vault.evergreenManifest.length} 件 · 限时 ${vault.manifest.length} 件`}
            countdown={formatCountdown(sec)}
        >
            <div className="flex flex-wrap gap-1.5 text-sm">
                {vault.manifest.slice(0, 10).map((it) => (
                    <Badge key={it.itemType} variant="outline">
                        {tr(it.itemType) || it.itemType}
                    </Badge>
                ))}
                {vault.manifest.length > 10 ? (
                    <Badge variant="secondary">
                        +{vault.manifest.length - 10}
                    </Badge>
                ) : null}
            </div>
        </EventCard>
    );
});

export function PrimeVaultList() {
    const { data, isPending, isError, error } = usePrimeVaultTradersQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="暂无 Prime 宝库" />;
    return (
        <div className="grid gap-3">
            {data.map((v) => (
                <PrimeVaultRow key={v.id} vault={v} />
            ))}
        </div>
    );
}
