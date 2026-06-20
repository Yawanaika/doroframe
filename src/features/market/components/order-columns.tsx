import { useMemo } from "react";
import { CopyIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import type { Item, ItemOrder } from "@/types/wf-market";
import { statusOf } from "@/features/market/constants";
import { whisper } from "@/features/market/order-list-utils";
import { avatarUrl } from "@/features/market/assets";
import { getSumEndo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface UseOrderColumnsArgs {
    t: TFunction;
    lang: string;
    /** 物品中文名（订单方为中文时用于喊话） */
    itemNameZh: string;
    /** 物品英文名（订单方非中文时用于喊话） */
    itemNameEn: string;
    /** 当前选中物品：计算内融核心(endo)数量所需的基础参数 */
    item: Item | undefined;
    /** 复制喊话文案 */
    copy: (text: string) => void;
}

/** 订单表格列定义。集中放置以让 OrderList 只关心表格外壳与虚拟化。 */
export function useOrderColumns({
    t,
    lang,
    itemNameZh,
    itemNameEn,
    item,
    copy,
}: UseOrderColumnsArgs): ColumnDef<ItemOrder>[] {
    return useMemo<ColumnDef<ItemOrder>[]>(
        () => [
            {
                id: "user",
                accessorFn: (o) => o.user?.ingameName ?? "",
                header: () => t("market.column.user"),
                enableSorting: false,
                cell: ({ row }) => {
                    const order = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar size="lg">
                                <AvatarImage src={avatarUrl(order.user?.avatar)} alt="" />
                                <AvatarFallback>
                                    {(order.user?.ingameName ?? "?").slice(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="min-w-0 truncate font-medium">
                                {order.user?.ingameName}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: "status",
                accessorFn: (o) => statusOf(o.user?.status).sort,
                header: () => t("market.column.status"),
                cell: ({ row }) => {
                    const status = statusOf(row.original.user?.status);
                    return (
                        <span
                            className="text-xs font-medium"
                            style={{ color: status.color }}
                        >
                            {lang === "zh" ? status.labelZh : status.labelEn}
                        </span>
                    );
                },
            },
            {
                id: "reputation",
                accessorFn: (o) => o.user?.reputation ?? -1,
                header: () => t("market.column.reputation"),
                cell: ({ row }) =>
                    row.original.user?.reputation != null ? (
                        <span className="text-xs text-muted-foreground">
                            {row.original.user.reputation}
                        </span>
                    ) : null,
            },
            {
                id: "platinum",
                accessorKey: "platinum",
                header: () => t("market.column.platinum"),
                cell: ({ row }) => (
                    <span className="flex items-center gap-1 font-semibold">
                        {row.original.platinum}
                        <img
                            src="/images/resources/Platinum.png"
                            alt="platinum"
                            className="size-4"
                        />
                    </span>
                ),
            },
            {
                id: "quantity",
                accessorKey: "quantity",
                header: () => t("market.column.quantity"),
                cell: ({ row }) => (
                    <div className="items-center gap-1 text-sm">
                        <span className="flex items-center gap-1 text-sm">
                            <img src="/images/Coupon.png" alt="qty" className="size-4" />
                            {row.original.quantity}
                        </span>
                        {row.original.perTrade != null && row.original.perTrade !== 1? (
                            <span className="text-xs text-muted-foreground">
                                {t("market.perTrade", {perTrade: row.original.perTrade})}
                            </span>
                        ):null}
                    </div>
                ),
            },
            {
                id: "subtype",
                accessorKey: "subtype",
                header: () => t("market.column.subtype"),
                cell: ({ row }) =>
                    row.original.subtype ? (
                        <span className="flex items-center gap-1 text-sm">
                            {t(row.original.subtype, {
                                ns: "subtype",
                                defaultValue: row.original.subtype,
                            })}
                        </span>
                    ) : null,
            },
            {
                id: "rank",
                accessorFn: (o) => o.rank ?? -1,
                header: () => t("market.column.rank"),
                cell: ({ row }) => (
                    <span className="text-xs text-muted-foreground">
                        {row.original.rank}
                    </span>
                ),
            },
            {
                id: "endo",
                // 仅含星数的订单才有 endo，无星订单排序时落到 -1
                accessorFn: (o) =>
                    o.amberStars != null || o.cyanStars != null
                        ? getSumEndo(item, o?.amberStars, o?.cyanStars)
                        : -1,
                header: () => t("market.column.endo"),
                cell: ({ row }) => {
                    const o = row.original;
                    return o.amberStars != null || o.cyanStars != null ? (
                        <span className="flex items-center gap-1 font-mono text-sm">
                            {getSumEndo(item, o?.amberStars, o?.cyanStars)}
                            <img
                                src="/images/resources/FusionPoints.png"
                                alt="endo"
                                className="size-4"
                            />
                        </span>
                    ) : null;
                },
            },
            {
                id: "action",
                header: () => null,
                enableSorting: false,
                cell: ({ row }) => {
                    const order = row.original;
                    const msg = whisper(order, itemNameZh, itemNameEn);
                    const isSell = order.type === "sell";
                    return (
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
                            <TooltipContent className="max-w-sm wrap-break-word">
                                {msg}
                            </TooltipContent>
                        </Tooltip>
                    );
                },
            },
        ],
        [t, lang, itemNameZh, itemNameEn, item, copy],
    );
}

/**
 * 这些列的数据可能整列缺失：无任何订单含该字段时隐藏整列（含表头）。
 * 接收已排序行，返回 TanStack Table 的 columnVisibility 状态。
 */
export function useColumnVisibility(rows: ItemOrder[]): Record<string, boolean> {
    return useMemo<Record<string, boolean>>(() => {
        const hasValue = (fn: (o: ItemOrder) => unknown) =>
            rows.some((o) => {
                const v = fn(o);
                return v != null && v !== "";
            });
        return {
            reputation: hasValue((o) => o.user?.reputation),
            subtype: hasValue((o) => o.subtype),
            rank: hasValue((o) => o.rank),
            endo: hasValue((o) => o.amberStars ?? o.cyanStars),
        };
    }, [rows]);
}
