import { useTranslation } from "react-i18next";
import type { SetInfo } from "@/types/wf-market";

interface Props {
    setInfo: SetInfo | undefined;
    /** 当前选中的物品 slug，用于取该件的杜卡德/交易税 */
    slug: string;
}

/** 物品附属信息：精通段位、杜卡德、交易税 */
export function ItemDetail({ setInfo, slug }: Props) {
    const { t } = useTranslation();
    if (!setInfo || setInfo.items.length === 0) return null;

    let ducats: number | undefined;
    let tradingTax: number | undefined;
    let reqMasteryRank: number | undefined;

    for (const item of setInfo.items) {
        if (item.slug === slug) {
            ducats = item.ducats;
            tradingTax = item.tradingTax;
        }
        if (item.setRoot) {
            reqMasteryRank = item.reqMasteryRank;
        }
    }

    const hasAny =
        reqMasteryRank != null ||
        (ducats != null && ducats > 0) ||
        (tradingTax != null && tradingTax > 0);
    if (!hasAny) return null;

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {reqMasteryRank != null && (
                <span className="inline-flex items-center gap-1">
                    {t("market.detail.mastery")}
                    <img src="/images/MastreyRank.png" alt="mr" className="size-4" />
                    {reqMasteryRank}
                </span>
            )}
            {ducats != null && ducats > 0 && (
                <span className="inline-flex items-center gap-1">
                    {t("market.detail.ducats")}
                    {ducats}
                    <img
                        src="/images/resources/PrimeBucks.png"
                        alt="ducats"
                        className="size-4"
                    />
                </span>
            )}
            {tradingTax != null && tradingTax > 0 && (
                <span className="inline-flex items-center gap-1">
                    {t("market.detail.tax")}
                    {tradingTax}
                    <img
                        src="/images/resources/Credits.png"
                        alt="credits"
                        className="size-4"
                    />
                </span>
            )}
        </div>
    );
}
