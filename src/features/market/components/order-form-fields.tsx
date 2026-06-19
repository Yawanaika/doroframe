import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button";

/** 下单/改单表单共用的字段级错误信息 */
export interface FieldErrors {
    platinum?: string;
    quantity?: string;
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
