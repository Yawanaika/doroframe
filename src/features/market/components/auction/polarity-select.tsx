// 极性选择器。拍卖搜索栏（含 any）与创建拍卖弹窗（去 any）共用。
// 选项以极性图标（mask 着色）+ 本地化名展示。

import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { POLARITIES } from "@/features/market/auction-constants";

interface Props {
    value: string;
    onValueChange: (value: string) => void;
    /** 可选项；默认全部极性（含 any）。创建拍卖传 CREATE_POLARITIES（去 any） */
    options?: readonly string[];
}

export function PolaritySelect({
    value,
    onValueChange,
    options = POLARITIES,
}: Props) {
    const { t } = useTranslation();
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((p) => (
                    <SelectItem key={p} value={p} className="flex">
                        <div
                            className="size-4 bg-primary"
                            style={{
                                maskImage: `url(/images/polarity/POLARITY_${p}.png)`,
                                WebkitMaskImage: `url(/images/polarity/POLARITY_${p}.png)`,
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                            }}
                        />
                        {t(`auction.polarity.${p}`)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
