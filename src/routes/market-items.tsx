import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { SearchBar } from "@/features/market/components/search-bar";
import { OrderList } from "@/features/market/components/order-list";
import { ItemDetail } from "@/features/market/components/item-detail";
import { SetDisplay } from "@/features/market/components/set-display";
import { CreateOrderDialog } from "@/features/market/components/create-order-dialog";
import {
    useSuggestions,
    useItemOrdersQuery,
    useItemSetQuery,
} from "@/features/market/queries";
import type { OrderTypeCode } from "@/features/market/constants";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardError } from "@/components/card-states";

export function MarketItemsPage() {
    const { t } = useTranslation();
    const { suggestions } = useSuggestions();

    // text: 搜索框可见文本；slug/name: 当前选中物品；setSlug: 套装查询锚点
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

    return (
        <div className="flex h-full flex-col gap-3">
            <Card className="p-4">
                <div className="flex gap-4">
                    {slug && (
                        <div className="shrink-0">
                            <SetDisplay
                                setInfo={set.data}
                                slug={slug}
                                onSelect={onSelect}
                                isLoading={set.isPending}
                            />
                        </div>
                    )}
                    <div className="flex flex-1 flex-col gap-3">
                        <SearchBar
                            suggestions={suggestions}
                            value={text}
                            onValueChange={setText}
                            onSelect={onSelect}
                            placeholder={t("market.search.placeholder")}
                        />
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={orderType === "sell" ? "default" : "outline"}
                                    onClick={() => setOrderType("sell")}
                                >
                                    {t("market.type.sell")}
                                </Button>
                                <Button
                                    size="sm"
                                    variant={orderType === "buy" ? "default" : "outline"}
                                    onClick={() => setOrderType("buy")}
                                >
                                    {t("market.type.buy")}
                                </Button>
                            </div>
                            <div className="flex items-center gap-4">
                                <ItemDetail setInfo={set.data} slug={slug} />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex-1 overflow-auto">
                {orders.isError ? (
                    <CardError message={String(orders.error)} />
                ) : (
                    <OrderList
                        orders={orders.data ?? []}
                        orderType={orderType}
                        itemNameZh={itemNameZh}
                        itemNameEn={itemNameEn}
                        isLoading={!!slug && orders.isPending}
                        hasQuery={!!slug}
                    />
                )}
            </div>

            {isLoggedIn && (
                <CreateOrderDialog
                    open={orderOpen}
                    onOpenChange={setOrderOpen}
                    setInfo={set.data}
                    slug={slug}
                    trigger={
                        <Button
                            size="icon"
                            aria-label={t("order.title")}
                            className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg"
                        >
                            <Plus className="size-6" />
                        </Button>
                    }
                />
            )}
        </div>
    );
}
