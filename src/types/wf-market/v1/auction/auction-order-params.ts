// 创建拍卖请求体（v1）。toJson 输出 snake_case，含嵌套 item。
// direct 策略时 buyout_price = starting_price（由调用方在构造时设定）。

import {
    type AuctionOrderItem,
    auctionOrderItemToJson,
} from "@/types/wf-market";

export interface AuctionOrderParams {
    visible: boolean;
    startingPrice?: number;
    buyoutPrice?: number;
    minimalReputation?: number;
    note?: string;
    item: AuctionOrderItem;
}

export function auctionOrderParamsToJson(p: AuctionOrderParams): any {
    return {
        visible: p.visible,
        starting_price: p.startingPrice,
        buyout_price: p.buyoutPrice,
        minimal_reputation: p.minimalReputation,
        note: p.note,
        item: auctionOrderItemToJson(p.item),
    };
}
