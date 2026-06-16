import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Suggestion } from "../queries";

interface Props {
    suggestions: Suggestion[];
    onSelect: (slug: string, name: string) => void;
    /** 外部受控的输入值（套装点击切换时同步回填） */
    value: string;
    onValueChange: (v: string) => void;
    placeholder?: string;
}

interface Rect {
    left: number;
    top: number;
    width: number;
}

/** 物品搜索框：输入过滤建议，下拉经 portal 渲染在输入框下方，避免被 Card overflow 裁剪 */
export function SearchBar({
    suggestions,
    onSelect,
    value,
    onValueChange,
    placeholder,
}: Props) {
    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<Rect | null>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const matches = useMemo(() => {
        const q = value.trim().toLowerCase();
        if (!q) return [];
        return suggestions
            .filter((s) => s.name.toLowerCase().includes(q))
            .slice(0, 20);
    }, [value, suggestions]);

    const showList = open && matches.length > 0;

    // 下拉用 fixed 定位贴在输入框下沿；开启时及滚动/缩放时重算锚点
    useLayoutEffect(() => {
        if (!showList) return;
        const measure = () => {
            const el = wrapRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            setRect({ left: r.left, top: r.bottom, width: r.width });
        };
        measure();
        window.addEventListener("scroll", measure, true);
        window.addEventListener("resize", measure);
        return () => {
            window.removeEventListener("scroll", measure, true);
            window.removeEventListener("resize", measure);
        };
    }, [showList]);

    const submit = (s: Suggestion) => {
        onValueChange(s.name);
        setOpen(false);
        onSelect(s.slug, s.name);
    };

    const submitBest = () => {
        const q = value.trim().toLowerCase();
        const exact = suggestions.find((s) => s.name.toLowerCase() === q);
        const target = exact ?? matches[0];
        if (target) submit(target);
    };

    return (
        <div className="flex items-center gap-2">
            <div ref={wrapRef} className="flex-1">
                <Input
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => {
                        onValueChange(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 120)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submitBest();
                    }}
                />
                {showList &&
                    rect &&
                    createPortal(
                        <ul
                            className="fixed z-50 max-h-72 overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
                            style={{
                                left: rect.left,
                                top: rect.top + 4,
                                width: rect.width,
                            }}
                        >
                            {matches.map((s) => (
                                <li key={s.slug}>
                                    <button
                                        type="button"
                                        className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                                        // mousedown 抢在 input blur 之前，避免下拉先被收起
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => submit(s)}
                                    >
                                        {s.name}
                                    </button>
                                </li>
                            ))}
                        </ul>,
                        document.body,
                    )}
            </div>
            <Button size="icon" onClick={submitBest} aria-label="search">
                <SearchIcon />
            </Button>
        </div>
    );
}
