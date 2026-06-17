import { useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, CopyIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    type ColumnDef,
    type Row,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CardEmpty, CardSkeleton } from "@/components/card-states";
import { cn } from "@/lib/utils";

const ROW_ESTIMATE_SIZE = 58;
const ROW_OVERSCAN = 12;

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

/** 订单排序：用户状态 → 价格(卖升买降) → rank 降 → 数量降。用作表格默认行序。 */
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

function OrderTableRow({
    row,
    accent,
}: {
    row: Row<ItemOrder>;
    accent: string;
}) {
    return (
        <TableRow
            data-index={row.index}
            style={{ borderLeft: `3px solid ${accent}` }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                    )}
                </TableCell>
            ))}
        </TableRow>
    );
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

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t("market.whisper.copied"));
        } catch {
            toast.error(t("market.whisper.copy-failed"));
        }
    }, [t]);

    const columns = useMemo<ColumnDef<ItemOrder>[]>(
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
                                <AvatarImage src={avatarUrl(order.user?.avatar)} alt=""/>
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
                    <span className="flex items-center gap-1 text-sm">
                        <img src="/images/Coupon.png" alt="qty" className="size-4" />
                        {row.original.quantity}
                    </span>
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
                            <TooltipContent className={cn("max-w-sm wrap-break-word")}>
                                {msg}
                            </TooltipContent>
                        </Tooltip>
                    );
                },
            },
        ],
        [t, lang, itemNameZh, itemNameEn, copy],
    );

    // 这些列的数据可能整列缺失：无任何订单含该字段时，隐藏表头与整列
    const columnVisibility = useMemo<Record<string, boolean>>(() => {
        const hasValue = (fn: (o: ItemOrder) => unknown) =>
            sorted.some((o) => {
                const v = fn(o);
                return v != null && v !== "";
            });
        return {
            reputation: hasValue((o) => o.user?.reputation),
            subtype: hasValue((o) => o.subtype),
            rank: hasValue((o) => o.rank),
        };
    }, [sorted]);

    const table = useReactTable({
        data: sorted,
        columns,
        state: { columnVisibility },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowId: (o) => String(o.id),
    });

    const accent = ORDER_TYPES[orderType].accent;
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const rows = table.getRowModel().rows;
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => ROW_ESTIMATE_SIZE,
        overscan: ROW_OVERSCAN,
    });
    const virtualRows = rowVirtualizer.getVirtualItems();
    const topPadding = virtualRows[0]?.start ?? 0;
    const bottomPadding =
        virtualRows.length > 0
            ? rowVirtualizer.getTotalSize() -
              virtualRows[virtualRows.length - 1].end
            : 0;
    const visibleColumnCount = table.getVisibleLeafColumns().length;

    if (isLoading) return <CardSkeleton rows={5} />;
    if (!hasQuery) return <CardEmpty text={t("market.empty.no-query")} />;
    if (sorted.length === 0) return <CardEmpty text={t("market.empty.no-match")} />;

    return (
        <div ref={tableContainerRef} className="h-full overflow-auto rounded-xl border bg-card">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => {
                                const canSort = header.column.getCanSort();
                                const dir = header.column.getIsSorted();
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : canSort ? (
                                            <button
                                                type="button"
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="flex items-center gap-1 select-none hover:text-foreground"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                                {dir === "asc" ? (
                                                    <ArrowUpIcon className="size-3.5" />
                                                ) : dir === "desc" ? (
                                                    <ArrowDownIcon className="size-3.5" />
                                                ) : (
                                                    <ChevronsUpDownIcon className="size-3.5 opacity-50" />
                                                )}
                                            </button>
                                        ) : (
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {topPadding > 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={visibleColumnCount}
                                className="p-0"
                                style={{ height: topPadding }}
                            />
                        </TableRow>
                    )}
                    {virtualRows.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        return (
                            <OrderTableRow
                                key={row.id}
                                row={row}
                                accent={accent}
                            />
                        );
                    })}
                    {bottomPadding > 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={visibleColumnCount}
                                className="p-0"
                                style={{ height: bottomPadding }}
                            />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
