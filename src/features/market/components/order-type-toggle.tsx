import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { OrderTypeCode } from "../constants";

interface Props {
    value: OrderTypeCode;
    onChange: (value: OrderTypeCode) => void;
    "aria-labelledby"?: string;
}

/** 卖/买切换。页面行情筛选与下单弹窗共用，保证两处行为与外观一致。 */
export function OrderTypeToggle({ value, onChange, ...rest }: Props) {
    const { t } = useTranslation();
    return (
        <div className="flex gap-2" {...rest}>
            <Button
                type="button"
                size="sm"
                variant={value === "sell" ? "default" : "outline"}
                onClick={() => onChange("sell")}
            >
                {t("market.type.sell")}
            </Button>
            <Button
                type="button"
                size="sm"
                variant={value === "buy" ? "default" : "outline"}
                onClick={() => onChange("buy")}
            >
                {t("market.type.buy")}
            </Button>
        </div>
    );
}
