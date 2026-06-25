// 订阅当前列表的拍卖 id，收到 WS 推送时由 live.ts 合并进缓存。列表变化/卸载时退订。

import { useEffect } from "react";
import { subscribeAuction, unsubscribeAuction } from "./live";
import type { AuctionOrder } from "@/types/wf-market";

export function useAuctionLive(auctions: AuctionOrder[]): void {
    // 用 id 串作依赖，避免每次新数组引用触发重订阅
    const ids = auctions.map((a) => a.id).join(",");
    useEffect(() => {
        const list = ids ? ids.split(",") : [];
        list.forEach(subscribeAuction);
        return () => list.forEach(unsubscribeAuction);
    }, [ids]);
}
