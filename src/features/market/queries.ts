import { useMemo } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from "@tanstack/react-query";
import {
    fetchMarketItems,
    fetchItemOrders,
    fetchRecentOrders,
    fetchItemSet,
    fetchUserOrders,
    createOrder,
    editOrder,
    editOrdersGroup,
    fetchItemOrdersTop, type TopOrdersFilter, closeOrder, deleteOrder,
    fetchRivenWeapons,
    fetchRivenWeapon,
    fetchRivenAttributes,
    fetchLichWeapons,
    fetchLichWeapon,
    fetchLichEphemeras,
    fetchLichQuirks,
    fetchSisterWeapons,
    fetchSisterWeapon,
    fetchSisterEphemeras,
    fetchSisterQuirks,
    fetchAuctions,
    searchAuctions,
    createAuction,
    fetchUserAuctions,
    fetchMyAuctionParticipant,
    fetchDucats,
} from "@/api/market";
import { invoke } from "@tauri-apps/api/core";
import { useSettingsStore } from "@/store/settings";
import { useAuthStore } from "@/store/auth";
import { itemDisplayName } from "@/features/market/assets";
import { auctionOrderFromJson } from "@/types/wf-market/v1/auction/auction-order";
import { applyAuctionSnapshot } from "@/features/market/ws/live";
import {
    ensureMyBid,
    genBidId,
    myBidOf,
    setMyBid,
    clearMyBid,
} from "@/features/market/ws/bids";
import type {
    Item,
    ItemOrder,
    SetInfo,
    SubmitItemOrder,
    TopOrders,
    Transaction,
    AuctionOrder,
    AuctionSearchParams,
    AuctionOrderParams,
    DucatsStats,
} from "@/types/wf-market";
import type { Riven, RivenAttribute } from "@/types/wf-market/v2/riven.ts";
import type {
    NemesisWeapon,
    NemesisEphemera,
    NemesisQuirk,
} from "@/types/wf-market/v2/nemesis.ts";

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

/** 最近订单流（GET /v2/orders/recent）：服务端 1 分钟缓存，这里取 60s staleTime 呼应。*/
export function useRecentOrdersQuery(
    enabled = true,
): UseQueryResult<ItemOrder[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "recent-orders", lang],
        queryFn: () => fetchRecentOrders(lang),
        enabled,
        staleTime: 60_000,
    });
}

/** 杜卡德效率统计（GET /v1/tools/ducats）：服务端按小时聚合，5 分钟 staleTime。
 * 数据与语言无关（item 为 id），故不按 lang 区分缓存。 */
export function useDucatsQuery(): UseQueryResult<DucatsStats> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "ducats"],
        queryFn: () => fetchDucats(lang),
        staleTime: 5 * 60 * 1000,
    });
}

export function useTopOrdersQuery(
    slug: string,
    filter: TopOrdersFilter = {},
): UseQueryResult<TopOrders> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "top-orders", slug, lang, filter],
        queryFn: () => fetchItemOrdersTop(slug, lang, filter),
        enabled: !!slug,
        staleTime: 30_000,
    });
}

/** 当前登录用户的全部订单：依赖 slug + token，30s 实时性 */
export function useUserOrdersQuery(
    slug: string | undefined,
): UseQueryResult<ItemOrder[]> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    return useQuery({
        queryKey: ["market", "user-orders", slug, lang],
        queryFn: () => fetchUserOrders(slug!, token, lang),
        enabled: !!slug && !!token,
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

// ===== Riven / Lich / Sister 清单查询 =====
// 均为 manifest 性质，极少变动：沿用 items 的长缓存。slug 详情按 slug 缓存。

export function useRivenWeaponsQuery(): UseQueryResult<Riven[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "riven-weapons", lang],
        queryFn: () => fetchRivenWeapons(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

export function useRivenWeaponQuery(slug: string): UseQueryResult<Riven> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "riven-weapon", slug, lang],
        queryFn: () => fetchRivenWeapon(slug, lang),
        enabled: !!slug,
        staleTime: ITEMS_STALE,
    });
}

export function useRivenAttributesQuery(): UseQueryResult<RivenAttribute[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "riven-attributes", lang],
        queryFn: () => fetchRivenAttributes(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

export function useLichWeaponsQuery(): UseQueryResult<NemesisWeapon[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "lich-weapons", lang],
        queryFn: () => fetchLichWeapons(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

export function useLichWeaponQuery(slug: string): UseQueryResult<NemesisWeapon> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "lich-weapon", slug, lang],
        queryFn: () => fetchLichWeapon(slug, lang),
        enabled: !!slug,
        staleTime: ITEMS_STALE,
    });
}

export function useLichEphemerasQuery(): UseQueryResult<NemesisEphemera[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "lich-ephemeras", lang],
        queryFn: () => fetchLichEphemeras(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

export function useLichQuirksQuery(): UseQueryResult<NemesisQuirk[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "lich-quirks", lang],
        queryFn: () => fetchLichQuirks(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

export function useSisterWeaponsQuery(): UseQueryResult<NemesisWeapon[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "sister-weapons", lang],
        queryFn: () => fetchSisterWeapons(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

export function useSisterWeaponQuery(slug: string): UseQueryResult<NemesisWeapon> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "sister-weapon", slug, lang],
        queryFn: () => fetchSisterWeapon(slug, lang),
        enabled: !!slug,
        staleTime: ITEMS_STALE,
    });
}

export function useSisterEphemerasQuery(): UseQueryResult<NemesisEphemera[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "sister-ephemeras", lang],
        queryFn: () => fetchSisterEphemeras(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

export function useSisterQuirksQuery(): UseQueryResult<NemesisQuirk[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "sister-quirks", lang],
        queryFn: () => fetchSisterQuirks(lang),
        staleTime: ITEMS_STALE,
        gcTime: ITEMS_STALE,
    });
}

/** 创建订单：成功后让对应物品的订单查询失效以便刷新 */
export function useCreateOrderMutation(): UseMutationResult<
    void,
    Error,
    SubmitItemOrder
> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (order: SubmitItemOrder) => createOrder(order, token, lang),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["market", "orders"] });
            void qc.invalidateQueries({ queryKey: ["market", "user-orders"] });
        },
    });
}

// ===== 拍卖（v1）=====

/** 拍卖列表查询：searchParams 为 null 时拉默认大厅并 30s 轮询；非 null 时走搜索且停轮询。
 * 对齐参考页「自动刷新 vs 搜索结果」两态。 */
export function useAuctions(
    searchParams: AuctionSearchParams | null,
): UseQueryResult<AuctionOrder[]> {
    const lang = useSettingsStore((s) => s.lang);
    return useQuery({
        queryKey: ["market", "auctions", searchParams ?? "all", lang],
        queryFn: () =>
            searchParams ? searchAuctions(searchParams, lang) : fetchAuctions(lang),
        staleTime: 30_000,
        refetchInterval: searchParams ? false : 30_000,
    });
}

/** 我的拍卖（owner 视角）：依赖 slug + token，30s 实时性。对齐 useUserOrdersQuery。 */
export function useUserAuctionsQuery(
    slug: string | undefined,
): UseQueryResult<AuctionOrder[]> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    return useQuery({
        queryKey: ["market", "user-auctions", slug, lang],
        queryFn: () => fetchUserAuctions(slug!, token, lang),
        enabled: !!slug && !!token,
        staleTime: 30_000,
    });
}

/** 我参与的竞拍（participant 视角）：依赖 token，30s 实时性。 */
export function useMyAuctionParticipantQuery(): UseQueryResult<AuctionOrder[]> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    return useQuery({
        queryKey: ["market", "auction-participant", lang],
        queryFn: () => fetchMyAuctionParticipant(token, lang),
        enabled: !!token,
        staleTime: 30_000,
    });
}

// ===== 出价 / 撤价（WS RPC，阶段二）=====

/** 出价/加价：解析或复用我的 bid_id，发 WS RPC，应答快照合并进缓存。
 * 失败抛 Error(code)，调用方按 code 提示。 */
export function usePlaceBid(): UseMutationResult<
    void,
    Error,
    { auctionId: string; value: number }
> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ auctionId, value }) => {
            const myId = useAuthStore.getState().user?.id;
            if (!myId) throw new Error("no-user");
            // 已有出价则复用其 bid_id（=编辑），否则生成新 id（=新建）
            const existing = await ensureMyBid(auctionId, myId, token, lang);
            const bidId = existing ?? genBidId();
            const resp = await invoke<any>("ws_bid_set", {
                auctionId,
                bidId,
                value,
            });
            const auction = resp?.payload?.auction;
            if (auction) applyAuctionSnapshot(auctionOrderFromJson(auction));
            setMyBid(auctionId, {
                bidId: resp?.payload?.bid?.id ?? bidId,
                value: resp?.payload?.bid?.value ?? value,
            });
        },
        // 新参与的单可能不在 participant 缓存（merge 跳过）→ 失效以便切 tab 可见
        onSuccess: () =>
            void qc.invalidateQueries({
                queryKey: ["market", "auction-participant"],
            }),
    });
}

/** 撤价：用我的 bid_id 发 REMOVE，应答快照合并进缓存。 */
export function useCancelBid(): UseMutationResult<void, Error, { auctionId: string }> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ auctionId }) => {
            const myId = useAuthStore.getState().user?.id;
            if (!myId) throw new Error("no-user");
            const bidId =
                myBidOf(auctionId)?.bidId ??
                (await ensureMyBid(auctionId, myId, token, lang));
            if (!bidId) throw new Error("not-found");
            const resp = await invoke<any>("ws_bid_remove", { auctionId, bidId });
            const auction = resp?.payload?.auction;
            if (auction) applyAuctionSnapshot(auctionOrderFromJson(auction));
            clearMyBid(auctionId);
        },
        onSuccess: () =>
            void qc.invalidateQueries({
                queryKey: ["market", "auction-participant"],
            }),
    });
}

/** 创建拍卖：成功后让拍卖列表查询失效以刷新 */
export function useCreateAuctionMutation(): UseMutationResult<
    AuctionOrder,
    Error,
    AuctionOrderParams
> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (params: AuctionOrderParams) => createAuction(params, token, lang),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["market", "auctions"] });
        },
    });
}

/** 编辑订单：成功后让物品订单与「我的订单」查询失效以刷新 */
export function useEditOrderMutation(): UseMutationResult<
    ItemOrder,
    Error,
    { id: string; order: SubmitItemOrder }
> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, order }) => editOrder(id, order, token, lang),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["market", "orders"] });
            void qc.invalidateQueries({ queryKey: ["market", "user-orders"] });
        },
    });
}

/** 批量改订单组可见性：成功后让物品订单与「我的订单」查询失效以刷新。
 * 返回受影响的订单数。 */
export function useEditOrdersGroupMutation(): UseMutationResult<
    number,
    Error,
    { id: string; order: SubmitItemOrder }
> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, order }) => editOrdersGroup(id, order, token, lang),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["market", "orders"] });
            void qc.invalidateQueries({ queryKey: ["market", "user-orders"] });
        },
    });
}

/** 关闭（成交）订单：成功后让物品订单与「我的订单」查询失效以刷新 */
export function useCloseOrderMutation(): UseMutationResult<
    Transaction,
    Error,
    { id: string; order: SubmitItemOrder }
> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, order }) => closeOrder(id, token, order, lang),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["market", "orders"] });
            void qc.invalidateQueries({ queryKey: ["market", "user-orders"] });
        },
    });
}

/** 删除订单：成功后让物品订单与「我的订单」查询失效以刷新 */
export function useDeleteOrderMutation(): UseMutationResult<ItemOrder, Error, string> {
    const lang = useSettingsStore((s) => s.lang);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteOrder(id, token, lang),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["market", "orders"] });
            void qc.invalidateQueries({ queryKey: ["market", "user-orders"] });
        },
    });
}
