// 拍卖订单（v1）。
// owner 在拍卖列表中返回为完整 user 对象，在个人拍卖订单列表中返回为字符串 User.id。
// 当 owner 为字符串时解析为仅含 id 的 User（其余字段 undefined）——保留 id 以便
// 判定订单归属（如出价区 owner.id !== 我），同时 ingameName 缺失自然隐藏卖家信息。

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

/** owner 可能是完整对象或字符串 User.id；字符串时仅保留 id。 */
function ownerFromJson(owner: any): User {
    return typeof owner === "string" ? ({ id: owner } as User) : userFromJson(owner);
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
        owner: ownerFromJson(json.owner),
        item: auctionOrderItemFromJson(json.item),
    };
}
