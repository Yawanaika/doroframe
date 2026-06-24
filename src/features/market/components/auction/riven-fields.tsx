// 紫卡创建表单字段：
// - RivenAttributeEditor：正/负词条编辑器（逐行选择器 + 带单位的数值输入）。
// - RivenMetaFields：极性 / Mod 名 / 段位 / 等级 / 循环。
// 二者由创建拍卖弹窗组合渲染；词条与元信息状态仍由弹窗持有（buildParams / 预览需要）。

import { useTranslation } from "react-i18next";
import { PlusIcon, XIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AttributeCombobox } from "@/features/market/components/auction/attribute-combobox";
import { PolaritySelect } from "@/features/market/components/auction/polarity-select";
import { CREATE_POLARITIES } from "@/features/market/auction-constants";
import type {
    AttrMeta,
    WeaponGroup,
} from "@/features/market/use-auction-search-data";
import {
    type AttrInput,
    MAX_POSITIVE,
    MIN_POSITIVE,
    unitSymbol,
} from "@/features/market/create-auction-shared";

type Container = React.ComponentProps<typeof AttributeCombobox>["container"];

// 三列：词条选择器 | 数值 | 删除按钮（无可删时占位对齐）
const ROW = "grid grid-cols-[1fr_7rem_2rem] items-center gap-2";

/** 词条数值输入：右侧附加单位符号（% / ×）；未选词条时禁用 */
function AttrValueInput({
    value,
    onChange,
    symbol,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    symbol: string;
    disabled?: boolean;
}) {
    return (
        <InputGroup>
            <InputGroupInput
                inputMode="decimal"
                placeholder="0.00"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />
            {symbol && (
                <InputGroupAddon align="inline-end">{symbol}</InputGroupAddon>
            )}
        </InputGroup>
    );
}

export function RivenAttributeEditor({
    positives,
    negative,
    positiveGroups,
    negativeGroups,
    attrMeta,
    container,
    setPos,
    addPos,
    removePos,
    setNegative,
}: {
    positives: AttrInput[];
    negative: AttrInput;
    positiveGroups: WeaponGroup[];
    negativeGroups: WeaponGroup[];
    attrMeta: (slug: string) => AttrMeta | undefined;
    container: Container;
    setPos: (i: number, patch: Partial<AttrInput>) => void;
    addPos: () => void;
    removePos: (i: number) => void;
    setNegative: React.Dispatch<React.SetStateAction<AttrInput>>;
}) {
    const { t } = useTranslation();
    // 已选正面 slug，供负面选择器排除（同一词条不可重复选择）
    const positiveSlugs = positives.map((r) => r.slug).filter(Boolean);
    return (
        <div className="flex flex-col gap-4">
            {/* 正面词条 */}
            <div className="flex flex-col gap-2">
                <div className={ROW}>
                    <FieldLabel className="text-emerald-600 dark:text-emerald-500">
                        {t("auction.field.positive")}
                    </FieldLabel>
                    <FieldLabel className="text-emerald-600 dark:text-emerald-500">
                        {t("auction.field.value")}
                    </FieldLabel>
                    <span />
                </div>
                {positives.map((row, i) => {
                    // 排除其它正面行 + 负面已选
                    const exclude = new Set(
                        [
                            ...positives.filter((_, idx) => idx !== i).map((r) => r.slug),
                            negative.slug,
                        ].filter(Boolean),
                    );
                    const removable = positives.length > MIN_POSITIVE;
                    return (
                        <div key={i} className={ROW}>
                            <AttributeCombobox
                                groups={positiveGroups}
                                value={row.slug}
                                onValueChange={(v) => setPos(i, { slug: v })}
                                exclude={exclude}
                                container={container}
                            />
                            <AttrValueInput
                                value={row.value}
                                onChange={(v) => setPos(i, { value: v })}
                                symbol={unitSymbol(attrMeta(row.slug)?.unit)}
                            />
                            {removable ? (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removePos(i)}
                                >
                                    <XIcon className="size-4" />
                                </Button>
                            ) : (
                                <span />
                            )}
                        </div>
                    );
                })}
                {positives.length < MAX_POSITIVE && (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-fit"
                        onClick={addPos}
                    >
                        <PlusIcon className="size-4" />
                        {t("auction.field.addAttr")}
                    </Button>
                )}
            </div>

            {/* 负面词条 */}
            <div className="flex flex-col gap-2">
                <div className={ROW}>
                    <FieldLabel className="text-destructive">
                        {t("auction.field.negative")}
                    </FieldLabel>
                    <FieldLabel className="text-destructive">
                        {t("auction.field.value")}
                    </FieldLabel>
                    <span />
                </div>
                <div className={ROW}>
                    <AttributeCombobox
                        groups={negativeGroups}
                        value={negative.slug}
                        onValueChange={(v) => setNegative((r) => ({ ...r, slug: v }))}
                        exclude={new Set(positiveSlugs)}
                        container={container}
                        placeholder={t("auction.negative.none")}
                    />
                    <AttrValueInput
                        value={negative.value}
                        onChange={(v) => setNegative((r) => ({ ...r, value: v }))}
                        symbol={unitSymbol(attrMeta(negative.slug)?.unit)}
                        disabled={!negative.slug}
                    />
                    <span />
                </div>
            </div>
        </div>
    );
}

export function RivenMetaFields({
    polarity,
    setPolarity,
    modName,
    setModName,
    modNameOptions,
    mr,
    setMr,
    modRank,
    setModRank,
    reRolls,
    setReRolls,
}: {
    polarity: string;
    setPolarity: (v: string) => void;
    modName: string;
    setModName: (v: string) => void;
    modNameOptions: string[];
    mr: string;
    setMr: (v: string) => void;
    modRank: string;
    setModRank: (v: string) => void;
    reRolls: string;
    setReRolls: (v: string) => void;
}) {
    const { t } = useTranslation();
    const onlyDigits = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
        set(e.target.value.replace(/\D/g, ""));
    return (
        <>
            {/* 极性 + Mod 名 */}
            <div className="grid grid-cols-[1fr_2fr] gap-3">
                <Field>
                    <FieldLabel>{t("auction.field.polarity")}</FieldLabel>
                    <PolaritySelect
                        value={polarity}
                        onValueChange={setPolarity}
                        options={CREATE_POLARITIES}
                    />
                </Field>
                <Field>
                    <FieldLabel>{t("auction.field.modName")}</FieldLabel>
                    <Select
                        value={modName}
                        onValueChange={setModName}
                        disabled={modNameOptions.length === 0}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("auction.field.modNamePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {modNameOptions.map((n) => (
                                <SelectItem key={n} value={n}>
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            {/* 段位 / 等级 / 循环 */}
            <div className="grid grid-cols-3 gap-3">
                <Field>
                    <FieldLabel>{t("auction.field.mastery")}</FieldLabel>
                    <Input inputMode="numeric" value={mr} onChange={onlyDigits(setMr)} />
                </Field>
                <Field>
                    <FieldLabel>{t("auction.field.modRank")}</FieldLabel>
                    <Input
                        inputMode="numeric"
                        value={modRank}
                        onChange={onlyDigits(setModRank)}
                    />
                </Field>
                <Field>
                    <FieldLabel>{t("auction.field.reRolls")}</FieldLabel>
                    <Input
                        inputMode="numeric"
                        value={reRolls}
                        onChange={onlyDigits(setReRolls)}
                    />
                </Field>
            </div>
        </>
    );
}
