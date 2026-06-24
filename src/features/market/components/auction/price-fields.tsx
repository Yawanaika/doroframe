// 创建拍卖的价格段：direct 仅固定售价；auction 为起标 + 买断(∞) + 最低信誉。

import { useTranslation } from "react-i18next";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BuyoutPolicyCode } from "@/features/market/auction-constants";

export function PriceFields({
    policy,
    startingPrice,
    setStartingPrice,
    buyoutPrice,
    setBuyoutPrice,
    minimalReputation,
    setMinimalReputation,
}: {
    policy: BuyoutPolicyCode;
    startingPrice: string;
    setStartingPrice: (v: string) => void;
    buyoutPrice: string;
    setBuyoutPrice: (v: string) => void;
    minimalReputation: string;
    setMinimalReputation: (v: string) => void;
}) {
    const { t } = useTranslation();
    const onlyDigits = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
        set(e.target.value.replace(/\D/g, ""));

    if (policy === "direct") {
        return (
            <Field>
                <FieldLabel>{t("auction.field.fixedPrice")}</FieldLabel>
                <Input
                    inputMode="numeric"
                    value={startingPrice}
                    onChange={onlyDigits(setStartingPrice)}
                />
            </Field>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-3">
            <Field>
                <FieldLabel>{t("auction.field.startingPrice")}</FieldLabel>
                <Input
                    inputMode="numeric"
                    value={startingPrice}
                    onChange={onlyDigits(setStartingPrice)}
                />
            </Field>
            <Field>
                <FieldLabel>{t("auction.field.buyoutPrice")}</FieldLabel>
                <Input
                    inputMode="numeric"
                    placeholder="∞"
                    value={buyoutPrice}
                    onChange={onlyDigits(setBuyoutPrice)}
                />
            </Field>
            <Field>
                <FieldLabel>{t("auction.field.minReputation")}</FieldLabel>
                <Input
                    inputMode="numeric"
                    value={minimalReputation}
                    onChange={onlyDigits(setMinimalReputation)}
                />
            </Field>
        </div>
    );
}
