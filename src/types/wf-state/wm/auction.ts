export type WmAuctionItemType = "riven" | "kubrow" | "lich";
export type WmAuctionStatus = "open" | "closed" | "expired";

export interface WmAuction {
    id: string;
    itemType: WmAuctionItemType;
    weaponUrlName?: string;
    weaponNameZh?: string;
    startingPrice: number;
    buyoutPrice?: number;
    topBid?: number;
    isDirectSell: boolean;
    status: WmAuctionStatus;
    owner: {
        ingameName: string;
        region: string;
    };
}

export function auctionFromJson(json: any): WmAuction {
    const item = json?.item ?? {};
    return {
        id: json?.id ?? "",
        itemType: (item?.type as WmAuctionItemType) ?? "riven",
        weaponUrlName: item?.weapon_url_name,
        weaponNameZh: item?.weapon_zh_hans_name ?? item?.weapon_en_name,
        startingPrice: json?.starting_price ?? 0,
        buyoutPrice: json?.buyout_price ?? undefined,
        topBid: json?.top_bid ?? undefined,
        isDirectSell: !!json?.is_direct_sell,
        status: (json?.visible === false ? "closed" : "open") as WmAuctionStatus,
        owner: {
            ingameName: json?.owner?.ingame_name ?? "",
            region: json?.owner?.region ?? "",
        },
    };
}
