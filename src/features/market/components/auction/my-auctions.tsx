// 我的拍卖（owner 视角）：拉取当前用户上架的拍卖，复用 AuctionList 只读展示。

import { useTranslation } from "react-i18next";
import { useUserAuctionsQuery } from "@/features/market/queries";
import { AuctionList } from "@/features/market/components/auction/auction-list";

export function MyAuctions({ slug }: { slug: string | undefined }) {
    const { t } = useTranslation();
    const auctionsQ = useUserAuctionsQuery(slug);

    return (
        <AuctionList
            auctions={auctionsQ.data ?? []}
            isLoading={auctionsQ.isPending}
            isSearching={false}
            emptyText={t("market.me.auctions.empty")}
        />
    );
}
