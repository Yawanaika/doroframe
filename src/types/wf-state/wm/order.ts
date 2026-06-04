export type WmOrderType = "buy" | "sell";
export type WmUserStatus = "ingame" | "online" | "offline";

export interface WmOrder {
    id: string;
    itemId: string;
    itemUrlName: string;
    itemNameZh: string;
    platinum: number;
    quantity: number;
    type: WmOrderType;
    rank?: number;
    user: {
        ingameName: string;
        status: WmUserStatus;
        avatar?: string;
        region: string;
    };
}

export function orderFromJson(json: any): WmOrder {
    const item = json?.item ?? {};
    const i18n = item?.zh_hans ?? item?.["zh-hans"] ?? item?.en ?? {};
    return {
        id: json?.id ?? "",
        itemId: item?.id ?? "",
        itemUrlName: item?.url_name ?? "",
        itemNameZh: i18n?.item_name ?? item?.url_name ?? "",
        platinum: json?.platinum ?? 0,
        quantity: json?.quantity ?? 0,
        type: json?.order_type === "buy" ? "buy" : "sell",
        rank: json?.mod_rank ?? json?.rank,
        user: {
            ingameName: json?.user?.ingame_name ?? "",
            status: (json?.user?.status as WmUserStatus) ?? "offline",
            avatar: json?.user?.avatar ?? undefined,
            region: json?.user?.region ?? "",
        },
    };
}

export interface WmItemSummary {
    id: string;
    urlName: string;
    nameZh: string;
    thumb?: string;
}

export function itemSummaryFromJson(json: any): WmItemSummary {
    const i18n = json?.i18n?.["zh-hans"] ?? json?.i18n?.en ?? {};
    return {
        id: json?.id ?? "",
        urlName: json?.url_name ?? json?.slug ?? "",
        nameZh: i18n?.name ?? json?.item_name ?? json?.url_name ?? "",
        thumb: json?.thumb,
    };
}
