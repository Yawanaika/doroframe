import {User, userFromJson, userToJson} from "@/types/wf-market/v1/user.ts";

export interface ItemOrder {
    id: string;
    type: string;
    platinum: number;
    quantity: number;
    perTrade?: number;
    rank?: number;
    charges?: number;
    subtype?: string;
    amberStars?: number;
    cyanStars?: number;
    visible?: boolean;
    createdAt?: string;
    updatedAt?: string;
    itemId?: string;
    group?: string;
    user?: User;
}

export function itemOrderFromJson(json: any): ItemOrder {
    return {
        id: json.id,
        type: json.type,
        platinum: json.platinum,
        quantity: json.quantity,
        perTrade: json?.perTrade,
        rank: json?.rank,
        charges: json?.charges,
        subtype: json?.subtype,
        amberStars: json?.amberStars,
        cyanStars: json?.cyanStars,
        visible: json?.visible,
        createdAt: json?.createdAt,
        updatedAt: json?.updatedAt,
        itemId: json?.itemId,
        group: json?.group,
        user: json?.user ? userFromJson(json.user) : undefined,
    }
}

export function itemOrderToJson(itemOrder: ItemOrder): any {
    return {
        id: itemOrder.id,
        type: itemOrder.type,
        platinum: itemOrder.platinum,
        quantity: itemOrder.quantity,
        perTrade: itemOrder.perTrade,
        rank: itemOrder.rank,
        charges: itemOrder.charges,
        subtype: itemOrder.subtype,
        amberStars: itemOrder.amberStars,
        cyanStars: itemOrder.cyanStars,
        visible: itemOrder.visible,
        createdAt: itemOrder.createdAt,
        updatedAt: itemOrder.updatedAt,
        itemId: itemOrder.itemId,
        group: itemOrder.group,
        user: itemOrder.user ? userToJson(itemOrder.user) : undefined,
    }
 }