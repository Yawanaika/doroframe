import {asDateMs, Base, parseBase, serializeBase} from "@/types/wf-state/world/base.ts";

export interface PrimeVault extends Base{
    node: string;
    manifest: PrimeItem[];
    evergreenManifest: PrimeItem[];
    schedeleInfo: FeaturedItem[];
}

interface PrimeItem {
    itemType: string;
    primePrice?: number;
    regularPrice?: number;
}

interface FeaturedItem extends Base{
    previewHiddenUtil: number;
    featuredItem?: string;
}

export function primeVaultFromJson(json: any): PrimeVault {
    return {
        ...parseBase(json),
        node: json?.Node ?? "",
        manifest: (json?.Manifest ?? []).map(primeItemFromJson),
        evergreenManifest: (json?.EvergreenManifest ?? []).map(primeItemFromJson),
        schedeleInfo: (json?.ScheduleInfo ?? []).map(featuredItemFromJson),
    };
}

export function primeVaultToJson(p: PrimeVault) {
    return {
        ...serializeBase(p),
        node: p.node,
        manifest: p.manifest.map(primeItemToJson),
        evergreenManifest: p.evergreenManifest.map(primeItemToJson),
        schedeleInfo: p.schedeleInfo.map(featuredItemToJson),
    };
}

function primeItemFromJson(json: any): PrimeItem {
    return {
        itemType: json?.ItemType ?? "",
        primePrice: json?.PrimePrice,
        regularPrice: json?.RegularPrice,
    };
}

function primeItemToJson(i: PrimeItem) {
    return {
        itemType: i.itemType,
        primePrice: i.primePrice,
        regularPrice: i.regularPrice,
    };
}

function featuredItemFromJson(json: any): FeaturedItem {
    return {
       ...parseBase(json),
        previewHiddenUtil: Number(asDateMs(json?.PreviewHiddenUntil) ?? 0),
        featuredItem: json?.FeaturedItem,
    };
}

function featuredItemToJson(f: FeaturedItem) {
    return {
        ...serializeBase(f),
        previewHiddenUtil: f.previewHiddenUtil,
        featuredItem: f.featuredItem,
    };
}
