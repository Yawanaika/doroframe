import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface VoidTrader extends Base {
    charater: string;
    node: string;
    manifest?: VtItem[];
}

interface VtItem {
    itemType: string;
    primePrice: number;
    regularPrice: number;
    limit?: number;
}

export function voidTraderFromJson(json: any): VoidTrader {
    return {
        ...parseBase(json),
        charater: json?.Character ?? "",
        node: json?.Node ?? "",
        manifest: json?.Manifest ? json.Manifest.map(vtItemFromJson) : undefined,
    };
}

export function voidTraderToJson(t: VoidTrader) {
    return {
        ...serializeBase(t),
        charater: t.charater,
        node: t.node,
        manifest: t.manifest ? t.manifest.map(vtItemToJson) : undefined,
    };
}

function vtItemFromJson(json: any): VtItem {
    return {
        itemType: json?.ItemType ?? "",
        primePrice: json?.PrimePrice ?? 0,
        regularPrice: json?.RegularPrice ?? 0,
        limit: json?.Limit ?? 0,
    };
}

function vtItemToJson(i: VtItem) {
    return {
        itemType: i.itemType,
        primePrice: i.primePrice,
        regularPrice: i.regularPrice,
        limit: i.limit,
    };
}
