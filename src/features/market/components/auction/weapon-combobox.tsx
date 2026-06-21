// 武器搜索框：按 group 分组的 Combobox。拍卖搜索栏与创建拍卖弹窗共用，保证交互一致。

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
} from "@/components/ui/combobox";
import type {
    Option,
    WeaponGroup,
} from "@/features/market/use-auction-search-data";

/** 武器下拉一次最多渲染的条目数（跨分组累计），避免一次性渲染数百项 */
const WEAPON_LIMIT = 50;

interface Props {
    /** 按 group 分好的武器选项（data.weaponGroups(type)） */
    groups: WeaponGroup[];
    /** 输入框文本（受控） */
    inputValue: string;
    onInputValueChange: (value: string) => void;
    /** 选中某个武器选项；清空时回调 null */
    onValueChange: (option: Option | null) => void;
    /** 弹层 portal 容器（Dialog 内需指定，规避 radix 焦点陷阱打断选中） */
    container?: React.ComponentProps<typeof ComboboxContent>["container"];
    placeholder?: string;
}

export function WeaponCombobox({
    groups,
    inputValue,
    onInputValueChange,
    onValueChange,
    container,
    placeholder,
}: Props) {
    const { t } = useTranslation();

    // 过滤后逐组累计截断至 WEAPON_LIMIT，丢弃空组；组名经 i18n 本地化（缺失回退原始值）
    const matches = useMemo(() => {
        const q = inputValue.trim().toLowerCase();
        const out: { value: string; items: Option[] }[] = [];
        let count = 0;
        for (const g of groups) {
            if (count >= WEAPON_LIMIT) break;
            const matched = q
                ? g.items.filter((o) => o.label.toLowerCase().includes(q))
                : g.items;
            if (matched.length === 0) continue;
            const items = matched.slice(0, WEAPON_LIMIT - count);
            count += items.length;
            // value 既作 React key 又作组标签；空 key（lich/sister）不显示标签。
            out.push({
                value: g.key
                    ? t(`auction.group.${g.key}`, { defaultValue: g.key })
                    : "",
                items,
            });
        }
        return out;
    }, [inputValue, groups, t]);

    return (
        <Combobox<Option>
            items={matches}
            filter={null}
            inputValue={inputValue}
            onInputValueChange={onInputValueChange}
            onValueChange={(o) => onValueChange(o ?? null)}
            itemToStringLabel={(o) => o.label}
            autoHighlight
        >
            <ComboboxInput
                className="w-full"
                placeholder={placeholder ?? t("auction.field.weapon")}
                showTrigger={false}
                showClear
            />
            <ComboboxContent container={container}>
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
                                    <ComboboxItem key={o.value} value={o}>
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
