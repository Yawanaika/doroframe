import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { useSearch } from "@tanstack/react-router";
import type { UseQueryResult } from "@tanstack/react-query";
import {
    useSuggestions,
    useItemOrdersQuery,
    useItemSetQuery,
    type Suggestion,
} from "@/features/market/queries";
import type { OrderTypeCode } from "@/features/market/constants";
import { useAuthStore } from "@/store";
import type { ItemOrder, SetInfo } from "@/types/wf-market";

export interface UseMarketItems {
    suggestions: Suggestion[];
    /** 搜索框可见文本 */
    text: string;
    setText: Dispatch<SetStateAction<string>>;
    /** 当前选中物品 slug */
    slug: string;
    orderType: OrderTypeCode;
    setOrderType: Dispatch<SetStateAction<OrderTypeCode>>;
    /** 下单弹窗开关 */
    orderOpen: boolean;
    setOrderOpen: Dispatch<SetStateAction<boolean>>;
    isLoggedIn: boolean;
    orders: UseQueryResult<ItemOrder[]>;
    // /** 选中物品的 Top5 买卖订单（`{ sell, buy }`） */
    // topOrders: UseQueryResult<TopOrders>;
    set: UseQueryResult<SetInfo>;
    /** 喊话用物品英文名 */
    itemNameEn: string;
    /** 喊话用物品中文名 */
    itemNameZh: string;
    /** 选中物品（来自搜索或套装点击） */
    onSelect: (slug: string, name: string) => void;
}

/**
 * market-items 页面的编排逻辑：选中物品、套装锚点、订单类型与下单弹窗开关，
 * 以及随之派生的查询与喊话物品名。页面组件只消费返回值、专注布局。
 */
export function useMarketItems(): UseMarketItems {
    const { suggestions } = useSuggestions();

    // text: 搜索框可见文本；slug/name: 当前选中物品；setAnchor: 套装查询锚点
    const [text, setText] = useState("");
    const [slug, setSlug] = useState("");
    const [name, setName] = useState("");
    const [setAnchor, setSetAnchor] = useState("");
    const [orderType, setOrderType] = useState<OrderTypeCode>("sell");
    const [orderOpen, setOrderOpen] = useState(false);

    const isLoggedIn = useAuthStore((s) => s.isLoggedIn());

    // 深链：?slug= 进入时定位到该物品（strict:false 避免与 router 形成循环依赖）
    const { slug: incomingSlug } = useSearch({ strict: false }) as {
        slug?: string;
    };
    // 每个传入 slug 只播种一次，之后不干扰用户在搜索框内的手动切换
    const seededRef = useRef<string>("");
    useEffect(() => {
        if (!incomingSlug || incomingSlug === seededRef.current) return;
        seededRef.current = incomingSlug;
        setSlug(incomingSlug);
        setSetAnchor(incomingSlug);
    }, [incomingSlug]);

    // items 加载后把深链物品名回填到搜索框（仅在用户尚未输入时）
    useEffect(() => {
        if (!incomingSlug || slug !== incomingSlug || text) return;
        const sug = suggestions.find((s) => s.slug === incomingSlug);
        if (sug) {
            setName(sug.name);
            setText(sug.name);
        }
    }, [incomingSlug, slug, text, suggestions]);

    // 订单按选中物品各自查询；套装信息只在「跨套装」时才换锚点重查
    const orders = useItemOrdersQuery(slug);
    const set = useItemSetQuery(setAnchor);

    // 喊话物品名按订单所有者语言决定：取选中物品中/英文名（套装未加载时回退当前展示名）
    const selectedItem = set.data?.items.find((it) => it.slug === slug);
    const itemNameEn = selectedItem?.i18n.en.name ?? name;
    const itemNameZh = selectedItem?.i18n.zhHans?.name ?? name;

    const onSelect = (s: string, n: string) => {
        setSlug(s);
        setName(n);
        setText(n);
        // 新选中项已在当前套装内 → 保持锚点不变，仅切换高亮，不重查 setInfo
        const inCurrentSet = set.data?.items.some((it) => it.slug === s);
        if (!inCurrentSet) setSetAnchor(s);
    };

    return {
        suggestions,
        text,
        setText,
        slug,
        orderType,
        setOrderType,
        orderOpen,
        setOrderOpen,
        isLoggedIn,
        orders,
        set,
        itemNameEn,
        itemNameZh,
        onSelect,
    };
}
