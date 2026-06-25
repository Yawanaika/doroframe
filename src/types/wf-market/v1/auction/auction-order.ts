// 拍卖订单（v1）。owner 为完整 user 对象（本轮只读 REST，不处理 WS 的 string id 形态）。

import type { User } from "@/types/wf-market/v1/user";
import { userFromJson } from "@/types/wf-market/v1/user";
import {
    type AuctionOrderItem,
    auctionOrderItemFromJson,
} from "@/types/wf-market";

export interface AuctionOrder {
    id: string;
    startingPrice: number;
    minimalReputation: number;
    buyoutPrice?: number;
    visible: boolean;
    note: string;
    platform: string;
    closed: boolean;
    /** 当前最高竞标价（无人竞标为 null） */
    topBid?: number;
    isMarkedFor?: string;
    markedOperationAt?: string;
    created: string;
    updated: string;
    noteRaw: string;
    /** true=一口价直售，false=竞拍 */
    isDirectSell: boolean;
    crossplay: boolean;
    winner?: string;
    private: boolean;
    /** 订单所有者 在获取个人拍卖订单接口中，返回的是User.id*/
    owner: User;
    item: AuctionOrderItem;
}

export function auctionOrderFromJson(json: any): AuctionOrder {
    return {
        id: json.id,
        startingPrice: json.starting_price,
        minimalReputation: json.minimal_reputation,
        buyoutPrice: json?.buyout_price ?? undefined,
        visible: json.visible,
        note: json?.note ?? "",
        platform: json.platform,
        closed: json.closed,
        topBid: json?.top_bid ?? undefined,
        isMarkedFor: json?.is_marked_for ?? undefined,
        markedOperationAt: json?.marked_operation_at ?? undefined,
        created: json.created,
        updated: json.updated,
        noteRaw: json?.note_raw ?? "",
        isDirectSell: json.is_direct_sell,
        crossplay: json?.crossplay ?? false,
        winner: json?.winner ?? undefined,
        private: json?.private ?? false,
        owner: userFromJson(json.owner),
        item: auctionOrderItemFromJson(json.item),
    };
}
