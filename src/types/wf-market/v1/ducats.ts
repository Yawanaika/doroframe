// 杜卡德效率统计（GET /v1/tools/ducats）。previous_hour / previous_day 两个时段，
// 每项对应一个物品（item 为物品 id），含杜卡德/白金比价与行情统计。

/** 单个物品在某时段的杜卡德效率统计。 */
export interface DucatStat {
    /** 物品 id */
    item: string;
    datetime: string;
    positionChangeMonth: number;
    positionChangeWeek: number;
    positionChangeDay: number;
    /** 该物品白金总价值（volume × 价格） */
    platWorth: number;
    volume: number;
    /** 杜卡德/白金（中位价） */
    ducatsPerPlatinum: number;
    /** 杜卡德/白金（加权均价） */
    ducatsPerPlatinumWa: number;
    ducats: number;
    median: number;
    waPrice: number;
    id: string;
}

export interface DucatsStats {
    previousHour: DucatStat[];
    previousDay: DucatStat[];
}

function ducatStatFromJson(json: any): DucatStat {
    return {
        item: json.item,
        datetime: json.datetime,
        positionChangeMonth: json.position_change_month,
        positionChangeWeek: json.position_change_week,
        positionChangeDay: json.position_change_day,
        platWorth: json.plat_worth,
        volume: json.volume,
        ducatsPerPlatinum: json.ducats_per_platinum,
        ducatsPerPlatinumWa: json.ducats_per_platinum_wa,
        ducats: json.ducats,
        median: json.median,
        waPrice: json.wa_price,
        id: json.id,
    };
}

export function ducatsStatsFromJson(json: any): DucatsStats {
    return {
        previousHour: (json?.previous_hour ?? []).map(ducatStatFromJson),
        previousDay: (json?.previous_day ?? []).map(ducatStatFromJson),
    };
}
