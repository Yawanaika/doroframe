// 拍卖页编排：搜索态与列表查询、创建弹窗开关。搜索时停轮询、展示搜索结果；
// 重置回到默认大厅并恢复 30s 轮询（轮询逻辑在 useAuctions 内按 searchParams 切换）。

import { useState, type Dispatch, type SetStateAction } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useAuctions as useAuctionsQuery } from "@/features/market/queries";
import { useAuthStore } from "@/store";
import type { AuctionOrder, AuctionSearchParams } from "@/types/wf-market";

export interface UseAuctions {
    auctions: UseQueryResult<AuctionOrder[]>;
    isSearching: boolean;
    isLoggedIn: boolean;
    createOpen: boolean;
    setCreateOpen: Dispatch<SetStateAction<boolean>>;
    onSearch: (params: AuctionSearchParams) => void;
    onReset: () => void;
}

export function useAuctions(): UseAuctions {
    const [searchParams, setSearchParams] = useState<AuctionSearchParams | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn());

    const auctions = useAuctionsQuery(searchParams);

    return {
        auctions,
        isSearching: searchParams !== null,
        isLoggedIn,
        createOpen,
        setCreateOpen,
        onSearch: (params) => setSearchParams(params),
        onReset: () => setSearchParams(null),
    };
}
