import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {CheckIcon, EyeIcon, EyeOffIcon, PackageOpenIcon, SquarePenIcon, Trash2Icon} from "lucide-react";
import { useSettingsStore } from "@/store/settings";
import { useMarketItemsQuery, useUserOrdersQuery } from "@/features/market/queries";
import { ToSubmit, useOrderActions} from "@/features/market/order-actions";
import { ORDER_TYPES, type OrderTypeCode } from "@/features/market/constants";
import { itemDisplayName, itemIconUrl } from "@/features/market/assets";
import type { Item, ItemOrder } from "@/types/wf-market";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button.tsx";

/**
 * 当前登录用户的订单展示。
 * 出售 / 求购 两栏并排（窄屏纵向堆叠），每栏列出订单卡片。
 * 只读展示，不含编辑/删除（后续接入写操作时再扩展）。
 */
export function MyOrders({ slug }: { slug: string | undefined }) {
    const lang = useSettingsStore((s) => s.lang);
    const ordersQ = useUserOrdersQuery(slug);
    const itemsQ = useMarketItemsQuery();

    // itemId → Item，订单只带 itemId，图标/名称需 join 物品表
    const itemsById = useMemo(() => {
        const map = new Map<string, Item>();
        for (const it of itemsQ.data ?? []) map.set(it.id, it);
        return map;
    }, [itemsQ.data]);

    const { sell, buy } = useMemo(() => {
        const sell: ItemOrder[] = [];
        const buy: ItemOrder[] = [];
        for (const o of ordersQ.data ?? []) {
            if (o.type === "buy") buy.push(o);
            else sell.push(o);
        }
        // 可见的排前面
        const byVisible = (a: ItemOrder, b: ItemOrder) =>
            Number(b.visible ?? true) - Number(a.visible ?? true);
        return { sell: sell.sort(byVisible), buy: buy.sort(byVisible) };
    }, [ordersQ.data]);

    const loading = ordersQ.isPending || itemsQ.isPending;

    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <OrderPanel
                type="sell"
                orders={sell}
                itemsById={itemsById}
                loading={loading}
                error={ordersQ.isError}
                lang={lang}
            />
            <OrderPanel
                type="buy"
                orders={buy}
                itemsById={itemsById}
                loading={loading}
                error={ordersQ.isError}
                lang={lang}
            />
        </div>
    );
}

function OrderPanel({
    type,
    orders,
    itemsById,
    loading,
    error,
    lang,
}: {
    type: OrderTypeCode;
    orders: ItemOrder[];
    itemsById: Map<string, Item>;
    loading: boolean;
    error: boolean;
    lang: "zh" | "en";
}) {
    const { t } = useTranslation();
    const def = ORDER_TYPES[type];
    const label = lang === "zh" ? def.labelZh : def.labelEn;

    const visible = orders.filter((o) => o.visible ?? true).length;
    const hidden = orders.length - visible;

    return (
        <Card className="gap-0 overflow-hidden p-0">
            {/* 栏头：语义色标签 + 可见/隐藏计数 */}
            <div className="flex items-center gap-2.5 border-b px-4 py-3">
                <span
                    className="inline-flex h-6 items-center rounded-md px-2 text-sm font-semibold"
                    style={{
                        color: def.accent,
                        backgroundColor: `${def.accent}1f`,
                    }}
                >
                    {label}
                </span>
                {!loading && !error ? (
                    <span className="text-xs text-muted-foreground">
                        {visible} {t("market.me.orders.visible")}
                        {hidden > 0 ? (
                            <> · {hidden} {t("market.me.orders.hidden")}</>
                        ) : null}
                    </span>
                ) : null}
            </div>

            {loading ? (
                <div className="divide-y">
                    {[0, 1, 2].map((i) => (
                        <OrderRowSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <EmptyState text={t("market.me.orders.error")} />
            ) : orders.length === 0 ? (
                <EmptyState
                    text={t(
                        type === "sell"
                            ? "market.me.orders.empty.sell"
                            : "market.me.orders.empty.buy",
                    )}
                />
            ) : (
                <ul className="divide-y">
                    {orders.map((o) => (
                        <OrderRow
                            key={o.id}
                            order={o}
                            item={o.itemId ? itemsById.get(o.itemId) : undefined}
                            accent={def.accent}
                            lang={lang}
                        />
                    ))}
                </ul>
            )}
        </Card>
    );
}

function OrderRow({
    order,
    item,
    accent,
    lang,
}: {
    order: ItemOrder;
    item: Item | undefined;
    accent: string;
    lang: "zh" | "en";
}) {
    const { t } = useTranslation();
    const { handleClose, handleDelete, handleEdit, closing, deleting, editing } = useOrderActions();
    const name = item ? itemDisplayName(item, lang) : (order.itemId ?? "—");
    const iconUrl = item ? itemIconUrl(item, lang, !item.setRoot) : "";
    const dimmed = order.visible === false;
    
    const onClose = () => void handleClose(order.id, ToSubmit(order, "close"));
    const onDelete = () => void handleDelete(order.id);
    const onShow = () => void handleEdit(order.id, ToSubmit(order, "show"));
    const onAdd = () => void handleEdit(order.id, ToSubmit(order, "add"));
    return (
        <li
            className={cn(
                "flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40",
                dimmed && "opacity-55",
            )}
        >
            {/* 物品图标 */}
            <div className="size-10 shrink-0 overflow-hidden rounded-md border bg-muted/50">
                {iconUrl ? (
                    <img
                        src={iconUrl}
                        alt=""
                        loading="lazy"
                        className="size-full object-contain p-1"
                    />
                ) : null}
            </div>

            {/* 名称 + 元信息 */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium" title={name}>
                        {name}
                    </span>
                    {dimmed ? (
                        <EyeOffIcon className="size-3 shrink-0 text-muted-foreground" />
                    ) : null}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    {order.rank != null && item?.maxRank ? (
                        <span>
                            {t("market.rank", { rank: order.rank })}/{item.maxRank}
                        </span>
                    ) : null}
                    {order.subtype ? (
                        <span className="truncate">
                            {t(order.subtype, {
                                ns: "subtype",
                                defaultValue: order.subtype,
                            })}
                        </span>
                    ) : null}
                </div>
            </div>

            {/* 价格 + 数量 */}
            <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span
                    className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums"
                    style={{ color: accent }}
                >
                    {order.platinum}
                    <img
                        src="/images/resources/Platinum.png"
                        alt="platinum"
                        className="size-3.5"
                    />
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    ×{order.quantity}
                </span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
                <Button
                    type="button"
                    onClick={onClose}
                    disabled={closing || deleting || editing}
                >
                    <CheckIcon data-icon="inline-start" />
                    已售出
                </Button>
                <Button
                    type="button"
                    disabled={closing || deleting || editing}
                >
                    <SquarePenIcon data-icon="inline-start" />
                    编辑
                </Button>
                <Button
                    type="button"
                    onClick={onAdd}
                    disabled={closing || deleting || editing}
                >
                    <SquarePenIcon data-icon="inline-start" />
                    +1
                </Button>
                <Button
                    type="button"
                    onClick={onShow}
                    disabled={closing || deleting || editing}
                >
                    {dimmed?<EyeIcon data-icon="inline-start" />:<EyeOffIcon data-icon="inline-start" />}
                    {dimmed?"展示":"隐藏"}
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                    disabled={closing || deleting || editing}
                >
                    <Trash2Icon data-icon="inline-start" />
                    删除
                </Button>
            </div>
        </li>
    );
}

function OrderRowSkeleton() {
    return (
        <div className="flex items-center gap-3 px-4 py-2.5">
            <Skeleton className="size-10 shrink-0" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-4 w-10" />
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <PackageOpenIcon className="size-6 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{text}</p>
        </div>
    );
}
