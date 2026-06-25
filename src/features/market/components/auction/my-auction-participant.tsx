// 我参与的竞拍（participant 视角）：拉取当前用户参与出价的拍卖，复用 AuctionList 只读展示。

import { useTranslation } from "react-i18next";
import { useMyAuctionParticipantQuery } from "@/features/market/queries";
import { AuctionList } from "@/features/market/components/auction/auction-list";

export function MyAuctionParticipant() {
    const { t } = useTranslation();
    const participantQ = useMyAuctionParticipantQuery();

    return (
        <AuctionList
            auctions={participantQ.data ?? []}
            isLoading={participantQ.isPending}
            isSearching={false}
            emptyText={t("market.me.bids.empty")}
        />
    );
}
