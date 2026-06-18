import {I18n, i18nFromJson, i18nToJson} from "@/types/wf-market/i18n.ts";

export interface Item {
    id: string;
    slug: string;
    gameRef: string;
    tags: string[];
    setRoot?: boolean;
    setParts?: string[];
    quantityInSet?: number;
    rarity?: string;
    bulkTradable?: number;
    subtypes?: string[];
    maxRank?: number;
    maxCharges?: number;
    maxAmberStars?: number;
    maxCyanStars?: number;
    endoMultiplier?: number;
    ducats?: number;
    vosfor?: number;
    reqMasteryRank?: number;
    vaulted?: boolean;
    tradingTax?: number;
    tradable?: boolean;
    i18n: I18n;
}

export function itemFromJson(json: any): Item {
    return {
        id: json.id,
        slug: json.slug,
        gameRef: json.gameRef,
        tags: json.tags,
        setRoot: json?.setRoot,
        setParts: json?.setParts ?? [],
        quantityInSet: json?.quantityInSet,
        rarity: json?.rarity,
        bulkTradable: json?.bulkTradable,
        subtypes: json?.subtypes ?? [],
        maxRank: json?.maxRank,
        maxCharges: json?.maxCharges,
        maxAmberStars: json?.maxAmberStars,
        maxCyanStars: json?.maxCyanStars,
        endoMultiplier: json?.endoMultiplier,
        ducats: json?.ducats,
        vosfor: json?.vosfor,
        reqMasteryRank: json?.reqMasteryRank,
        vaulted: json?.vaulted,
        tradingTax: json?.tradingTax,
        tradable: json?.tradable,
        i18n: i18nFromJson(json.i18n),
    }
}

export function itemToJson(item: Item): any {
    return {
        id: item.id,
        slug: item.slug,
        gameRef: item.gameRef,
        tags: item.tags,
        setRoot: item.setRoot,
        setParts: item.setParts,
        quantityInSet: item.quantityInSet,
        rarity: item.rarity,
        bulkTradable: item.bulkTradable,
        subtypes: item.subtypes,
        maxRank: item.maxRank,
        maxCharges: item.maxCharges,
        maxAmberStars: item.maxAmberStars,
        maxCyanStars: item.maxCyanStars,
        endoMultiplier: item.endoMultiplier,
        ducats: item.ducats,
        vosfor: item.vosfor,
        reqMasteryRank: item.reqMasteryRank,
        vaulted: item.vaulted,
        tradingTax: item.tradingTax,
        tradable: item.tradable,
        i18n: item.i18n? i18nToJson(item.i18n): undefined,
    }
}