import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DucatsRow, DucatsSortKey, SortDir } from "@/features/market/use-ducats";

interface Props {
    rows: DucatsRow[];
    sortKey: DucatsSortKey;
    sortDir: SortDir;
    onSort: (key: DucatsSortKey) => void;
    isLoading: boolean;
}

interface Column {
    key: DucatsSortKey;
    labelKey: string;
    /** 数值列右对齐 */
    numeric: boolean;
}

const COLUMNS: Column[] = [
    { key: "efficiency", labelKey: "market.ducats.col.efficiency", numeric: true },
    { key: "ducats", labelKey: "market.ducats.col.ducats", numeric: true },
    { key: "median", labelKey: "market.ducats.col.median", numeric: true },
    { key: "volume", labelKey: "market.ducats.col.volume", numeric: true },
    { key: "platWorth", labelKey: "market.ducats.col.platWorth", numeric: true },
];

const fmt2 = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 2 });
const fmt0 = (n: number) => Math.round(n).toLocaleString();

/** 杜卡德效率排行表：列头可点击排序，效率列（杜卡德/白金）为核心指标。 */
export function DucatsTable({ rows, sortKey, sortDir, onSort, isLoading }: Props) {
    const { t } = useTranslation();

    return (
        <div className="h-full overflow-auto rounded-xl border">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow>
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>{t("market.ducats.col.item")}</TableHead>
                        {COLUMNS.map((col) => {
                            const active = col.key === sortKey;
                            return (
                                <TableHead
                                    key={col.key}
                                    className={cn(
                                        "cursor-pointer select-none whitespace-nowrap",
                                        col.numeric && "text-right",
                                    )}
                                    onClick={() => onSort(col.key)}
                                >
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1",
                                            col.numeric && "flex-row-reverse",
                                            active && "text-foreground font-medium",
                                        )}
                                    >
                                        {t(col.labelKey)}
                                        {active &&
                                            (sortDir === "desc" ? (
                                                <ArrowDown className="size-3.5" />
                                            ) : (
                                                <ArrowUp className="size-3.5" />
                                            ))}
                                    </span>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading
                        ? Array.from({ length: 12 }).map((_, i) => (
                              <TableRow key={i}>
                                  <TableCell colSpan={COLUMNS.length + 2}>
                                      <Skeleton className="h-6 w-full" />
                                  </TableCell>
                              </TableRow>
                          ))
                        : rows.map((row, i) => (
                              <TableRow key={row.id}>
                                  <TableCell className="text-center text-muted-foreground tabular-nums">
                                      {i + 1}
                                  </TableCell>
                                  <TableCell>
                                      <span className="inline-flex items-center gap-2">
                                          {row.icon && (
                                              <img
                                                  src={row.icon}
                                                  alt=""
                                                  loading="lazy"
                                                  className="size-8 shrink-0 rounded object-contain"
                                              />
                                          )}
                                          <span className="truncate">{row.name}</span>
                                      </span>
                                  </TableCell>
                                  <TableCell className="text-right font-medium tabular-nums">
                                      {fmt2(row.ducatsPerPlatinum)}
                                  </TableCell>
                                  <TableCell className="text-right tabular-nums">
                                      {row.ducats}
                                  </TableCell>
                                  <TableCell className="text-right tabular-nums">
                                      {fmt2(row.median)}
                                  </TableCell>
                                  <TableCell className="text-right tabular-nums">
                                      {row.volume}
                                  </TableCell>
                                  <TableCell className="text-right tabular-nums">
                                      {fmt0(row.platWorth)}
                                  </TableCell>
                              </TableRow>
                          ))}
                </TableBody>
            </Table>
        </div>
    );
}
