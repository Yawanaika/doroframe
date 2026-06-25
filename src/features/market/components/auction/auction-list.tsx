// 拍卖列表：loading / empty / 列表三态。按卖家在线状态排序（游戏中 > 在线 > 离线）。

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {CardEmpty, CardSkeleton} from "@/components/card-states";
import { statusOf } from "@/features/market/constants";
import { useAuctionSearchData } from "@/features/market/use-auction-search-data";
import { AuctionCard } from "@/features/market/components/auction/auction-card";
import { useAuctionLive } from "@/features/market/ws/use-auction-live";
import type { AuctionOrder } from "@/types/wf-market";

interface Props {
    auctions: AuctionOrder[];
    isLoading: boolean;
    isSearching: boolean;
    /** 自定义空态文案；传入时覆盖默认的 auction.empty.* */
    emptyText?: string;
}

export function AuctionList({ auctions, isLoading, isSearching, emptyText }: Props) {
    const { t } = useTranslation();
    const data = useAuctionSearchData();
    useAuctionLive(auctions); // 订阅当前列表 id，WS 推送实时合并进缓存

    const sorted = useMemo(
        () =>
            [...auctions].sort(
                (a, b) =>
                    statusOf(b.owner.status).sort - statusOf(a.owner.status).sort,
            ),
        [auctions],
    );

    if (isLoading && auctions.length === 0) {
        return <CardSkeleton rows={5} />;
    }

    if (sorted.length === 0) {
        return (
            <CardEmpty
                text={
                    emptyText ??
                    (isSearching
                        ? t("auction.empty.no-match")
                        : t("auction.empty.no-data"))
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
