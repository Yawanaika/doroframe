import { memo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { PrimeVault } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { usePrimeVaultTradersQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { useTranslation } from "react-i18next";
import { itemDetail } from "@/lib/wpep";

const COLLAPSE_THRESHOLD = 10;
const COLLAPSED_VISIBLE = 8;

interface PrimVaultItem {
    itemType: string;
    primePrice?: number;
    regularPrice?: number;
}

/** 单行物品：[缩略图] [名称] [价格]。扁平 row，不嵌套卡片。 */
const PrimeVaultItemRow = memo(function PrimeVaultItemRow({ item: it }: { item: PrimVaultItem }) {
    const detail = itemDetail(it.itemType);
    return (
        <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
            {detail?.icon ? (
                <div className="size-10 shrink-0 rounded-md overflow-hidden backdrop-brightness-75 backdrop-contrast-125">
                    <img
                        src={detail.icon}
                        alt={detail?.name ?? it.itemType}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            ) : null}
            <div className="min-w-0 flex-1 truncate text-sm font-medium">
                {detail?.name ?? it.itemType}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                {it.primePrice != null && (
                    <span className="flex items-center gap-1">
                        {it.primePrice}
                        <img src="/images/PrimeToken.png" alt="" role="presentation" className="w-4 h-4" />
                    </span>
                )}
                {it.regularPrice != null && (
                    <span className="flex items-center gap-1">
                        {it.regularPrice}
                        <img src="/images/Aya.png" alt="" role="presentation" className="w-4 h-4" />
                    </span>
                )}
            </div>
        </div>
    );
});

const PrimeVaultItemList = memo(function PrimeVaultItemList({ items }: { items: PrimVaultItem[] }) {
    const [expanded, setExpanded] = useState(false);

    if (!items.length) {
        return <div className="py-3 text-xs text-muted-foreground">暂无商品</div>;
    }

    const collapsible = items.length > COLLAPSE_THRESHOLD;
    const visible = collapsible && !expanded ? items.slice(0, COLLAPSED_VISIBLE) : items;
    const hiddenCount = items.length - COLLAPSED_VISIBLE;

    return (
        <div>
            <div className="divide-y divide-border">
                {visible.map((it) => (
                    <PrimeVaultItemRow key={it.itemType} item={it} />
                ))}
            </div>
            {collapsible ? (
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full text-muted-foreground"
                    onClick={() => setExpanded((v) => !v)}
                >
                    {expanded ? (
                        <>
                            收起
                            <ChevronUpIcon className="size-3.5" />
                        </>
                    ) : (
                        <>
                            查看更多 · {hiddenCount}
                            <ChevronDownIcon className="size-3.5" />
                        </>
                    )}
                </Button>
            ) : null}
        </div>
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
            <Tabs defaultValue="manifest" className="w-full">
                <TabsList>
                    <TabsTrigger value="manifest">
                        限时 · {vault.manifest.length}
                    </TabsTrigger>
                    <TabsTrigger value="evergreen">
                        常驻 · {vault.evergreenManifest.length}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="manifest" className="mt-2">
                    <PrimeVaultItemList items={vault.manifest} />
                </TabsContent>
                <TabsContent value="evergreen" className="mt-2">
                    <PrimeVaultItemList items={vault.evergreenManifest} />
                </TabsContent>
            </Tabs>
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
