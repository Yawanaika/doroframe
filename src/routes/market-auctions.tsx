import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuctions, type AuctionSearch } from "@/api/wm-auction";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TYPES: AuctionSearch["type"][] = ["riven", "lich", "kubrow"];
const TYPE_LABEL: Record<AuctionSearch["type"], string> = {
    riven: "紫卡",
    lich: "玄骸",
    kubrow: "兽印",
};

export function MarketAuctionsPage() {
    const [type, setType] = useState<AuctionSearch["type"]>("riven");
    const [weapon, setWeapon] = useState("");
    const { data, isPending, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["wm", "auctions", type, weapon],
        queryFn: () => fetchAuctions({ type, weapon: weapon || undefined }),
        enabled: type === "riven" ? weapon.length > 0 : true,
        staleTime: 30_000,
    });

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                {TYPES.map((t) => (
                    <Button
                        key={t}
                        size="sm"
                        variant={t === type ? "default" : "outline"}
                        onClick={() => setType(t)}
                    >
                        {TYPE_LABEL[t]}
                    </Button>
                ))}
                <Input
                    value={weapon}
                    onChange={(e) => setWeapon(e.target.value)}
                    placeholder="武器 url_name（例：bramma）"
                    className="max-w-xs"
                />
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    {isFetching ? "搜索中…" : "搜索"}
                </Button>
            </div>

            {type === "riven" && !weapon ? (
                <CardEmpty text="请输入武器 url_name 以搜索紫卡" />
            ) : isPending ? (
                <CardSkeleton rows={4} />
            ) : isError ? (
                <CardError message={String(error)} />
            ) : !data?.length ? (
                <CardEmpty text="无符合的拍卖" />
            ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {data.map((a) => (
                        <Card key={a.id}>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    {a.weaponNameZh || a.weaponUrlName || a.itemType}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        起拍
                                    </span>
                                    <Badge variant="outline">
                                        {a.startingPrice} P
                                    </Badge>
                                </div>
                                {a.buyoutPrice ? (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            一口价
                                        </span>
                                        <Badge variant="secondary">
                                            {a.buyoutPrice} P
                                        </Badge>
                                    </div>
                                ) : null}
                                {a.topBid !== undefined ? (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            当前最高
                                        </span>
                                        <span className="tabular-nums">
                                            {a.topBid} P
                                        </span>
                                    </div>
                                ) : null}
                                <div className="text-xs text-muted-foreground">
                                    {a.owner.ingameName} · {a.owner.region}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
