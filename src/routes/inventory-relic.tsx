import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    ERAS,
    listRelicViews,
    type RelicView,
} from "@/features/inventory/relic/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const RARITY_COLOR: Record<string, string> = {
    COMMON: "bg-amber-700/30 text-amber-200",
    UNCOMMON: "bg-zinc-400/30 text-zinc-100",
    RARE: "bg-yellow-500/30 text-yellow-100",
    LEGENDARY: "bg-purple-500/30 text-purple-100",
};

function RelicCard({ relic, onClick }: { relic: RelicView; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-left transition hover:scale-[1.01]"
        >
            <Card className="h-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{relic.nameZh}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-1">
                    <div>{relic.drops.length} 件奖励</div>
                    <div className="flex flex-wrap gap-1">
                        {[...new Set(relic.drops.map((d) => d.rarity))].map((r) =>
                            r ? (
                                <Badge
                                    key={r}
                                    className={RARITY_COLOR[r] ?? ""}
                                    variant="secondary"
                                >
                                    {r}
                                </Badge>
                            ) : null,
                        )}
                    </div>
                </CardContent>
            </Card>
        </button>
    );
}

const COLUMNS = 4;
const ROW_HEIGHT = 140;

export function RelicPage() {
    const all = useMemo(() => listRelicViews(), []);
    const [era, setEra] = useState<(typeof ERAS)[number]>("全部");
    const [keyword, setKeyword] = useState("");
    const [active, setActive] = useState<RelicView | null>(null);

    const filtered = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        return all.filter((r) => {
            if (era !== "全部" && r.era !== era) return false;
            if (!kw) return true;
            if (r.nameZh.toLowerCase().includes(kw)) return true;
            return r.drops.some((d) => d.nameZh.toLowerCase().includes(kw));
        });
    }, [all, era, keyword]);

    const rows = Math.ceil(filtered.length / COLUMNS);
    const parentRef = useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: rows,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 4,
    });

    return (
        <div className="flex h-full flex-col gap-3">
            <div className="flex items-center gap-2">
                <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索遗物或掉落物"
                    className="max-w-xs"
                />
                <div className="flex gap-1">
                    {ERAS.map((e) => (
                        <Button
                            key={e}
                            size="sm"
                            variant={e === era ? "default" : "outline"}
                            onClick={() => setEra(e)}
                        >
                            {e}
                        </Button>
                    ))}
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                    {filtered.length} / {all.length}
                </span>
            </div>

            <div
                ref={parentRef}
                className="relative flex-1 overflow-auto rounded-xl border"
            >
                <div
                    style={{
                        height: rowVirtualizer.getTotalSize(),
                        position: "relative",
                        width: "100%",
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((vRow) => {
                        const start = vRow.index * COLUMNS;
                        const items = filtered.slice(start, start + COLUMNS);
                        return (
                            <div
                                key={vRow.key}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: ROW_HEIGHT,
                                    transform: `translateY(${vRow.start}px)`,
                                }}
                                className="grid grid-cols-4 gap-3 p-3"
                            >
                                {items.map((r) => (
                                    <RelicCard
                                        key={r.uniqueName}
                                        relic={r}
                                        onClick={() => setActive(r)}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
                <SheetContent side="right" className="w-[420px] sm:w-[460px]">
                    <SheetHeader>
                        <SheetTitle>{active?.nameZh}</SheetTitle>
                        <SheetDescription>
                            {active?.quality} · {active?.drops.length} 件奖励
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 space-y-1.5 text-sm">
                        {active?.drops.map((d, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between rounded border px-2 py-1.5"
                            >
                                <span className="truncate pr-2">{d.nameZh}</span>
                                <span className="flex items-center gap-2 text-xs">
                                    {d.rarity ? (
                                        <Badge
                                            className={RARITY_COLOR[d.rarity] ?? ""}
                                            variant="secondary"
                                        >
                                            {d.rarity}
                                        </Badge>
                                    ) : null}
                                    <span className="tabular-nums text-muted-foreground">
                                        {(d.chance * 100).toFixed(2)}%
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
