// 订阅当前列表的拍卖 id，收到 WS 推送时由 live.ts 合并进缓存。列表变化/卸载时退订。

import { useEffect } from "react";
import { subscribeAuction, unsubscribeAuction } from "./live";
import type { AuctionOrder } from "@/types/wf-market";

export function useAuctionLive(auctions: AuctionOrder[]): void {
    // 去重 + 排序后作依赖：仅在 id 集合真正变化时重订阅，
    // 避免轮询返回相同集合但不同顺序时的订阅抖动（unsub 全部 + resub 全部）
    const ids = [...new Set(auctions.map((a) => a.id))].sort().join(",");
    useEffect(() => {
        const list = ids ? ids.split(",") : [];
        list.forEach(subscribeAuction);
        return () => list.forEach(unsubscribeAuction);
    }, [ids]);
}
