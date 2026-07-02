import { useMemo, useState } from "react";
import { useSettingsStore } from "@/store/settings";
import { useDucatsQuery, useMarketItemsQuery } from "@/features/market/queries";
import { itemDisplayName, itemIconUrl } from "@/features/market/assets";
import type { DucatStat, Item } from "@/types/wf-market";

/** 统计时段：上一小时 / 上一天 */
export type DucatsPeriod = "previousHour" | "previousDay";

/** 可排序列。efficiency 即杜卡德/白金比价（换杜卡德的划算程度）。 */
export type DucatsSortKey =
    | "efficiency"
    | "ducats"
    | "median"
    | "volume"
    | "platWorth";

export type SortDir = "asc" | "desc";

/** 表格行：统计数据叠加物品展示信息（名称 / 图标 / slug）。 */
export interface DucatsRow extends DucatStat {
    /** 本地化展示名，物品清单缺失时回退为 item id */
    name: string;
    /** 图标 URL，可能为空串 */
    icon: string;
    /** 物品 slug，用于跳转订单页；清单缺失时为 undefined */
    slug?: string;
}

const sortValue = (row: DucatsRow, key: DucatsSortKey): number => {
    switch (key) {
        case "efficiency":
            return row.ducatsPerPlatinum;
        case "ducats":
            return row.ducats;
        case "median":
            return row.median;
        case "volume":
            return row.volume;
        case "platWorth":
            return row.platWorth;
    }
};

/**
 * 杜卡德效率页逻辑：合并 `GET /v1/tools/ducats` 统计与物品清单，
 * 提供时段切换、名称搜索、按列排序，以及每笔换算比价的派生行数据。
 */
export function useDucats() {
    const lang = useSettingsStore((s) => s.lang);
    const ducats = useDucatsQuery();
    const items = useMarketItemsQuery();

    const [period, setPeriod] = useState<DucatsPeriod>("previousHour");
    const [sortKey, setSortKey] = useState<DucatsSortKey>("efficiency");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [text, setText] = useState("");

    // item id → Item，用于把统计里的物品 id 映射成名称 / 图标 / slug
    const itemMap = useMemo(() => {
        const map = new Map<string, Item>();
        for (const it of items.data ?? []) map.set(it.id, it);
        return map;
    }, [items.data]);

    const rows = useMemo<DucatsRow[]>(() => {
        const stats = ducats.data?.[period] ?? [];
        const query = text.trim().toLowerCase();
        const mapped = stats.map<DucatsRow>((stat) => {
            const item = itemMap.get(stat.item);
            
            return {
                ...stat,
                name: item ? itemDisplayName(item, lang) : stat.item,
                icon: item ? itemIconUrl(item, lang, true) : "",
                slug: item?.slug,
            };
        });
        const filtered = query
            ? mapped.filter((r) => r.name.toLowerCase().includes(query))
            : mapped;
        const dir = sortDir === "asc" ? 1 : -1;
        return [...filtered].sort(
            (a, b) => (sortValue(a, sortKey) - sortValue(b, sortKey)) * dir,
        );
    }, [ducats.data, period, itemMap, lang, text, sortKey, sortDir]);

    /** 点击列头：同列切换升降序，换列默认降序 */
    const toggleSort = (key: DucatsSortKey) => {
        if (key === sortKey) {
            setSortDir((d) => (d === "desc" ? "asc" : "desc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    return {
        rows,
        period,
        setPeriod,
        sortKey,
        sortDir,
        toggleSort,
        text,
        setText,
        isPending: ducats.isPending,
        isError: ducats.isError,
        error: ducats.error,
        itemsPending: items.isPending,
    };
}
