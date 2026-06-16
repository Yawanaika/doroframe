import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import type { Suggestion } from "../queries";

interface Props {
    suggestions: Suggestion[];
    onSelect: (slug: string, name: string) => void;
    /** 外部受控的输入值（套装点击切换时同步回填） */
    value: string;
    onValueChange: (v: string) => void;
    placeholder?: string;
}

/**
 * 物品搜索框：基于 base-ui Combobox。
 * 下拉走 Combobox 自带的 Portal + Positioner，天然不被 Card overflow 裁剪。
 * 候选项本地预过滤并截断，避免一次渲染全量物品列表。
 */
export function SearchBar({
    suggestions,
    onSelect,
    value,
    onValueChange,
    placeholder,
}: Props) {
    const { t } = useTranslation();
    const matches = useMemo(() => {
        const q = value.trim().toLowerCase();
        if (!q) return [];
        return suggestions
            .filter((s) => s.name.toLowerCase().includes(q))
            .slice(0, 20);
    }, [value, suggestions]);

    const pick = (s: Suggestion) => {
        onValueChange(s.name);
        onSelect(s.slug, s.name);
    };

    // 搜索按钮：精确匹配优先，否则取第一条候选
    const submitBest = () => {
        const q = value.trim().toLowerCase();
        const exact = suggestions.find((s) => s.name.toLowerCase() === q);
        const target = exact ?? matches[0];
        if (target) pick(target);
    };

    return (
        <div className="flex items-center gap-2">
            <Combobox<Suggestion>
                items={matches}
                // 已本地预过滤，关掉内置过滤避免二次筛选
                filter={null}
                inputValue={value}
                onInputValueChange={(v) => onValueChange(v)}
                onValueChange={(item) => {
                    if (item) pick(item);
                }}
                itemToStringLabel={(s) => s.name}
                autoHighlight
            >
                <ComboboxInput
                    className="flex-1"
                    placeholder={placeholder}
                    showTrigger={false}
                    showClear
                />
                <ComboboxContent>
                    <ComboboxEmpty>{t("market.search.no-match")}</ComboboxEmpty>
                    <ComboboxList>
                        {matches.map((s) => (
                            <ComboboxItem key={s.slug} value={s}>
                                {s.name}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            <Button size="icon" onClick={submitBest} aria-label="search">
                <SearchIcon />
            </Button>
        </div>
    );
}
