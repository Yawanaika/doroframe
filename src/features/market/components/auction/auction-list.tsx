// 拍卖列表：loading / empty / 列表三态。按卖家在线状态排序（游戏中 > 在线 > 离线）。

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { CardEmpty } from "@/components/card-states";
import { statusOf } from "@/features/market/constants";
import { useAuctionSearchData } from "@/features/market/use-auction-search-data";
import { AuctionCard } from "@/features/market/components/auction/auction-card";
import type { AuctionOrder } from "@/types/wf-market";

interface Props {
    auctions: AuctionOrder[];
    isLoading: boolean;
    isSearching: boolean;
}

export function AuctionList({ auctions, isLoading, isSearching }: Props) {
    const { t } = useTranslation();
    const data = useAuctionSearchData();

    const sorted = useMemo(
        () =>
            [...auctions].sort(
                (a, b) =>
                    statusOf(b.owner.status).sort - statusOf(a.owner.status).sort,
            ),
        [auctions],
    );

    if (isLoading && auctions.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (sorted.length === 0) {
        return (
            <CardEmpty
                text={
                    isSearching
                        ? t("auction.empty.no-match")
                        : t("auction.empty.no-data")
                }
            />
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {sorted.map((ao) => (
                <AuctionCard key={ao.id} ao={ao} data={data} />
            ))}
        </div>
    );
}
