import { I18n, i18nFromJson } from "@/types/wf-market/i18n.ts";

/** 紫卡（裂罅）武器，`GET /v2/riven/weapons`、`GET /v2/riven/weapon/{slug}` */
export interface Riven {
    id: string;
    slug: string;
    gameRef: string;
    group?: string;
    /** kitgun | melee | pistol | rifle | shotgun | zaw（可能新增） */
    rivenType?: string;
    disposition?: number;
    reqMasteryRank?: number;
    i18n: I18n;
}

export function rivenFromJson(json: any): Riven {
    return {
        id: json.id,
        slug: json.slug,
        gameRef: json.gameRef,
        group: json?.group,
        rivenType: json?.rivenType,
        disposition: json?.disposition,
        reqMasteryRank: json?.reqMasteryRank,
        i18n: i18nFromJson(json.i18n),
    };
}

/** 紫卡词条，`GET /v2/riven/attributes` */
export interface RivenAttribute {
    id: string;
    slug: string;
    gameRef: string;
    group?: string;
    prefix?: string;
    suffix?: string;
    /** 仅适用于这些 rivenType */
    exclusiveTo?: string[];
    positiveIsNegative?: boolean;
    unit?: string;
    positiveOnly?: boolean;
    negativeOnly?: boolean;
    i18n: I18n;
}

export function rivenAttributeFromJson(json: any): RivenAttribute {
    return {
        id: json.id,
        slug: json.slug,
        gameRef: json.gameRef,
        group: json?.group,
        prefix: json?.prefix,
        suffix: json?.suffix,
        exclusiveTo: json?.exclusiveTo ?? [],
        positiveIsNegative: json?.positiveIsNegative,
        unit: json?.unit,
        positiveOnly: json?.positiveOnly,
        negativeOnly: json?.negativeOnly,
        i18n: i18nFromJson(json.i18n),
    };
}
