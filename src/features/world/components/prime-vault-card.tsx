import { memo } from "react";
import type { PrimeVault } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { usePrimeVaultTradersQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { useTranslation } from "react-i18next";
import { itemDetail } from "@/lib/wpep";

interface PrimVaultItem {
    itemType: string;
    primePrice?: number;
    regularPrice?: number;
}

const PrimVaultPrice = memo(function PrimVaultPrice({ items, title }: { items: PrimVaultItem[]; title: string }) {
    return (
        <EventCard title={title}>
            <div className="flex flex-col gap-2">
                {items.map((it) => {
                const item = itemDetail(it.itemType);
                return (
                    <EventCard
                        key={it.itemType}
                        title={`${item?.name}`}
                        image={item?.icon}
                    >
                        <div className="gap-1">
                            {it.primePrice != null && (
                                <div className="flex items-center gap-1">
                                    {it.primePrice}
                                    <img src="/images/PrimeToken.png" alt="Prime 御品" className="w-4 h-4" />
                                </div>
                            )}
                            {it.regularPrice != null && (
                                <div className="flex items-center gap-1">
                                    {it.regularPrice}
                                    <img src="/images/Aya.png" alt="Aya" className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </EventCard>
                );
            })}
            </div>
        </EventCard>
    );
});

const PrimeVaultRow = memo(function PrimeVaultRow({
    vault,
}: {
    vault: PrimeVault;
}) {
    const sec = useCountdown(vault.expiry);
    const [t] = useTranslation();
    return (
        <EventCard
            title={`${t("npc.Varzia")}`}
            image="/images/Varzia.png"
            countdown={formatCountdown(sec)}
        >
            <div className="grid grid-cols-2 gap-2 text-sm">
                <PrimVaultPrice items={vault.manifest} title="限时" />
                <PrimVaultPrice items={vault.evergreenManifest} title="常驻" />
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
