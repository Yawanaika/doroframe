// 出价（阶段二）：bid_id 生成、我的出价内存存储、从 REST bids 解析我的出价。
// bid_id 客户端持有——首次出价用新 id，加价/撤价复用同一 id（同 id = 编辑，新 id = 新建）。

import { fetchAuctionBids, type AuctionBidLite } from "@/api/market";

export interface MyBid {
    bidId: string;
    value: number;
}

// auctionId → 我的出价。SET 成功 / ensureMyBid 解析后写入。
const myBidByAuction = new Map<string, MyBid>();

export function myBidOf(auctionId: string): MyBid | undefined {
    return myBidByAuction.get(auctionId);
}

export function setMyBid(auctionId: string, bid: MyBid): void {
    myBidByAuction.set(auctionId, bid);
}

export function clearMyBid(auctionId: string): void {
    myBidByAuction.delete(auctionId);
}

/** 24 位 alnum，对齐 Flutter（规避 crypto.randomUUID 在旧 WebKitGTK 缺失 + 连字符未验证）。 */
export function genBidId(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    let s = "";
    for (const b of bytes) s += chars[b % 36];
    return s;
}

/** 选我最新一条出价（按 updated 时间）。 */
export function pickMyLatestBid(
    bids: AuctionBidLite[],
    myId: string,
): AuctionBidLite | undefined {
    let latest: AuctionBidLite | undefined;
    for (const b of bids) {
        if (b.userId !== myId) continue;
        if (!latest || b.updated > latest.updated) latest = b;
    }
    return latest;
}

/** 确保内存里有我在该拍卖的出价；无则拉 REST 解析并缓存。返回 bidId（无出价则 undefined）。 */
export async function ensureMyBid(
    auctionId: string,
    myId: string,
    token: string | null,
    lang: "zh" | "en",
): Promise<string | undefined> {
    const cached = myBidByAuction.get(auctionId);
    if (cached) return cached.bidId;
    const bids = await fetchAuctionBids(auctionId, token, lang);
    const mine = pickMyLatestBid(bids, myId);
    if (!mine) return undefined;
    myBidByAuction.set(auctionId, { bidId: mine.id, value: mine.value });
    return mine.id;
}
