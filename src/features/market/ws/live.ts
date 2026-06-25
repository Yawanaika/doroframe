// WS 事件桥接：监听 Rust 推送的拍卖快照，合并进 React Query 缓存；
// 并按引用计数向 Rust 订阅/退订 auctionId。不含出价。

import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { queryClient } from "@/lib/query-client";
import {
    auctionOrderFromJson,
    type AuctionOrder,
} from "@/types/wf-market/v1/auction/auction-order";

interface WsEvent {
    type?: string;
    // *:SUCCESS 时 payload 为对象（含 auction 快照）；@WS/ERROR 时为字符串
    payload?: { auction?: unknown } | string;
}

// 命中这些缓存前缀（部分匹配带 searchParams/lang/slug 的完整 key）
const QUERY_KEYS = [
    ["market", "auctions"],
    ["market", "auction-participant"],
    ["market", "user-auctions"],
] as const;

let started = false;

/** 安装一次性监听；幂等（HMR/重复调用安全）。 */
export function initAuctionLive(): void {
    if (started) return;
    started = true;
    void listen<WsEvent>("market://ws-event", (e) => onEvent(e.payload));
}

function onEvent(evt: WsEvent): void {
    if (!evt?.type?.endsWith(":SUCCESS")) return;
    const raw = typeof evt.payload === "object" ? evt.payload?.auction : undefined;
    if (!raw) return;
    applyAuctionSnapshot(auctionOrderFromJson(raw));
}

/** 把一份拍卖快照合并进所有相关缓存（WS 广播与出价应答共用）。 */
export function applyAuctionSnapshot(updated: AuctionOrder): void {
    for (const queryKey of QUERY_KEYS) {
        queryClient.setQueriesData<AuctionOrder[]>({ queryKey }, (old) =>
            mergeAuction(old, updated),
        );
    }
}

/** 列表内有同 id 则替换，否则原样返回（阶段一不主动插入新单）。
 * 必须守卫 undefined：setQueriesData 会对未加载的 query 传入 undefined。 */
export function mergeAuction(
    old: AuctionOrder[] | undefined,
    updated: AuctionOrder,
): AuctionOrder[] | undefined {
    if (!old) return old;
    const i = old.findIndex((a) => a.id === updated.id);
    if (i === -1) return old;
    const next = old.slice();
    next[i] = updated;
    return next;
}

// 订阅引用计数：多个列表共享同一 id 时避免误退订
const refcount = new Map<string, number>();

export function subscribeAuction(id: string): void {
    if (!id) return;
    const n = (refcount.get(id) ?? 0) + 1;
    refcount.set(id, n);
    if (n === 1) void invoke("ws_subscribe_auction", { auctionId: id });
}

export function unsubscribeAuction(id: string): void {
    if (!id) return;
    const n = (refcount.get(id) ?? 1) - 1;
    if (n <= 0) {
        refcount.delete(id);
        void invoke("ws_unsubscribe_auction", { auctionId: id });
    } else {
        refcount.set(id, n);
    }
}

/** 重连后重发当前活跃订阅。连接建立前订阅会被 Rust 端丢弃，
 * 故 ws_connect 完成后须调用本函数补订阅（否则要等列表重挂载才恢复 live）。 */
export function resyncSubscriptions(): void {
    for (const id of refcount.keys()) {
        void invoke("ws_subscribe_auction", { auctionId: id });
    }
}
