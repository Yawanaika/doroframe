// 负责解析物品中的i18n字段
export interface I18n {
    en: I18nData
    zhHans?: I18nData
}

interface I18nData {
    name: string;
    icon?: string;
    thumb?: string;
    subIcon?: string;
    description?: string;
}

export function i18nFromJson(json: any): I18n {
    return {
        en: i18nDataFromJson(json?.en),
        zhHans: json?.["zh-hans"]?i18nDataFromJson(json?.["zh-hans"]): undefined,
    }
}

export function i18nToJson(i18n: I18n) {
    return {
        en: i18nDataToJson(i18n.en),
        zhHans:i18n.zhHans ? i18nDataToJson(i18n.zhHans): undefined,
    }
}

function i18nDataFromJson(json: any) {
    return{
        name: json.name,
        icon: json?.icon,
        thumb: json?.thumb,
        subIcon: json?.subIcon,
        description: json?.description,
    }
}

function i18nDataToJson(i18n: I18nData) {
    return {
        name: i18n.name,
        icon: i18n?.icon,
        thumb: i18n?.thumb,
        subIcon: i18n?.subIcon,
        description: i18n?.description,
    }
}