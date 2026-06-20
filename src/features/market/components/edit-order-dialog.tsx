import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/store";
import { useTopOrdersQuery } from "../queries";
import { useOrderActions } from "../order-actions";
import { itemDisplayName, itemIconUrl } from "../assets";
import { statusOf } from "../constants";
import type { Item, ItemOrder, SubmitItemOrder } from "@/types/wf-market";
import {
    NumberField,
    VisibilityToggle,
    numOrNull,
    digits,
    numToStr,
    validatePositive,
    validateRange,
    type FieldErrors,
} from "@/features/market/components/order-form-fields.tsx";
import { Meh, Smile } from "lucide-react";
import { OrderMeta } from "@/features/market/components/order-meta";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** 被编辑的订单 */
    order: ItemOrder;
    /** 订单对应物品：用于展示、行情查询与字段可见性判断 */
    item: Item | undefined;
    /** 触发器：作为 DialogTrigger 的子元素渲染 */
    trigger?: React.ReactNode;
}

type NumberKey = "platinum" | "quantity" | "rank" | "amberStars" | "cyanStars";

/**
 * 编辑已存在订单的弹窗。
 * 左侧固定展示订单物品，右上「前 5 笔出售/购买」行情供改价参考，
 * 下方可调可见度、Mod 等级、每单位价格、数量后提交更新。
 */
export function EditOrderDialog({
    open,
    onOpenChange,
    order,
    item,
    trigger,
}: Props) {
    const { t } = useTranslation();
    const lang = useSettingsStore((s) => s.lang);
    const { handleEdit, editing } = useOrderActions();

    const topQ = useTopOrdersQuery(open && item?.slug ? item.slug : "");

    const showRank = item?.maxRank != null && item?.maxCharges == null;
    const showSubtype = (item?.subtypes?.length ?? 0) > 0;
    const showAmber = (item?.maxAmberStars ?? 0) > 0;
    const showCyan = (item?.maxCyanStars ?? 0) > 0;

    const [visible, setVisible] = useState(order.visible ?? true);
    const [numbers, setNumbers] = useState<Record<NumberKey, string>>({
        platinum: numToStr(order.platinum),
        quantity: numToStr(order.quantity),
        rank: numToStr(order.rank),
        amberStars: numToStr(order.amberStars),
        cyanStars: numToStr(order.cyanStars),
    });
    const [subtype, setSubtype] = useState(order.subtype ?? "");
    const [errors, setErrors] = useState<FieldErrors>({});

    // 打开时用当前订单值重置表单（订单或弹窗状态变化均同步）
    useEffect(() => {
        if (!open) return;
        setVisible(order.visible ?? true);
        setNumbers({
            platinum: numToStr(order.platinum),
            quantity: numToStr(order.quantity),
            rank: numToStr(order.rank),
            amberStars: numToStr(order.amberStars),
            cyanStars: numToStr(order.cyanStars),
        });
        // 预填订单原 subtype；缺失时回退该物品首个可选值
        setSubtype(order.subtype ?? item?.subtypes?.[0] ?? "");
        setErrors({});
    }, [open, order, item]);

    const setNumber = (key: NumberKey, raw: string) =>
        setNumbers((prev) => ({ ...prev, [key]: digits(raw) }));

    const validate = (): FieldErrors => {
        const next: FieldErrors = {};
        next.platinum = validatePositive(numbers.platinum, t);
        next.quantity = validatePositive(numbers.quantity, t);
        if (showRank) next.rank = validateRange(numbers.rank, item!.maxRank!, t);
        if (showAmber)
            next.amberStars = validateRange(numbers.amberStars, item!.maxAmberStars!, t);
        if (showCyan)
            next.cyanStars = validateRange(numbers.cyanStars, item!.maxCyanStars!, t);
        return next;
    };

    const onSubmit = async () => {
        const errs = validate();
        setErrors(errs);
        if (Object.values(errs).some(Boolean)) return;

        const submit: SubmitItemOrder = {
            platinum: numOrNull(numbers.platinum)!,
            quantity: numOrNull(numbers.quantity)!,
            visible,
        };
        if (showRank) submit.rank = numOrNull(numbers.rank) ?? undefined;
        if (showAmber) submit.amberStars = numOrNull(numbers.amberStars) ?? undefined;
        if (showCyan) submit.cyanStars = numOrNull(numbers.cyanStars) ?? undefined;
        if (showSubtype && subtype !== "") submit.subtype = subtype;

        if (await handleEdit(order.id, submit)) onOpenChange(false);
    };

    const name = item ? itemDisplayName(item, lang) : (order.itemId ?? "—");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
            <DialogContent showCloseButton={false} className="gap-0 p-0 sm:max-w-3xl">
                <div className="flex overflow-hidden rounded-xl">
                    {/* 左侧物品展示面板 */}
                    <div className="hidden w-56 shrink-0 flex-col justify-center border-r bg-card p-6 sm:flex dark:bg-muted">
                        <Avatar className="size-40 shadow-sm ring-1 ring-border">
                            <AvatarImage
                                src={item ? itemIconUrl(item, lang, !item.setRoot) : ""}
                                alt={name}
                                className="object-contain p-2"
                            />
                            <AvatarFallback className="bg-muted text-2xl">
                                {name.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="mt-4 text-center text-sm font-medium text-foreground">
                            {name}
                        </div>
                    </div>

                    {/* 右侧内容区 */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <DialogHeader className="flex-row items-center justify-between border-b p-4">
                            <DialogTitle className="text-lg">
                                {t("order.edit.title")}
                            </DialogTitle>
                            <DialogClose asChild>
                                <Button variant="destructive" size="sm">
                                    {t("order.close")}
                                </Button>
                            </DialogClose>
                        </DialogHeader>

                        {/* 行情参考：前 5 笔出售 / 购买 */}
                        <div className="max-h-64 space-y-4 overflow-y-auto border-b p-4">
                            <TopOrderList
                                title={t("order.top.sell")}
                                orders={topQ.data?.sell ?? []}
                                loading={topQ.isPending}
                                accent="var(--color-emerald-500, #10b981)"
                                lang={lang}
                                item={item}
                                emptyText={t("order.top.empty")}
                            />
                            <TopOrderList
                                title={t("order.top.buy")}
                                orders={topQ.data?.buy ?? []}
                                loading={topQ.isPending}
                                accent="var(--color-violet-500, #8b5cf6)"
                                lang={lang}
                                item={item}
                                emptyText={t("order.top.empty")}
                            />
                        </div>

                        <FieldGroup className="gap-4 bg-muted/30 p-4">
                            <Field>
                                <FieldLabel id="edit-visibility-label">
                                    {t("order.edit.visibility")}
                                </FieldLabel>
                                <VisibilityToggle
                                    visible={visible}
                                    onChange={setVisible}
                                    aria-labelledby="edit-visibility-label"
                                />
                            </Field>

                            {showRank && (
                                <NumberField
                                    id="edit-rank"
                                    label={t("order.field.rank")}
                                    placeholder={`0-${item!.maxRank}`}
                                    value={numbers.rank}
                                    error={errors.rank}
                                    onChange={(v) => setNumber("rank", v)}
                                />
                            )}

                            {showSubtype && (
                                <Field>
                                    <FieldLabel id="edit-subtype-label">
                                        {t("order.field.subtype")}
                                    </FieldLabel>
                                    <Select value={subtype} onValueChange={setSubtype}>
                                        <SelectTrigger aria-labelledby="edit-subtype-label">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {item!.subtypes!.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {t(s, { ns: "subtype", defaultValue: s })}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}

                            {(showCyan || showAmber) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {showCyan && (
                                        <NumberField
                                            id="edit-cyan"
                                            label={t("order.field.cyan-stars")}
                                            placeholder={`0-${item!.maxCyanStars}`}
                                            value={numbers.cyanStars}
                                            error={errors.cyanStars}
                                            onChange={(v) => setNumber("cyanStars", v)}
                                        />
                                    )}
                                    {showAmber && (
                                        <NumberField
                                            id="edit-amber"
                                            label={t("order.field.amber-stars")}
                                            placeholder={`0-${item!.maxAmberStars}`}
                                            value={numbers.amberStars}
                                            error={errors.amberStars}
                                            onChange={(v) => setNumber("amberStars", v)}
                                        />
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <NumberField
                                    id="edit-platinum"
                                    label={t("order.field.platinum")}
                                    placeholder={t("order.placeholder.platinum")}
                                    value={numbers.platinum}
                                    error={errors.platinum}
                                    onChange={(v) => setNumber("platinum", v)}
                                />
                                <NumberField
                                    id="edit-quantity"
                                    label={t("order.field.quantity")}
                                    placeholder={t("order.placeholder.quantity")}
                                    value={numbers.quantity}
                                    error={errors.quantity}
                                    onChange={(v) => setNumber("quantity", v)}
                                />
                            </div>
                        </FieldGroup>

                        <div className="flex justify-end border-t bg-muted/30 p-4">
                            <Button
                                className="min-w-32"
                                disabled={editing}
                                onClick={onSubmit}
                            >
                                {editing ? <Spinner data-icon="inline-start" /> : null}
                                {t("order.update")}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function TopOrderList({
    title,
    orders,
    loading,
    accent,
    lang,
    item,
    emptyText,
}: {
    title: string;
    orders: ItemOrder[];
    loading: boolean;
    accent: string;
    lang: "zh" | "en";
    item: Item | undefined;
    emptyText: string;
}) {
    const rows = orders.slice(0, 5);
    return (
        <div>
            <div className="mb-1.5 text-sm font-medium text-foreground">{title}</div>
            {loading ? (
                <div className="space-y-1">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-6 animate-pulse rounded bg-muted" />
                    ))}
                </div>
            ) : rows.length === 0 ? (
                <div className="py-1 text-xs text-muted-foreground">{emptyText}</div>
            ) : (
                <ul className="space-y-0.5">
                    {rows.map((o) => {
                        const status = statusOf(o.user?.status);
                        return (
                            <li
                                key={o.id}
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                            >
                                <span
                                    className="size-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: status.color }}
                                    title={lang === "zh" ? status.labelZh : status.labelEn}
                                />
                                <span className="min-w-0 flex-1 truncate text-foreground">
                                    {o.user?.ingameName ?? "—"}
                                </span>
                                {o.user?.reputation != null ? (
                                    <span
                                        className="flex shrink-0 tabular-nums"
                                        style={{color:o.user.reputation > 5?
                                                "var(--color-green-500, #22c55e)"
                                                :"var(--color-gray-500, #6b7280)"}}
                                    >
                                        {o.user.reputation}
                                        {o.user.reputation > 5 ?(
                                            <Smile className="size-3"/>
                                        ):(
                                            <Meh className="size-3"/>
                                        )}
                                    </span>
                                ) : null}
                                <span
                                    className="flex shrink-0 items-center gap-1 font-mono font-semibold tabular-nums"
                                    style={{ color: accent }}
                                >
                                    {o.platinum}
                                    <img
                                        src="/images/resources/Platinum.png"
                                        alt="platinum"
                                        className="size-3"
                                    />
                                </span>
                                <OrderMeta order={o} item={item} />
                                <span className="flex shrink-0 tabular-nums">
                                    <img
                                        src="/images/Coupon.png"
                                        alt="Coupon"
                                        className="size-3"
                                    />
                                    {o.quantity}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
