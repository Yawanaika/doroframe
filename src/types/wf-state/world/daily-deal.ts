import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface DailyDeal extends Base {
    storeItem: string;
    discount: number;
    originalPrice: number;
    salePrice: number;
    amountTotal: number;
    amountSold: number;
}

export function dailyDealFromJson(json: any): DailyDeal {
    return {
        ...parseBase(json),
        storeItem: json?.StoreItem ?? "",
        discount: json?.Discount ?? 0,
        originalPrice: json?.OriginalPrice ?? 0,
        salePrice: json?.SalePrice ?? 0,
        amountTotal: json?.AmountTotal ?? 0,
        amountSold: json?.AmountSold ?? 0,
    };
}

export function dailyDealToJson(d: DailyDeal) {
    return {
        ...serializeBase(d),
        storeItem: d.storeItem,
        discount: d.discount,
        originalPrice: d.originalPrice,
        salePrice: d.salePrice,
        amountTotal: d.amountTotal,
        amountSold: d.amountSold,
    };
}
