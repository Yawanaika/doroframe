// 轻量多选：触发按钮展示已选项（Badge，可点 × 移除），下拉为可勾选列表。
// shadcn 无内置多选，基于 dropdown-menu + badge 自建。支持 max 上限（达上限后未选项禁用）。

import { ChevronDownIcon, XIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
    label: string;
    value: string;
}

interface Props {
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    /** 最多可选数量；达到后未选项不可再选 */
    max?: number;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    max,
    placeholder,
    disabled,
    className,
}: Props) {
    const atMax = max != null && value.length >= max;
    const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;

    const toggle = (v: string) => {
        if (value.includes(v)) {
            onChange(value.filter((x) => x !== v));
        } else if (!atMax) {
            onChange([...value, v]);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                disabled={disabled}
                className={cn(
                    "flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
            >
                <div className="flex flex-1 flex-wrap items-center gap-1">
                    {value.length === 0 ? (
                        <span className="text-muted-foreground">{placeholder}</span>
                    ) : (
                        value.map((v) => (
                            <Badge
                                key={v}
                                variant="secondary"
                                className="gap-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggle(v);
                                }}
                            >
                                {labelOf(v)}
                                <XIcon className="size-3" />
                            </Badge>
                        ))
                    )}
                </div>
                <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
            >
                {options.map((o) => {
                    const checked = value.includes(o.value);
                    return (
                        <DropdownMenuCheckboxItem
                            key={o.value}
                            checked={checked}
                            disabled={!checked && atMax}
                            // 阻止选中后菜单自动关闭，便于连续多选
                            onSelect={(e) => e.preventDefault()}
                            onCheckedChange={() => toggle(o.value)}
                        >
                            {o.label}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
