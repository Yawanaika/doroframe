export interface WmProfile {
    ingameName: string;
    slug: string;
    avatar?: string;
    region: string;
    reputation: number;
    platinum: number;
}

export function profileFromJson(json: any): WmProfile {
    const user = json?.user ?? json;
    return {
        ingameName: user?.ingame_name ?? "",
        slug: user?.slug ?? "",
        avatar: user?.avatar,
        region: user?.region ?? "",
        reputation: user?.reputation ?? 0,
        platinum: user?.platinum ?? 0,
    };
}
