// 创建拍卖弹窗的共享类型、常量与词条数值格式化工具。

/** 一条词条输入：slug + 数值（字符串，便于受控输入） */
export interface AttrInput {
    slug: string;
    value: string;
}

/** 正面词条数量上下限（紫卡 2~3 条正面 + 至多 1 条负面） */
export const MAX_POSITIVE = 3;
export const MIN_POSITIVE = 2;

/** 字符串转数值；空串/非法返回 undefined */
export const num = (v: string): number | undefined => {
    if (v.trim() === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

/** 词条单位对应的数值后缀符号：百分比 % / 乘法 × */
export const unitSymbol = (unit?: string): string =>
    unit === "percent" ? "%" : unit === "multiply" ? "×" : "";

/**
 * 卡面词条文本：`符号 数值[单位] 名称`。
 * - multiply：一律为乘法，无正负号，形如 `×2.5 名称`。
 * - 其余：正面 +/负面 −；positiveIsNegative（如后坐力）时正负号反向；percent 追加 %。
 */
export const formatStat = (
    value: string,
    name: string,
    positiveSection: boolean,
    meta?: { unit?: string; positiveIsNegative?: boolean },
): string => {
    const v = value.trim() === "" ? "0" : value.trim();
    if (meta?.unit === "multiply") return `×${v} ${name}`.trim();
    const positive = meta?.positiveIsNegative ? !positiveSection : positiveSection;
    const sign = positive ? "+" : "−";
    const pct = meta?.unit === "percent" ? "%" : "";
    return `${sign}${v}${pct} ${name}`.trim();
};
