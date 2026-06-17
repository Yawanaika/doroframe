import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/store";
import {
    useCreateOrderMutation,
    useMarketItemsQuery,
    useSuggestions,
    type Suggestion,
} from "../queries";
import { draftToSubmitOrder } from "../order-mapper";
import { itemDisplayName, itemIconUrl } from "../assets";
import type { Item, SetInfo } from "@/types/wf-market";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** 订单页查询到的套装信息：仅用于打开时预填外部选中物品 */
    setInfo: SetInfo | undefined;
    /** 订单页当前选中物品 slug：与 setInfo 共同定位预填物品 */
    slug: string;
    /** 触发器：作为 DialogTrigger 的子元素渲染 */
    trigger?: React.ReactNode;
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

const digits = (v: string): string => v.replace(/\D/g, "");

const EMPTY_NUMBERS = {
    platinum: "",
    quantity: "",
    rank: "",
    amberStars: "",
    cyanStars: "",
} as const;

type NumberKey = keyof typeof EMPTY_NUMBERS;

export function CreateOrderDialog({
    open,
    onOpenChange,
    setInfo,
    slug,
    trigger,
}: Props) {
    const { t } = useTranslation();
    const lang = useSettingsStore((s) => s.lang);
    const createOrder = useCreateOrderMutation();

    // 弹窗内独立临时状态：search 为输入框文本，pickedSlug 为已选 slug。
    // 切换物品只动这两者，永不回写外部 setInfo/slug。
    const itemsQuery = useMarketItemsQuery();
    const { suggestions } = useSuggestions();
    const [search, setSearch] = useState("");
    const [pickedSlug, setPickedSlug] = useState("");

    // 外部选中物品：仅取自订单页的 SetInfo，用于打开时预填
    const externalItem = useMemo(
        () => setInfo?.items.find((it) => it.slug === slug) ?? null,
        [setInfo, slug],
    );

    // 当前下单物品：优先全量列表（搜索切换来源），回退 SetInfo（外部预填且列表未就绪）
    const item = useMemo<Item | null>(
        () =>
            itemsQuery.data?.find((it) => it.slug === pickedSlug) ??
            setInfo?.items.find((it) => it.slug === pickedSlug) ??
            null,
        [itemsQuery.data, setInfo, pickedSlug],
    );

    const matches = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return [];
        return suggestions
            .filter((s) => s.name.toLowerCase().includes(q))
            .slice(0, 20);
    }, [search, suggestions]);

    // 打开时用外部选中物品预填；关闭时清空内部临时状态
    useEffect(() => {
        if (!open) {
            setSearch("");
            setPickedSlug("");
            return;
        }
        if (externalItem) {
            setPickedSlug(externalItem.slug);
            setSearch(itemDisplayName(externalItem, lang));
        }
    }, [open, externalItem, lang]);

    const [orderType, setOrderType] = useState<OrderType>("sell");
    const [visible, setVisible] = useState(true);
    const [numbers, setNumbers] = useState<Record<NumberKey, string>>({
        ...EMPTY_NUMBERS,
    });
    const [subtype, setSubtype] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});

    const hasSubtypes = !!item?.subtypes && item.subtypes.length > 0;
    const showRank = item?.maxRank != null && item?.maxCharges == null;
    const showAmber = (item?.maxAmberStars ?? 0) > 0;
    const showCyan = (item?.maxCyanStars ?? 0) > 0;

    const setNumber = (key: NumberKey, raw: string) =>
        setNumbers((prev) => ({ ...prev, [key]: digits(raw) }));

    const clearForm = () => {
        setNumbers({ ...EMPTY_NUMBERS });
        setErrors({});
    };

    // 物品切换时重置表单
    useEffect(() => {
        clearForm();
        setSubtype(hasSubtypes ? item!.subtypes![0] : "");
    }, [item, hasSubtypes]);

    // 必填 + 正整数（价格、数量）
    const validatePositive = (raw: string): string | undefined => {
        if (raw.trim() === "") return t("order.error.required");
        const n = numOrNull(raw);
        return n == null || n <= 0 ? t("order.error.format") : undefined;
    };

    // 必填 + 0..max 区间（等级、星数）
    const validateRange = (raw: string, max: number): string | undefined => {
        if (raw.trim() === "") return t("order.error.required");
        const n = numOrNull(raw);
        return n == null || n < 0 || n > max
            ? t("order.error.range", { max })
            : undefined;
    };

    const validate = (): FieldErrors => {
        const next: FieldErrors = {};
        next.platinum = validatePositive(numbers.platinum);
        next.quantity = validatePositive(numbers.quantity);
        if (showRank) next.rank = validateRange(numbers.rank, item!.maxRank!);
        if (showAmber)
            next.amberStars = validateRange(numbers.amberStars, item!.maxAmberStars!);
        if (showCyan)
            next.cyanStars = validateRange(numbers.cyanStars, item!.maxCyanStars!);
        return next;
    };

    const handleSubmit = async () => {
        if (!item) return;
        const errs = validate();
        setErrors(errs);
        if (Object.values(errs).some(Boolean)) return;

        try {
            const order = draftToSubmitOrder({
                itemId: item.id,
                orderType,
                visible,
                platinum: numOrNull(numbers.platinum) ?? undefined,
                quantity: numOrNull(numbers.quantity) ?? undefined,
                amberStars: showAmber
                    ? numOrNull(numbers.amberStars) ?? undefined
                    : undefined,
                cyanStars: showCyan
                    ? numOrNull(numbers.cyanStars) ?? undefined
                    : undefined,
                rank: showRank ? numOrNull(numbers.rank) ?? undefined : undefined,
                subtype: subtype !== "" ? subtype : undefined,
                tags: item.tags,
            });
            await createOrder.mutateAsync(order);
            toast.success(t("order.submit.success"));
            clearForm();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : String(e));
        }
    };

    const name = item ? itemDisplayName(item, lang) : "";

    // Combobox(base-ui)弹层默认 portal 到 body，会被 Dialog(radix)的焦点陷阱打断选中。
    // 改用此容器，把弹层渲染进 Dialog 内部，规避跨库冲突。
    const portalContainer = useRef<HTMLDivElement>(null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
            <DialogContent
                ref={portalContainer}
                showCloseButton={false}
                className="gap-0 p-0 sm:max-w-3xl"
            >
                {/* 内层裁剪圆角；弹层作为 DialogContent 直接子节点不受此 overflow 影响 */}
                <div className="flex overflow-hidden rounded-xl">
                    {/* 左侧物品展示面板（白底） */}
                    <div className="hidden w-56 shrink-0 flex-col justify-center border-r bg-white p-6 sm:flex dark:bg-muted">
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

                    {/* 右侧表单区 */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <DialogHeader className="flex-row items-center justify-between border-b p-4">
                            <DialogTitle className="text-lg">
                                {t("order.title")}
                            </DialogTitle>
                            <DialogClose asChild>
                                <Button variant="destructive" size="sm">
                                    {t("order.close")}
                                </Button>
                            </DialogClose>
                        </DialogHeader>

                        <FieldGroup className="flex-1 gap-4 bg-muted/30 p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel id="order-type-label">
                                        {t("order.field.type")}
                                    </FieldLabel>
                                    <div className="flex gap-2" aria-labelledby="order-type-label">
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
                                <Field className="items-end">
                                    <FieldLabel id="order-visibility-label">
                                        {t("order.field.visibility")}
                                    </FieldLabel>
                                    <div className="flex gap-2" aria-labelledby="order-visibility-label">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={visible ? "default" : "outline"}
                                            onClick={() => setVisible(true)}
                                        >
                                            {t("order.visible")}
                                            <Eye data-icon="inline-end" />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={!visible ? "default" : "outline"}
                                            onClick={() => setVisible(false)}
                                        >
                                            {t("order.invisible")}
                                            <EyeOff data-icon="inline-end" />
                                        </Button>
                                    </div>
                                </Field>
                            </div>

                            {/* 物品名称：弹窗内可随时搜索切换，不触发 SetInfo 查询 */}
                            <Field>
                                <FieldLabel id="order-item-label">
                                    {t("order.field.item")}
                                </FieldLabel>
                                <Combobox<Suggestion>
                                    items={matches}
                                    filter={null}
                                    inputValue={search}
                                    onInputValueChange={setSearch}
                                    onValueChange={(s) => {
                                        if (s) {
                                            setPickedSlug(s.slug);
                                            setSearch(s.name);
                                        }
                                    }}
                                    itemToStringLabel={(s) => s.name}
                                    autoHighlight
                                >
                                    <ComboboxInput
                                        className="w-full"
                                        aria-labelledby="order-item-label"
                                        placeholder={t("order.search.placeholder")}
                                        showTrigger={false}
                                        showClear
                                    />
                                    <ComboboxContent container={portalContainer}>
                                        <ComboboxEmpty>
                                            {t("market.search.no-match")}
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            {matches.map((s) => (
                                                <ComboboxItem key={s.slug} value={s}>
                                                    {s.name}
                                                </ComboboxItem>
                                            ))}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </Field>

                            <div
                                className={
                                    hasSubtypes
                                        ? "grid grid-cols-3 gap-4"
                                        : "grid grid-cols-2 gap-4"
                                }
                            >
                                <NumberField
                                    id="order-platinum"
                                    label={t("order.field.platinum")}
                                    placeholder={t("order.placeholder.platinum")}
                                    value={numbers.platinum}
                                    error={errors.platinum}
                                    onChange={(v) => setNumber("platinum", v)}
                                />
                                <NumberField
                                    id="order-quantity"
                                    label={t("order.field.quantity")}
                                    placeholder={t("order.placeholder.quantity")}
                                    value={numbers.quantity}
                                    error={errors.quantity}
                                    onChange={(v) => setNumber("quantity", v)}
                                />
                                {hasSubtypes && (
                                    <Field>
                                        <FieldLabel id="order-subtype-label">
                                            {t("order.field.subtype")}
                                        </FieldLabel>
                                        <Select value={subtype} onValueChange={setSubtype}>
                                            <SelectTrigger aria-labelledby="order-subtype-label">
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
                            </div>

                            {(showCyan || showAmber) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {showCyan && (
                                        <NumberField
                                            id="order-cyan"
                                            label={t("order.field.cyan-stars")}
                                            placeholder={`0-${item!.maxCyanStars}`}
                                            value={numbers.cyanStars}
                                            error={errors.cyanStars}
                                            onChange={(v) => setNumber("cyanStars", v)}
                                        />
                                    )}
                                    {showAmber && (
                                        <NumberField
                                            id="order-amber"
                                            label={t("order.field.amber-stars")}
                                            placeholder={`0-${item!.maxAmberStars}`}
                                            value={numbers.amberStars}
                                            error={errors.amberStars}
                                            onChange={(v) => setNumber("amberStars", v)}
                                        />
                                    )}
                                </div>
                            )}

                            {showRank && (
                                <NumberField
                                    id="order-rank"
                                    label={t("order.field.rank")}
                                    placeholder={`0-${item!.maxRank}`}
                                    value={numbers.rank}
                                    error={errors.rank}
                                    onChange={(v) => setNumber("rank", v)}
                                />
                            )}
                        </FieldGroup>

                        <div className="flex justify-end border-t bg-muted/30 p-4">
                            <Button
                                className="min-w-32"
                                disabled={!item || createOrder.isPending}
                                onClick={handleSubmit}
                            >
                                {createOrder.isPending ? (
                                    <Spinner data-icon="inline-start" />
                                ) : null}
                                {t("order.send")}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface NumberFieldProps {
    id: string;
    label: string;
    value: string;
    error?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

function NumberField({
    id,
    label,
    value,
    error,
    placeholder,
    onChange,
}: NumberFieldProps) {
    return (
        <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                inputMode="numeric"
                placeholder={placeholder}
                aria-invalid={error ? true : undefined}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error ? <FieldDescription>{error}</FieldDescription> : null}
        </Field>
    );
}
