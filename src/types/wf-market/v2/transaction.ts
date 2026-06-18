import {User, userFromJson, userToJson} from "@/types/wf-market";

export interface Transaction {
    id: string;
    type: string;
    originId: string;
    platinum: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    item: Item;
    user?: User;
}

interface Item{
    id: string;
}

export function transactionFromJson(json: any): Transaction {
    return {
        id: json.id,
        type: json.type,
        originId: json.originId,
        platinum: json.platinum,
        quantity: json.quantity,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
        item: itemFromJson(json.item),
        user: json.user? userFromJson(json.user): undefined,
    }
}

export function transactionToJson(transaction: Transaction): any {
    return {
        id: transaction.id,
        type: transaction.type,
        originId: transaction.originId,
        platinum: transaction.platinum,
        quantity: transaction.quantity,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        item: itemToJson(transaction.item),
        user: transaction.user? userToJson(transaction.user): undefined,
    }
}

function itemFromJson(json: any): Item {
    return {
        id: json.id,
    }
}

function itemToJson(item: Item): any {
    return {
        id: item.id,
    }
}