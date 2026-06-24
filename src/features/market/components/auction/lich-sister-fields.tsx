// lich/sister 创建表单字段：元素 / 幻纹 / 伤害 / 怪癖。
// 怪癖候选项在本组件内按输入过滤（仅本分支使用）。

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    type AuctionSearchData,
    type Option,
} from "@/features/market/use-auction-search-data";
import {
    CREATE_ELEMENTS,
    type SearchTypeCode,
} from "@/features/market/auction-constants";

type Container = React.ComponentProps<typeof ComboboxContent>["container"];

export function LichSisterFields({
    data,
    type,
    element,
    setElement,
    hasEphemera,
    setHasEphemera,
    damage,
    setDamage,
    quirkInput,
    setQuirkInput,
    setQuirkSlug,
    container,
}: {
    data: AuctionSearchData;
    type: SearchTypeCode;
    element: string;
    setElement: (v: string) => void;
    hasEphemera: boolean;
    setHasEphemera: (v: boolean) => void;
    damage: string;
    setDamage: (v: string) => void;
    quirkInput: string;
    setQuirkInput: (v: string) => void;
    setQuirkSlug: (v: string) => void;
    container: Container;
}) {
    const { t } = useTranslation();
    const quirkOptions = data.quirkOptions(type);
    const quirkMatches = useMemo(() => {
        const q = quirkInput.trim().toLowerCase();
        const base = q
            ? quirkOptions.filter((o) => o.label.toLowerCase().includes(q))
            : quirkOptions;
        return base.slice(0, 20);
    }, [quirkInput, quirkOptions]);

    return (
        <div className="grid grid-cols-2 gap-3">
            <Field>
                <FieldLabel>{t("auction.field.element")}</FieldLabel>
                <Select value={element} onValueChange={setElement}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {CREATE_ELEMENTS.map((e) => (
                            <SelectItem key={e} value={e}>
                                {t(`auction.element.${e}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
            <Field>
                <FieldLabel>{t("auction.field.ephemera")}</FieldLabel>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={hasEphemera ? "default" : "outline"}
                        onClick={() => setHasEphemera(true)}
                    >
                        {t("auction.ephemera.yes")}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={!hasEphemera ? "default" : "outline"}
                        onClick={() => setHasEphemera(false)}
                    >
                        {t("auction.ephemera.no")}
                    </Button>
                </div>
            </Field>
            <Field>
                <FieldLabel>{t("auction.field.damage")}</FieldLabel>
                <Input
                    inputMode="decimal"
                    value={damage}
                    onChange={(e) => setDamage(e.target.value)}
                />
            </Field>
            <Field>
                <FieldLabel>{t("auction.field.quirk")}</FieldLabel>
                <Combobox<Option>
                    items={quirkMatches}
                    filter={null}
                    inputValue={quirkInput}
                    onInputValueChange={(v) => {
                        setQuirkInput(v);
                        if (v.trim() === "") setQuirkSlug("");
                    }}
                    onValueChange={(o) => {
                        if (o) {
                            setQuirkSlug(o.value);
                            setQuirkInput(o.label);
                        }
                    }}
                    itemToStringLabel={(o) => o.label}
                    autoHighlight
                >
                    <ComboboxInput className="w-full" showTrigger={false} showClear />
                    <ComboboxContent container={container}>
                        <ComboboxEmpty>{t("market.search.no-match")}</ComboboxEmpty>
                        <ComboboxList>
                            {quirkMatches.map((o) => (
                                <ComboboxItem key={o.value} value={o}>
                                    {o.label}
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </Field>
        </div>
    );
}
