// 紫卡词条选择器：按 group（通用/近战）分组的 Combobox。
// - AttributeCombobox：单选，用于创建拍卖弹窗的逐行词条。
// - AttributeMultiCombobox：多选（chips），用于搜索栏的正/负词条，受 max 上限约束。

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox";
import type {
    Option,
    WeaponGroup,
} from "@/features/market/use-auction-search-data";

type Container = React.ComponentProps<typeof ComboboxContent>["container"];

/** 组名本地化（缺失回退原始 key）；空 key 不显示标签（如 none/has 自定义组） */
function useGroupLabel() {
    const { t } = useTranslation();
    return (key: string) =>
        key ? t(`auction.attrGroup.${key}`, { defaultValue: key }) : "";
}

/** 按输入文本过滤分组，丢弃空组；组标签经 i18n 本地化 */
function useFilteredGroups(groups: WeaponGroup[], query: string) {
    const groupLabel = useGroupLabel();
    return useMemo(() => {
        const q = query.trim().toLowerCase();
        const out: { value: string; items: Option[] }[] = [];
        for (const g of groups) {
            const matched = q
                ? g.items.filter((o) => o.label.toLowerCase().includes(q))
                : g.items;
            if (matched.length === 0) continue;
            out.push({ value: groupLabel(g.key), items: matched });
        }
        return out;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groups, query]);
}

function renderGroups(matches: { value: string; items: Option[] }[]) {
    return matches.map((group) => (
        <ComboboxGroup key={group.value || "ungrouped"} items={group.items}>
            {group.value ? <ComboboxLabel>{group.value}</ComboboxLabel> : null}
            <ComboboxCollection>
                {(o: Option) => (
                    <ComboboxItem key={o.value} value={o}>
                        {o.label}
                    </ComboboxItem>
                )}
            </ComboboxCollection>
        </ComboboxGroup>
    ));
}

interface SingleProps {
    /** 按 group 分好的词条选项 */
    groups: WeaponGroup[];
    /** 选中词条 slug（空串=未选） */
    value: string;
    onValueChange: (slug: string) => void;
    container?: Container;
    placeholder?: string;
}

/** 单选分组词条 Combobox（创建弹窗逐行用） */
export function AttributeCombobox({
    groups,
    value,
    onValueChange,
    container,
    placeholder,
}: SingleProps) {
    const { t } = useTranslation();

    // 选中 slug → 展示名，用于输入框回填
    const selectedLabel = useMemo(() => {
        for (const g of groups)
            for (const o of g.items) if (o.value === value) return o.label;
        return "";
    }, [groups, value]);

    const [inputValue, setInputValue] = useState(selectedLabel);
    // 外部 value 变化（如切武器后剔除、切正负号清空）时同步输入框
    useEffect(() => setInputValue(selectedLabel), [selectedLabel]);

    const matches = useFilteredGroups(groups, inputValue);

    return (
        <Combobox<Option>
            items={matches}
            filter={null}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            onValueChange={(o) => {
                onValueChange(o?.value ?? "");
                setInputValue(o?.label ?? "");
            }}
            itemToStringLabel={(o) => o.label}
            autoHighlight
        >
            <ComboboxInput
                className="w-full"
                placeholder={placeholder ?? t("auction.field.attribute")}
                showTrigger={false}
                showClear
            />
            <ComboboxContent container={container}>
                <ComboboxEmpty>{t("market.search.no-match")}</ComboboxEmpty>
                <ComboboxList>{renderGroups(matches)}</ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

interface MultiProps {
    /** 按 group 分好的词条选项 */
    groups: WeaponGroup[];
    /** 已选词条 slug 列表 */
    value: string[];
    onChange: (slugs: string[]) => void;
    /** 最多可选数量；达到后未选项不可再选 */
    max?: number;
    container?: Container;
    placeholder?: string;
}

/** 多选分组词条 Combobox（搜索栏正/负词条用） */
export function AttributeMultiCombobox({
    groups,
    value,
    onChange,
    max,
    container,
    placeholder,
}: MultiProps) {
    const { t } = useTranslation();
    const anchor = useComboboxAnchor();
    const [inputValue, setInputValue] = useState("");

    // slug → 展示名（含自定义组），用于 chips 回填
    const labelOf = useMemo(() => {
        const m = new Map<string, string>();
        for (const g of groups) for (const o of g.items) m.set(o.value, o.label);
        return m;
    }, [groups]);

    // 受控选中态转为 Option[]（base-ui 多选以条目对象为值）
    const selected = useMemo<Option[]>(
        () => value.map((v) => ({ value: v, label: labelOf.get(v) ?? v })),
        [value, labelOf],
    );

    const atMax = max != null && value.length >= max;
    const matches = useFilteredGroups(groups, inputValue);

    return (
        <Combobox<Option, true>
            items={matches}
            multiple
            filter={null}
            value={selected}
            isItemEqualToValue={(a, b) => a.value === b.value}
            onValueChange={(next) => {
                const slugs = next.map((o) => o.value);
                // 超过上限则拒绝本次新增（移除不受限，长度只会减少）
                if (max != null && slugs.length > max) return;
                onChange(slugs);
                setInputValue("");
            }}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            itemToStringLabel={(o) => o.label}
            autoHighlight
        >
            <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                    {(items: Option[]) =>
                        items.map((o) => (
                            <ComboboxChip key={o.value} aria-label={labelOf.get(o.value)}>
                                {labelOf.get(o.value) ?? o.label}
                            </ComboboxChip>
                        ))
                    }
                </ComboboxValue>
                <ComboboxChipsInput
                    placeholder={value.length === 0 ? placeholder : undefined}
                />
            </ComboboxChips>
            <ComboboxContent anchor={anchor} container={container}>
                <ComboboxEmpty>{t("market.search.no-match")}</ComboboxEmpty>
                <ComboboxList>
                    {matches.map((group) => (
                        <ComboboxGroup
                            key={group.value || "ungrouped"}
                            items={group.items}
                        >
                            {group.value ? (
                                <ComboboxLabel>{group.value}</ComboboxLabel>
                            ) : null}
                            <ComboboxCollection>
                                {(o: Option) => (
                                    <ComboboxItem
                                        key={o.value}
                                        value={o}
                                        disabled={atMax && !value.includes(o.value)}
                                    >
                                        {o.label}
                                    </ComboboxItem>
                                )}
                            </ComboboxCollection>
                        </ComboboxGroup>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
