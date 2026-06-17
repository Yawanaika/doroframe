import { useState } from "react";
import {
    useSuggestions,
    useItemOrdersQuery,
    useItemSetQuery,
} from "./queries";
import type { OrderTypeCode } from "./constants";
import { useAuthStore } from "@/store";

/**
 * market-items 页面的编排逻辑：选中物品、套装锚点、订单类型与下单弹窗开关，
 * 以及随之派生的查询与喊话物品名。页面组件只消费返回值、专注布局。
 */
export function useMarketItems() {
    const { suggestions } = useSuggestions();

    // text: 搜索框可见文本；slug/name: 当前选中物品；setAnchor: 套装查询锚点
    const [text, setText] = useState("");
    const [slug, setSlug] = useState("");
    const [name, setName] = useState("");
    const [setAnchor, setSetAnchor] = useState("");
    const [orderType, setOrderType] = useState<OrderTypeCode>("sell");
    const [orderOpen, setOrderOpen] = useState(false);

    const isLoggedIn = useAuthStore((s) => s.isLoggedIn());

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
