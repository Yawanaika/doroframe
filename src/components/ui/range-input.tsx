// 数值区间筛选：两个可为空的输入框（最小 / 最大），受控。
// 失焦时按边界规则夹取：
//   最小值——下限固定为 min，上限为已填的最大值（未填则为 max）；
//   最大值——上限固定为 max，下限为已填的最小值（未填则为 min）。
// 例如 min=25 max=60：最大值为空时最小值输入 61→60、23→25；两者都有值时互为边界。

import { Input } from "@/components/ui/input";
import { cn, clamp } from "@/lib/utils";

interface Props {
    /** 允许的下限 */
    min: number;
    /** 允许的上限 */
    max: number;
    step?: number;
    minValue: string;
    maxValue: string;
    onMinChange: (value: string) => void;
    onMaxChange: (value: string) => void;
    minPlaceholder?: string;
    maxPlaceholder?: string;
    className?: string;
}

// 仅保留数字与单个小数点
function sanitize(raw: string): string {
    const cleaned = raw.replace(/[^\d.]/g, "");
    const [head, ...rest] = cleaned.split(".");
    return rest.length ? `${head}.${rest.join("")}` : head;
}

export function RangeInput({
    min,
    max,
    step = 0.01,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
    minPlaceholder,
    maxPlaceholder,
    className,
}: Props) {
    // 最小值失焦：下限固定为 min，上限为已填的最大值，否则为 max
    const handleMinBlur = () => {
        if (minValue === "") return;
        const upper = maxValue === "" ? max : Number(maxValue);
        onMinChange(String(clamp(Number(minValue), min, upper)));
    };
    // 最大值失焦：上限固定为 max，下限为已填的最小值，否则为 min
    const handleMaxBlur = () => {
        if (maxValue === "") return;
        const lower = minValue === "" ? min : Number(minValue);
        onMaxChange(String(clamp(Number(maxValue), lower, max)));
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <Input
                type="number"
                inputMode="decimal"
                step={step}
                min={min}
                max={maxValue === "" ? max : maxValue}
                placeholder={minPlaceholder}
                value={minValue}
                onChange={(e) => onMinChange(sanitize(e.target.value))}
                onBlur={handleMinBlur}
            />
            <span className="text-muted-foreground">-</span>
            <Input
                type="number"
                inputMode="decimal"
                step={step}
                min={minValue === "" ? min : minValue}
                max={max}
                placeholder={maxPlaceholder}
                value={maxValue}
                onChange={(e) => onMaxChange(sanitize(e.target.value))}
                onBlur={handleMaxBlur}
            />
        </div>
    );
}
