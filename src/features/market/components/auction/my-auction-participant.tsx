// 我参与的竞拍（participant 视角）：拉取当前用户参与出价的拍卖，复用 AuctionList 只读展示。
// 进入时预热每条的「我的出价」，使卡片即时显示我的出价（对齐 Flutter _warmUpMyBidsAtStartup）。

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMyAuctionParticipantQuery } from "@/features/market/queries";
import { useSettingsStore } from "@/store/settings";
import { useAuthStore } from "@/store/auth";
import { ensureMyBid } from "@/features/market/ws/bids";
import { AuctionList } from "@/features/market/components/auction/auction-list";

export function MyAuctionParticipant() {
    const { t } = useTranslation();
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const myId = useAuthStore((s) => s.user?.id);
    const participantQ = useMyAuctionParticipantQuery();

    // 参与列表通常很小：逐条解析我的出价写入 store（ensureMyBid 内部已去重缓存）
    const ids = (participantQ.data ?? []).map((a) => a.id).join(",");
    useEffect(() => {
        if (!myId || !ids) return;
        for (const id of ids.split(",")) {
            void ensureMyBid(id, myId, token, lang);
        }
    }, [ids, myId, token, lang]);

    return (
        <AuctionList
            auctions={participantQ.data ?? []}
            isLoading={participantQ.isPending}
            isSearching={false}
            emptyText={t("market.me.bids.empty")}
        />
    );
}
