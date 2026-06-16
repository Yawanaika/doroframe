import { useMemo } from "react";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ItemOrder } from "@/types/wf-market";
import { useSettingsStore } from "@/store/settings";
import { ORDER_TYPES, statusOf, type OrderTypeCode } from "../constants";
import { avatarUrl } from "../assets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardEmpty, CardSkeleton } from "@/components/card-states";
import { cn } from "@/lib/utils";

interface Props {
    orders: ItemOrder[];
    orderType: OrderTypeCode;
    /** 物品中文名（订单方为中文时使用） */
    itemNameZh: string;
    /** 物品英文名（订单方非中文时使用） */
    itemNameEn: string;
    isLoading: boolean;
    hasQuery: boolean;
}

/**
 * 喊话文案：按订单所有者语言切换中英模板。
 * 物品名同样随订单方语言走 —— 非中文订单方取英文名。
 */
function whisper(order: ItemOrder, nameZh: string, nameEn: string): string {
    const def = ORDER_TYPES[(order.type as OrderTypeCode)] ?? ORDER_TYPES.sell;
    const who = order.user?.ingameName ?? "";
    const zh = (order.user?.locale ?? "en") === "zh-hans";
    const item = zh ? nameZh : nameEn;
    return zh
        ? `/w ${who} 你好! 我想以 ${order.platinum} 白金 ${def.actionZh}: "${item}"。(warframe.market)`
        : `/w ${who} Hi! I want to ${def.actionEn}: "${item}" for ${order.platinum} platinum. (warframe.market)`;
}

/** 订单排序：用户状态 → 价格(卖升买降) → rank 降 → 数量降。 */
function sortOrders(orders: ItemOrder[], orderType: OrderTypeCode): ItemOrder[] {
    return orders
        .filter((o) => o.type === orderType)
        .slice()
        .sort((a, b) => {
            const s = statusOf(b.user?.status).sort - statusOf(a.user?.status).sort;
            if (s !== 0) return s;
            const price =
                orderType === "sell"
                    ? a.platinum - b.platinum
                    : b.platinum - a.platinum;
            if (price !== 0) return price;
            const rank = (b.rank ?? 0) - (a.rank ?? 0);
            if (rank !== 0) return rank;
            return b.quantity - a.quantity;
        });
}

export function OrderList({
    orders,
    orderType,
    itemNameZh,
    itemNameEn,
    isLoading,
    hasQuery,
}: Props) {
    const lang = useSettingsStore((s) => s.lang);
    const { t } = useTranslation();
    const sorted = useMemo(
        () => sortOrders(orders, orderType),
        [orders, orderType],
    );

    if (isLoading) return <CardSkeleton rows={5} />;
    if (!hasQuery) return <CardEmpty text={t("market.empty.no-query")} />;
    if (sorted.length === 0) return <CardEmpty text={t("market.empty.no-match")} />;

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t("market.whisper.copied"));
        } catch {
            toast.error(t("market.whisper.copy-failed"));
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            {sorted.map((order) => {
                const status = statusOf(order.user?.status);
                const msg = whisper(order, itemNameZh, itemNameEn);
                const isSell = order.type === "sell";
                return (
                    <div
                        key={order.id}
                        className="flex items-center gap-3 rounded-xl border bg-card p-2.5 pl-3"
                        style={{ borderLeft: `3px solid ${ORDER_TYPES[orderType].accent}` }}
                    >
                        <Avatar size="lg">
                            <AvatarImage src={avatarUrl(order.user?.avatar)} />
                            <AvatarFallback>
                                {(order.user?.ingameName ?? "?").slice(0, 1)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-3">
                            <span className="block truncate font-medium">
                                {order.user?.ingameName}
                            </span>
                        </div>

                        <span
                            className="flex-2 truncate text-center text-xs font-medium"
                            style={{ color: status.color }}
                        >
                            {lang === "zh" ? status.labelZh : status.labelEn}
                        </span>

                        {order.rank != null && (
                            <span className="flex-1 text-center text-xs text-muted-foreground">
                                {t("market.rank", { rank: order.rank })}
                            </span>
                        )}

                        <span className="flex flex-2 items-center justify-center gap-1 font-semibold">
                            {order.platinum}
                            <img
                                src="/images/resources/Platinum.png"
                                alt="platinum"
                                className="size-4"
                            />
                        </span>

                        <span className="flex flex-2 items-center justify-center gap-1 text-sm">
                            <img
                                src="/images/Coupon.png"
                                alt="qty"
                                className="size-4"
                            />
                            {order.quantity}
                        </span>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant={isSell ? "default" : "secondary"}
                                    onClick={() => copy(msg)}
                                >
                                    <CopyIcon />
                                    {isSell ? t("market.action.buy") : t("market.action.sell")}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className={cn("max-w-sm wrap-break-word")}>
                                {msg}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                );
            })}
        </div>
    );
}
