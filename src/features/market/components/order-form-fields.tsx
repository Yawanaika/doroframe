import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

/** 下单/改单表单共用的字段级错误信息 */
export interface FieldErrors {
    platinum?: string;
    quantity?: string;
    perTrade?: string;
    rank?: string;
    amberStars?: string;
    cyanStars?: string;
}

/** 字符串 → 数值；空串或非有限数返回 null */
export const numOrNull = (v: string): number | null => {
    if (v.trim() === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

/** 只保留数字字符，用于受控数值输入框过滤 */
export const digits = (v: string): string => v.replace(/\D/g, "");

/** 数值 → 字符串；null/undefined 返回空串，用于预填表单 */
export const numToStr = (v: number | null | undefined): string =>
    v == null ? "" : String(v);

/** 必填 + 正整数（价格、数量） */
export const validatePositive = (
    raw: string,
    t: TFunction,
): string | undefined => {
    if (raw.trim() === "") return t("order.error.required");
    const n = numOrNull(raw);
    return n == null || n <= 0 ? t("order.error.format") : undefined;
};

/** 必填 + 0..max 区间（等级、星数） */
export const validateRange = (
    raw: string,
    max: number,
    t: TFunction,
): string | undefined => {
    if (raw.trim() === "") return t("order.error.required");
    const n = numOrNull(raw);
    return n == null || n < 0 || n > max
        ? t("order.error.range", { max })
        : undefined;
};

/** 批量交易：数量必须为批次大小的正整数倍 */
export const validateMultiple = (
    quantity: string,
    perTrade: string,
    t: TFunction,
): string | undefined => {
    const q = numOrNull(quantity);
    const n = numOrNull(perTrade);
    if (q == null || n == null || n <= 0) return undefined;
    return q % n !== 0 ? t("order.error.multiple") : undefined;
};

interface OrderFormFields {
    id: string;
    label: string;
    value: string;
    error?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

/** 受控数值输入字段：带标签与错误提示，下单/改单弹窗共用 */
export function NumberField({
    id,
    label,
    value,
    error,
    placeholder,
    onChange,
}: OrderFormFields) {
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

/** 每单位价格：每批价格 / 批次大小，四舍五入保留两位小数；无法计算返回空串 */
export const unitPrice = (platinum: string, perTrade: string): string => {
    const p = numOrNull(platinum);
    const n = numOrNull(perTrade);
    if (p == null || n == null || n <= 0) return "";
    return (Math.round((p / n) * 100) / 100).toFixed(2);
};

/**
 * 批量交易字段组：每批价格(platinum) = 批次大小(perTrade) × 每单位价格(只读计算值)。
 * 仅在物品 bulkTradable 且开启批量交易时展示，参考 public/img.png 布局。
 */
export function BulkTradeFields({
    platinum,
    perTrade,
    platinumError,
    perTradeError,
    onPlatinumChange,
    onPerTradeChange,
}: {
    platinum: string;
    perTrade: string;
    platinumError?: string;
    perTradeError?: string;
    onPlatinumChange: (v: string) => void;
    onPerTradeChange: (v: string) => void;
}) {
    const { t } = useTranslation();
    return (
        <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-end gap-2">
                <NumberField
                    id="order-bulk-platinum"
                    label={t("order.field.bulk-platinum")}
                    placeholder={t("order.placeholder.platinum")}
                    value={platinum}
                    error={platinumError}
                    onChange={onPlatinumChange}
                />
                <span className="pb-2 text-muted-foreground">=</span>
                <NumberField
                    id="order-per-trade"
                    label={t("order.field.per-trade")}
                    placeholder={t("order.placeholder.per-trade")}
                    value={perTrade}
                    error={perTradeError}
                    onChange={onPerTradeChange}
                />
                <span className="pb-2 text-muted-foreground">×</span>
                <Field>
                    <FieldLabel htmlFor="order-unit-price">
                        {t("order.field.unit-price")}
                    </FieldLabel>
                    <Input
                        id="order-unit-price"
                        readOnly
                        tabIndex={-1}
                        className="bg-muted/50 text-muted-foreground"
                        value={unitPrice(platinum, perTrade)}
                    />
                </Field>
            </div>
        </div>
    );
}

/** 批量交易开关：标签 + Switch，仅 bulkTradable 物品展示 */
export function BulkTradeToggle({
    enabled,
    onChange,
    "aria-labelledby": ariaLabelledby,
}: {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    "aria-labelledby"?: string;
}) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground" id={ariaLabelledby}>
                {t("order.field.bulk-trade")}
            </span>
            <Switch
                checked={enabled}
                onCheckedChange={onChange}
                aria-labelledby={ariaLabelledby}
            />
        </div>
    );
}

/** 可见 / 不可见 二选一切换按钮组，下单/改单弹窗共用 */
export function VisibilityToggle({
    visible,
    onChange,
    "aria-labelledby": ariaLabelledby,
}: {
    visible: boolean;
    onChange: (visible: boolean) => void;
    "aria-labelledby"?: string;
}) {
    const { t } = useTranslation();
    return (
        <div className="flex gap-2" aria-labelledby={ariaLabelledby}>
            <Button
                type="button"
                size="sm"
                variant={visible ? "default" : "outline"}
                onClick={() => onChange(true)}
            >
                {t("order.visible")}
                <Eye data-icon="inline-end" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={!visible ? "default" : "outline"}
                onClick={() => onChange(false)}
            >
                {t("order.invisible")}
                <EyeOff data-icon="inline-end" />
            </Button>
        </div>
    );
}
