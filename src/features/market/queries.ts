import { useMemo } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchMarketItems, fetchItemOrders, fetchItemSet } from "@/api/market";
import { useSettingsStore } from "@/store/settings";
import { itemDisplayName } from "./assets";
import type { Item, ItemOrder, SetInfo } from "@/types/wf-market";

/** 搜索建议项：展示名 → slug */
export interface Suggestion {
    name: string;
    slug: string;
}

// items 极少变动：长缓存，避免每次进页都拉全量列表
const ITEMS_STALE = 6 * 60 * 60 * 1000;

export function useMarketItemsQuery(): UseQueryResult<Item[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "items", lang],
        queryFn: () => fetchMarketItems(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

/** 由物品列表派生「展示名 → slug」建议，按展示名排序 */
export function useSuggestions(): { suggestions: Suggestion[]; isPending: boolean } {
    const lang = useSettingsStore((s) => s.lang);
    const { data, isPending } = useMarketItemsQuery();
    const suggestions = useMemo<Suggestion[]>(() => {
        if (!data) return [];
        return data
            .map((it) => ({ name: itemDisplayName(it, lang), slug: it.slug }))
            .filter((s) => !!s.name)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [data, lang]);
    return { suggestions, isPending };
}

export function useItemOrdersQuery(slug: string): UseQueryResult<ItemOrder[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "orders", slug, lang],
        queryFn: () => fetchItemOrders(slug, lang),
        enabled: !!slug,
        staleTime: 30_000,
    });
}

export function useItemSetQuery(slug: string): UseQueryResult<SetInfo> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "set", slug, lang],
        queryFn: () => fetchItemSet(slug, lang),
        enabled: !!slug,
        staleTime: ITEMS_STALE,
    });
}
