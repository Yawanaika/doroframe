import { useTranslation } from "react-i18next";
import { SearchBar } from "@/features/market/components/search-bar";
import { OrderList } from "@/features/market/components/order-list";
import { ItemDetail } from "@/features/market/components/item-detail";
import { SetDisplay } from "@/features/market/components/set-display";
import { NeedCreateOrder} from "@/features/market/components/create-order-dialog";
import { OrderTypeToggle } from "@/features/market/components/order-type-toggle";
import { useMarketItems } from "@/features/market/use-market-items";
import { Card } from "@/components/ui/card";
import { CardError } from "@/components/card-states";

export function MarketItemsPage() {
    const { t } = useTranslation();
    const {
        suggestions,
        text,
        setText,
        slug,
        orderType,
        setOrderType,
        orders,
        set,
        itemNameEn,
        itemNameZh,
        item,
        onSelect,
    } = useMarketItems();
    return (
        <div className="flex h-full flex-col gap-3">
            <Card className="shrink-0 p-4">
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
                            <OrderTypeToggle value={orderType} onChange={setOrderType} />
                            <ItemDetail setInfo={set.data} slug={slug} />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="min-h-0 flex-1">
                {orders.isError ? (
                    <CardError message={String(orders.error)} />
                ) : (
                    <OrderList
                        orders={orders.data ?? []}
                        orderType={orderType}
                        itemNameZh={itemNameZh}
                        itemNameEn={itemNameEn}
                        item={item}
                        isLoading={!!slug && orders.isPending}
                        hasQuery={!!slug}
                    />
                )}
            </div>
            <NeedCreateOrder slug={slug} setInfo={set.data}/>
        </div>
    );
}
