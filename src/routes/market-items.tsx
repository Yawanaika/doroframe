import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { fetchWmItems, fetchItemOrders } from "@/api/wm-item";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";

function ItemList({
    keyword,
    onPick,
    activeUrl,
}: {
    keyword: string;
    onPick: (urlName: string) => void;
    activeUrl: string | null;
}) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["wm", "items"],
        queryFn: fetchWmItems,
        staleTime: 24 * 60 * 60_000,
    });

    const filtered = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        const all = data ?? [];
        if (!kw) return all.slice(0, 500);
        return all
            .filter(
                (i) =>
                    i.nameZh.toLowerCase().includes(kw) ||
                    i.urlName.toLowerCase().includes(kw),
            )
            .slice(0, 500);
    }, [data, keyword]);

    const parentRef = useRef<HTMLDivElement>(null);
    const v = useVirtualizer({
        count: filtered.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 36,
        overscan: 10,
    });

    if (isPending) return <CardSkeleton rows={5} />;
    if (isError) return <CardError message={String(error)} />;
    if (!filtered.length) return <CardEmpty text="无匹配物品" />;

    return (
        <div ref={parentRef} className="h-full overflow-auto rounded border">
            <div
                style={{
                    height: v.getTotalSize(),
                    position: "relative",
                    width: "100%",
                }}
            >
                {v.getVirtualItems().map((vi) => {
                    const it = filtered[vi.index];
                    const active = it.urlName === activeUrl;
                    return (
                        <button
                            key={vi.key}
                            type="button"
                            onClick={() => onPick(it.urlName)}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: 36,
                                transform: `translateY(${vi.start}px)`,
                            }}
                            className={`flex items-center px-3 text-sm hover:bg-muted ${active ? "bg-muted" : ""}`}
                        >
                            <span className="truncate">{it.nameZh}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                                {it.urlName}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function OrdersTable({ urlName }: { urlName: string }) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["wm", "orders", urlName],
        queryFn: () => fetchItemOrders(urlName),
        refetchInterval: 60_000,
        staleTime: 30_000,
    });
    if (isPending) return <CardSkeleton rows={4} />;
    if (isError) return <CardError message={String(error)} />;
    const sells = (data ?? [])
        .filter((o) => o.type === "sell" && o.user.status === "ingame")
        .sort((a, b) => a.platinum - b.platinum)
        .slice(0, 30);
    const buys = (data ?? [])
        .filter((o) => o.type === "buy" && o.user.status === "ingame")
        .sort((a, b) => b.platinum - a.platinum)
        .slice(0, 30);

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">卖单（在线）</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>玩家</TableHead>
                                <TableHead className="text-right">P</TableHead>
                                <TableHead className="text-right">数量</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sells.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell>{o.user.ingameName}</TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {o.platinum}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {o.quantity}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">买单（在线）</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>玩家</TableHead>
                                <TableHead className="text-right">P</TableHead>
                                <TableHead className="text-right">数量</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {buys.map((o) => (
                                <TableRow key={o.id}>
                                    <TableCell>{o.user.ingameName}</TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {o.platinum}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {o.quantity}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export function MarketItemsPage() {
    const [keyword, setKeyword] = useState("");
    const [picked, setPicked] = useState<string | null>(null);
    return (
        <div className="flex h-full flex-col gap-3">
            <div className="flex items-center gap-2">
                <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索物品（中文 / url_name）"
                    className="max-w-xs"
                />
                {picked ? (
                    <Badge variant="secondary">已选 {picked}</Badge>
                ) : null}
            </div>
            <div className="grid flex-1 gap-4 md:grid-cols-[280px_1fr]">
                <div className="h-full min-h-[480px]">
                    <ItemList
                        keyword={keyword}
                        onPick={setPicked}
                        activeUrl={picked}
                    />
                </div>
                <div>
                    {picked ? (
                        <OrdersTable urlName={picked} />
                    ) : (
                        <CardEmpty text="左侧选择一个物品" />
                    )}
                </div>
            </div>
        </div>
    );
}
