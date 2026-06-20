import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
    CheckIcon,
    EyeIcon,
    EyeOffIcon,
    MoreHorizontalIcon,
    PackageOpenIcon,
    SquarePenIcon,
    Trash2Icon,
} from "lucide-react";
import { useSettingsStore } from "@/store/settings";
import { useMarketItemsQuery, useUserOrdersQuery } from "@/features/market/queries";
import { ToSubmit, ToGroupSubmit, useOrderActions} from "@/features/market/order-actions";
import { ORDER_TYPES, type OrderTypeCode } from "@/features/market/constants";
import { itemDisplayName, itemIconUrl } from "@/features/market/assets";
import type { Item, ItemOrder } from "@/types/wf-market";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditOrderDialog } from "@/features/market/components/edit-order-dialog";
import { OrderMeta } from "@/features/market/components/order-meta";

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
    const { handleGroupVisible, grouping } = useOrderActions();
    const def = ORDER_TYPES[type];
    const label = lang === "zh" ? def.labelZh : def.labelEn;

    const visible = orders.filter((o) => o.visible ?? true).length;
    const hidden = orders.length - visible;

    const hasOrders = !loading && !error && orders.length > 0;

    // 批量改本栏（按 type 区分 sell/buy）可见性，组 id 用默认组 all
    const setGroupVisible = (next: boolean) =>
        void handleGroupVisible("all", ToGroupSubmit(type, next));

    return (
        <Card className="gap-0 overflow-hidden p-0">
            {/* 栏头：语义色标签 + 计数，右侧批量显示/隐藏 */}
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
                        {t("market.me.orders.stats", { visible, hidden })}
                    </span>
                ) : null}
                {hasOrders ? (
                    <div className="ml-auto flex items-center gap-1">
                        <Button
                            type="button"
                            size="xs"
                            disabled={grouping || hidden === 0}
                            onClick={() => setGroupVisible(true)}
                        >
                            <EyeIcon data-icon="inline-start" />
                            {t("market.me.orders.action.showAll")}
                        </Button>
                        <Button
                            type="button"
                            size="xs"
                            disabled={grouping || visible === 0}
                            onClick={() => setGroupVisible(false)}
                        >
                            <EyeOffIcon data-icon="inline-start" />
                            {t("market.me.orders.action.hideAll")}
                        </Button>
                    </div>
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
    const navigate = useNavigate();
    const { handleClose, handleDelete, handleEdit, closing, deleting, editing } = useOrderActions();
    const [editOpen, setEditOpen] = useState(false);
    const name = item ? itemDisplayName(item, lang) : (order.itemId ?? "—");
    const iconUrl = item ? itemIconUrl(item, lang, !item.setRoot) : "";
    const dimmed = order.visible === false;
    
    const onClose = () => void handleClose(order.id, ToSubmit(order, "close"));
    const onDelete = () => void handleDelete(order.id);
    const onShow = () => void handleEdit(order.id, ToSubmit(order, "show"));
    const onAdd = () => void handleEdit(order.id, ToSubmit(order, "add"));
    const onOpenItem = () => {
        if (!item?.slug) return;
        void navigate({ to: "/market/items", search: { slug: item.slug } });
    };
    const busy = closing || deleting || editing;

    return (
        <li
            className={cn(
                "group/row flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40"
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
                    {item?.slug ? (
                        <button
                            type="button"
                            onClick={onOpenItem}
                            className="truncate rounded-sm text-left text-sm font-medium underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                            title={name}
                        >
                            {name}
                        </button>
                    ) : (
                        <span className="truncate text-sm font-medium" title={name}>
                            {name}
                        </span>
                    )}
                    {dimmed ? (
                        <EyeOffIcon className="size-3 shrink-0 text-muted-foreground" />
                    ) : null}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <OrderMeta order={order} item={item} />
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

            {/* 操作区：主操作「成交」+ 快捷「+1」，其余收进溢出菜单 */}
            <div className="flex shrink-0 items-center gap-1">
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                size="sm"
                                onClick={onClose}
                                disabled={busy}
                            >
                                <CheckIcon data-icon="inline-start" />
                                {t("market.me.orders.action.sold")}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("market.me.orders.action.sold.hint")}
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                size="icon-sm"
                                variant="outline"
                                aria-label={t("market.me.orders.action.add.hint")}
                                onClick={onAdd}
                                disabled={busy}
                            >
                                {t("market.me.orders.action.add")}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("market.me.orders.action.add.hint")}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-label={t("market.me.orders.action.more")}
                            disabled={busy}
                        >
                            <MoreHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                            disabled={busy}
                            onSelect={(e) => {
                                e.preventDefault();
                                setEditOpen(true);
                            }}
                        >
                            <SquarePenIcon />
                            {t("market.me.orders.action.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={onShow} disabled={busy}>
                            {dimmed ? <EyeIcon /> : <EyeOffIcon />}
                            {dimmed
                                ? t("market.me.orders.action.show")
                                : t("market.me.orders.action.hide")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onSelect={onDelete}
                            disabled={busy}
                        >
                            <Trash2Icon />
                            {t("market.me.orders.action.delete")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <EditOrderDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                order={order}
                item={item}
            />
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
