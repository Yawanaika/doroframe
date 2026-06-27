// 出价（阶段二）：bid_id 生成、我的出价内存存储、从 REST bids 解析我的出价。
// bid_id 客户端持有——首次出价用新 id，加价/撤价复用同一 id（同 id = 编辑，新 id = 新建）。

import { create } from "zustand";
import {
    fetchAuctionBids,
    fetchMyAuctionParticipant,
    type AuctionBidLite,
} from "@/api/market";
import { applyAuctionSnapshot } from "@/features/market/ws/live";

export interface MyBid {
    bidId: string;
    value: number;
}

// auctionId → 我的出价。响应式 store：SET 成功 / ensureMyBid 解析后写入，
// 组件订阅后出价/撤价即时刷新（不再依赖列表缓存的隐式重渲染）。
interface MyBidState {
    bids: Record<string, MyBid>;
}

export const useMyBidStore = create<MyBidState>(() => ({ bids: {} }));

/** 组件外读取（mutations / ensureMyBid 用）；组件内请用 useMyBidStore selector。 */
export function myBidOf(auctionId: string): MyBid | undefined {
    return useMyBidStore.getState().bids[auctionId];
}

export function setMyBid(auctionId: string, bid: MyBid): void {
    useMyBidStore.setState((s) => ({ bids: { ...s.bids, [auctionId]: bid } }));
}

export function clearMyBid(auctionId: string): void {
    useMyBidStore.setState((s) => {
        if (!(auctionId in s.bids)) return s;
        const next = { ...s.bids };
        delete next[auctionId];
        return { bids: next };
    });
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
    const cached = myBidOf(auctionId);
    if (cached) return cached.bidId;
    const { bids, auction } = await fetchAuctionBids(auctionId, token, lang);
    // 用同一响应里的新鲜拍卖刷新缓存的 topBid，使卡片「我的出价 vs 最高价」对比准确
    if (auction) applyAuctionSnapshot(auction);
    const mine = pickMyLatestBid(bids, myId);
    if (!mine) return undefined;
    setMyBid(auctionId, { bidId: mine.id, value: mine.value });
    return mine.id;
}

let prewarmed = false;
// 预热代际：登出/重置时自增，使在途预热的写入失效，避免上个账号的出价回填已清空的 store
let prewarmGen = 0;

/** 登录后全局预热「我参与的竞拍」出价：拉我参与的拍卖，逐条解析我的出价写入 store，
 * 使任意列表（大厅 / 搜索 / 我的竞拍）都能即时显示「我的出价」并正确对比最高价，
 * 而不只是打开「我的竞拍」标签时才加载。幂等：成功一次后不再重复（出价/撤价走 store 增量更新）。 */
export async function prewarmMyBids(
    token: string | null,
    myId: string | undefined,
    lang: "zh" | "en",
): Promise<void> {
    if (!token || !myId || prewarmed) return;
    prewarmed = true;
    const gen = ++prewarmGen;
    try {
        const auctions = await fetchMyAuctionParticipant(token, lang);
        await Promise.all(
            auctions.map((a) =>
                ensureMyBid(a.id, myId, token, lang).catch(() => undefined),
            ),
        );
        // 期间发生过登出/重置：在途写入可能已回填，再清一次以丢弃旧账号数据
        if (gen !== prewarmGen) useMyBidStore.setState({ bids: {} });
    } catch {
        prewarmed = false; // 失败可重试（如刚登录 token 未就位）
    }
}

/** 登出时重置预热标记，下次登录重新预热；自增代际作废在途预热。 */
export function resetMyBidPrewarm(): void {
    prewarmGen++;
    prewarmed = false;
    useMyBidStore.setState({ bids: {} });
}
