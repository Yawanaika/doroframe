import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { DucatsPeriod } from "@/features/market/use-ducats";

interface Props {
    value: DucatsPeriod;
    onChange: (value: DucatsPeriod) => void;
}

const OPTIONS: { value: DucatsPeriod; labelKey: string }[] = [
    { value: "previousHour", labelKey: "market.ducats.period.hour" },
    { value: "previousDay", labelKey: "market.ducats.period.day" },
];

/** 统计时段切换：上一小时 / 上一天。 */
export function PeriodToggle({ value, onChange }: Props) {
    const { t } = useTranslation();
    return (
        <div className="flex gap-2">
            {OPTIONS.map((opt) => (
                <Button
                    key={opt.value}
                    type="button"
                    size="sm"
                    variant={value === opt.value ? "default" : "outline"}
                    onClick={() => onChange(opt.value)}
                >
                    {t(opt.labelKey)}
                </Button>
            ))}
        </div>
    );
}
