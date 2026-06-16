export interface User {
    id?: string;
    ingameName?: string;
    platform: string;
    locale: string;
    region: string;
    crossplay: boolean;
    banned: boolean;
    reputation: number;
    unreadMessages: number;
    background?: string;
    slug?: string;
    avatar?: string;
    status?: string;
    lastSeen?: string;
    activity?: Activity;
    about?: string;
}

interface Activity {
    type: string;
    details?: string;
    startedAt?: string;
}

export function activityFromJson(json: any ) {
    return{
        type: json?.type,
        details: json?.details,
        startedAt: json?.started_at,
    }
}

export function activityToJson(activity: Activity): any {
    return {
        type: activity.type,
        details: activity.details,
        started_at: activity.startedAt,
    }
}

export function userFromJson(json: any): User {
    return {
        ingameName: json?.ingameName ?? json?.ingame_name,
        platform: json.platform,
        locale: json?.locale ?? json?.local,
        region: json.region,
        crossplay: json.crossplay,
        id: json?.id,
        banned: json.banned,
        reputation: json.reputation,
        unreadMessages: json.unread_messages,
        background: json.background,
        slug: json.slug,
        avatar: json?.avatar,
        status: json?.status,
        lastSeen: json?.lastSeen,
        activity: json?.activity ? activityFromJson(json?.activity) : undefined,
        about: json?.about,
    }
}

export function userToJson(user: User): any {
    return {
        ingameName: user.ingameName,
        platform: user.platform,
        locale: user.locale,
        region: user.region,
        crossplay: user.crossplay,
        id: user.id,
        banned: user.banned,
        reputation: user.reputation,
        unreadMessages: user.unreadMessages,
        background: user.background,
        slug: user.slug,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen,
        activity: user.activity ? activityToJson(user.activity): undefined,
        about: user.about,
    }
 }


