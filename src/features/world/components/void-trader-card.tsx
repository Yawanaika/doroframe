import { memo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { VoidTrader, VtItem } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVoidTradersQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import { itemDetail, itemIcon, itemName, tr } from "@/lib/wpep";
import { useTranslation } from "react-i18next";

const COLLAPSE_THRESHOLD = 10;
const COLLAPSED_VISIBLE = 8;

/** 单行物品：[缩略图] [名称 + 限购 badge] [杜卡德 / 信用点]。扁平 row，不嵌套卡片。 */
const VoidTraderItemRow = memo(function VoidTraderItemRow({ item: it }: { item: VtItem }) {
    const detail = itemDetail(it.itemType);
    const name = detail?.name ?? itemName(it.itemType);
    const icon = detail?.icon ?? itemIcon(it.itemType);
    return (
        <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
            {icon ? (
                <div className="size-10 shrink-0 rounded-md overflow-hidden backdrop-brightness-75 backdrop-contrast-125">
                    <img
                        src={icon}
                        alt={name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            ) : null}
            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                <span className="truncate text-sm font-medium">{name}</span>
                {it.limit ? (
                    <Badge variant="outline" className="w-fit text-xs">
                        限购 {it.limit}
                    </Badge>
                ) : null}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                {it.primePrice > 0 && (
                    <span className="flex items-center gap-1">
                        {it.primePrice}
                        <img src="/images/PrimeBucks.png" alt="" role="presentation" className="w-4 h-4" />
                    </span>
                )}
                {it.regularPrice > 0 && (
                    <span className="flex items-center gap-1">
                        {it.regularPrice}
                        <img src="/images/Credits.png" alt="" role="presentation" className="w-4 h-4" />
                    </span>
                )}
            </div>
        </div>
    );
});

const VoidTraderItemList = memo(function VoidTraderItemList({ items }: { items: VtItem[] }) {
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
                    <VoidTraderItemRow key={it.itemType} item={it} />
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
            prefixImg={"/images/Baro'Ki Teel.png"}
            badge={arrived ? t("trader.arrived") : t("trader.departed")}
            countdown={
                arrived
                    ? `${formatCountdown(sec)} ${t("trader.leave")} `
                    : `${formatCountdown(arrivalSec)} ${t("trader.arrived")}`
            }
        >
            {trader.manifest ? (
                <VoidTraderItemList items={trader.manifest} />
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
