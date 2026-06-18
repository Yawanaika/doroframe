import {ItemOrder, itemOrderFromJson, itemOrderToJson} from "@/types/wf-market";

export interface TopOrders {
    sell: ItemOrder[];
    buy: ItemOrder[];
}

export function topOrdersFromJson(json: any): TopOrders {
    return {
        sell: (json?.sell ?? []).map(itemOrderFromJson),
        buy: (json?.buy ?? []).map(itemOrderFromJson),
    }
}

export function topOrdersToJson(topOrders: TopOrders) {
    return {
        sell: topOrders.sell.map(itemOrderToJson),
        buy: topOrders.buy.map(itemOrderToJson),
    }
}
