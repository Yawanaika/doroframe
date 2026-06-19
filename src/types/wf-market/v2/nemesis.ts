import { I18n, i18nFromJson } from "@/types/wf-market/i18n.ts";

/**
 * Lich（赤毒）与 Sister（帕弗斯姐妹）共享同一套数据结构（DE 内部统称 nemesis）。
 * 武器 / 幻纹(ephemera) / 怪癖(quirk) 三类模型形状完全一致，故在此统一定义，
 * 由 API/查询层用不同的函数名区分 lich / sister 两个端点。
 */

/** Lich/Sister 武器，`GET /v2/{lich|sister}/weapons`、`.../weapon/{slug}` */
export interface NemesisWeapon {
    id: string;
    slug: string;
    gameRef: string;
    reqMasteryRank?: number;
    i18n: I18n;
}

export function nemesisWeaponFromJson(json: any): NemesisWeapon {
    return {
        id: json.id,
        slug: json.slug,
        gameRef: json.gameRef,
        reqMasteryRank: json?.reqMasteryRank,
        i18n: i18nFromJson(json.i18n),
    };
}

/** Lich/Sister 幻纹，`GET /v2/{lich|sister}/ephemeras` */
export interface NemesisEphemera {
    id: string;
    slug: string;
    gameRef: string;
    animation?: string;
    element?: string;
    i18n: I18n;
}

export function nemesisEphemeraFromJson(json: any): NemesisEphemera {
    return {
        id: json.id,
        slug: json.slug,
        gameRef: json.gameRef,
        animation: json?.animation,
        element: json?.element,
        i18n: i18nFromJson(json.i18n),
    };
}

/** Lich/Sister 怪癖，`GET /v2/{lich|sister}/quirks` */
export interface NemesisQuirk {
    id: string;
    slug: string;
    group?: string;
    i18n: I18n;
}

export function nemesisQuirkFromJson(json: any): NemesisQuirk {
    return {
        id: json.id,
        slug: json.slug,
        group: json?.group,
        i18n: i18nFromJson(json.i18n),
    };
}
