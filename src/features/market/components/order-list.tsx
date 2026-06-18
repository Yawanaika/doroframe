import { useCallback, useMemo, useRef } from "react";
import { toast } from "sonner";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    type Row,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { ItemOrder } from "@/types/wf-market";
import { useSettingsStore } from "@/store/settings";
import { ORDER_TYPES, type OrderTypeCode } from "@/features/market/constants";
import { sortOrders } from "@/features/market/order-list-utils";
import { useOrderColumns, useColumnVisibility } from "@/features/market/components/order-columns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CardEmpty, CardSkeleton } from "@/components/card-states";

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

function OrderTableRow({ row, accent }: { row: Row<ItemOrder>; accent: string }) {
    return (
        <TableRow
            data-index={row.index}
            // 行首 1px 发丝线标记订单类型（卖绿/买蓝），遵循 DESIGN.md 彩条 ≤1px 规则
            style={{ boxShadow: `inset 1px 0 0 0 ${accent}` }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

    const copy = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text);
                toast.success(t("market.whisper.copied"));
            } catch {
                toast.error(t("market.whisper.copy-failed"));
            }
        },
        [t],
    );

    const columns = useOrderColumns({ t, lang, itemNameZh, itemNameEn, copy });
    const columnVisibility = useColumnVisibility(sorted);

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
        <div
            ref={tableContainerRef}
            className="h-full overflow-auto rounded-xl border bg-card tabular-nums"
        >
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
                        return <OrderTableRow key={row.id} row={row} accent={accent} />;
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
