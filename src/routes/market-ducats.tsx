import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CardError, CardEmpty } from "@/components/card-states";
import { useDucats } from "@/features/market/use-ducats";
import { DucatsTable } from "@/features/market/components/ducats/ducats-table";
import { PeriodToggle } from "@/features/market/components/ducats/period-toggle";

/**
 * 杜卡德效率页：按「杜卡德/白金」比价排行各 Prime 部件，
 * 帮助判断把哪些物品换成杜卡德最划算，并结合成交量衡量流动性。
 */
export function MarketDucatsPage() {
    const { t } = useTranslation();
    const {
        rows,
        period,
        setPeriod,
        sortKey,
        sortDir,
        toggleSort,
        text,
        setText,
        isPending,
        isError,
        error,
        itemsPending,
    } = useDucats();

    return (
        <div className="flex h-full flex-col gap-3">
            <Card className="shrink-0 p-4">
                <div className="flex flex-col gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">
                            {t("market.ducats.title")}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t("market.ducats.desc")}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <PeriodToggle value={period} onChange={setPeriod} />
                        <div className="relative w-full max-w-xs">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t("market.ducats.search")}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="min-h-0 flex-1">
                {isError ? (
                    <CardError message={String(error)} />
                ) : !isPending && rows.length === 0 ? (
                    <CardEmpty text={t("market.ducats.empty")} />
                ) : (
                    <DucatsTable
                        rows={rows}
                        sortKey={sortKey}
                        sortDir={sortDir}
                        onSort={toggleSort}
                        isLoading={isPending || itemsPending}
                    />
                )}
            </div>
        </div>
    );
}
