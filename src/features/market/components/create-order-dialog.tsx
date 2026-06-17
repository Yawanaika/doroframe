import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSettingsStore } from "@/store";
import { useCreateOrderMutation } from "../queries";
import { draftToSubmitOrder } from "../order-mapper";
import { SUBTYPE_LABELS } from "../constants";
import { itemDisplayName, itemIconUrl } from "../assets";
import type { Item } from "@/types/wf-market";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** 当前选中物品；为空时不能提交 */
    item: Item | null;
}

type OrderType = "sell" | "buy";

interface FieldErrors {
    platinum?: string;
    quantity?: string;
    rank?: string;
    amberStars?: string;
    cyanStars?: string;
}

const numOrNull = (v: string): number | null => {
    if (v.trim() === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

export function CreateOrderDialog({ open, onOpenChange, item }: Props) {
    const { t } = useTranslation();
    const lang = useSettingsStore((s) => s.lang);
    const createOrder = useCreateOrderMutation();

    const [orderType, setOrderType] = useState<OrderType>("sell");
    const [visible, setVisible] = useState(true);
    const [platinum, setPlatinum] = useState("");
    const [quantity, setQuantity] = useState("");
    const [rank, setRank] = useState("");
    const [amberStars, setAmberStars] = useState("");
    const [cyanStars, setCyanStars] = useState("");
    const [subtype, setSubtype] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
        null,
    );

    const hasSubtypes = !!item?.subtypes && item.subtypes.length > 0;
    const showRank =
        item?.maxRank != null && item?.maxCharges == null;
    const showAmber = (item?.maxAmberStars ?? 0) > 0;
    const showCyan = (item?.maxCyanStars ?? 0) > 0;

    // 物品切换时重置表单（对齐 doroprime 的 _loadItemInfo 清表单逻辑）
    useEffect(() => {
        setPlatinum("");
        setQuantity("");
        setRank("");
        setAmberStars("");
        setCyanStars("");
        setErrors({});
        setMessage(null);
        setSubtype(hasSubtypes ? item!.subtypes![0] : "");
    }, [item, hasSubtypes]);

    const validate = (): FieldErrors => {
        const next: FieldErrors = {};
        const p = numOrNull(platinum);
        if (platinum.trim() === "") next.platinum = t("order.error.required");
        else if (p == null || p <= 0) next.platinum = t("order.error.format");

        const q = numOrNull(quantity);
        if (quantity.trim() === "") next.quantity = t("order.error.required");
        else if (q == null || q <= 0) next.quantity = t("order.error.format");

        if (showRank) {
            const max = item!.maxRank!;
            const r = numOrNull(rank);
            if (rank.trim() === "") next.rank = t("order.error.required");
            else if (r == null || r < 0 || r > max)
                next.rank = t("order.error.range", { max });
        }
        if (showAmber) {
            const max = item!.maxAmberStars!;
            const a = numOrNull(amberStars);
            if (amberStars.trim() === "") next.amberStars = t("order.error.required");
            else if (a == null || a < 0 || a > max)
                next.amberStars = t("order.error.range", { max });
        }
        if (showCyan) {
            const max = item!.maxCyanStars!;
            const c = numOrNull(cyanStars);
            if (cyanStars.trim() === "") next.cyanStars = t("order.error.required");
            else if (c == null || c < 0 || c > max)
                next.cyanStars = t("order.error.range", { max });
        }
        return next;
    };

    const handleSubmit = async () => {
        if (!item) return;
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        try {
            const order = draftToSubmitOrder({
                itemId: item.id,
                orderType,
                visible,
                platinum: numOrNull(platinum) ?? undefined,
                quantity: numOrNull(quantity) ?? undefined,
                amberStars: showAmber ? numOrNull(amberStars) ?? undefined : undefined,
                cyanStars: showCyan ? numOrNull(cyanStars) ?? undefined : undefined,
                rank: showRank ? numOrNull(rank) ?? undefined : undefined,
                subtype: subtype !== "" ? subtype : undefined,
                tags: item.tags,
            });
            await createOrder.mutateAsync(order);
            setMessage({ ok: true, text: t("order.submit.success") });
            setPlatinum("");
            setQuantity("");
            setRank("");
            setAmberStars("");
            setCyanStars("");
            setErrors({});
        } catch (e) {
            setMessage({
                ok: false,
                text: e instanceof Error ? e.message : String(e),
            });
        }
    };

    const name = item ? itemDisplayName(item, lang) : "";

    const subtypeItems = useMemo(
        () => item?.subtypes ?? [],
        [item],
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{t("order.title")}</DialogTitle>
                </DialogHeader>

                <div className="flex gap-6">
                    {/* 左侧物品展示 */}
                    <div className="flex w-44 shrink-0 flex-col items-center gap-3">
                        <Avatar size="lg" className="size-24">
                            <AvatarImage
                                src={item ? itemIconUrl(item, lang) : ""}
                                alt={name}
                                className="object-contain"
                            />
                            <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center text-sm font-medium">{name}</div>
                    </div>

                    {/* 右侧表单 */}
                    <div className="flex flex-1 flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label={t("order.field.type")}>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={orderType === "sell" ? "default" : "outline"}
                                        onClick={() => setOrderType("sell")}
                                    >
                                        {t("market.type.sell")}
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={orderType === "buy" ? "default" : "outline"}
                                        onClick={() => setOrderType("buy")}
                                    >
                                        {t("market.type.buy")}
                                    </Button>
                                </div>
                            </Field>
                            <Field label={t("order.field.visibility")}>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={visible ? "default" : "outline"}
                                        onClick={() => setVisible(true)}
                                    >
                                        {t("order.visible")}
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={!visible ? "default" : "outline"}
                                        onClick={() => setVisible(false)}
                                    >
                                        {t("order.invisible")}
                                    </Button>
                                </div>
                            </Field>
                        </div>

                        <div
                            className={
                                hasSubtypes
                                    ? "grid grid-cols-3 gap-4"
                                    : "grid grid-cols-2 gap-4"
                            }
                        >
                            <Field
                                label={t("order.field.platinum")}
                                error={errors.platinum}
                            >
                                <Input
                                    inputMode="numeric"
                                    value={platinum}
                                    onChange={(e) =>
                                        setPlatinum(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </Field>
                            <Field
                                label={t("order.field.quantity")}
                                error={errors.quantity}
                            >
                                <Input
                                    inputMode="numeric"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </Field>
                            {hasSubtypes && (
                                <Field label={t("order.field.subtype")}>
                                    <Select value={subtype} onValueChange={setSubtype}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subtypeItems.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {SUBTYPE_LABELS[s] ?? s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        </div>

                        {(showCyan || showAmber) && (
                            <div className="grid grid-cols-2 gap-4">
                                {showCyan && (
                                    <Field
                                        label={t("order.field.cyan-stars")}
                                        error={errors.cyanStars}
                                    >
                                        <Input
                                            inputMode="numeric"
                                            placeholder={`0-${item!.maxCyanStars}`}
                                            value={cyanStars}
                                            onChange={(e) =>
                                                setCyanStars(
                                                    e.target.value.replace(/\D/g, ""),
                                                )
                                            }
                                        />
                                    </Field>
                                )}
                                {showAmber && (
                                    <Field
                                        label={t("order.field.amber-stars")}
                                        error={errors.amberStars}
                                    >
                                        <Input
                                            inputMode="numeric"
                                            placeholder={`0-${item!.maxAmberStars}`}
                                            value={amberStars}
                                            onChange={(e) =>
                                                setAmberStars(
                                                    e.target.value.replace(/\D/g, ""),
                                                )
                                            }
                                        />
                                    </Field>
                                )}
                            </div>
                        )}

                        {showRank && (
                            <Field label={t("order.field.rank")} error={errors.rank}>
                                <Input
                                    inputMode="numeric"
                                    placeholder={`0-${item!.maxRank}`}
                                    value={rank}
                                    onChange={(e) =>
                                        setRank(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </Field>
                        )}

                        {message && (
                            <div
                                className={
                                    message.ok
                                        ? "rounded-md bg-primary/10 p-2 text-sm text-primary"
                                        : "rounded-md bg-destructive/10 p-2 text-sm text-destructive"
                                }
                            >
                                {message.text}
                            </div>
                        )}

                        <Button
                            type="button"
                            className="w-full"
                            disabled={!item || createOrder.isPending}
                            onClick={handleSubmit}
                        >
                            {createOrder.isPending
                                ? t("common.loading")
                                : t("order.send")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {error ? (
                <div className="text-xs text-destructive">{error}</div>
            ) : null}
        </div>
    );
}
