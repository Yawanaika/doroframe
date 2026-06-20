import { useTranslation } from "react-i18next";
import { getSumEndo } from "@/lib/utils";
import type { Item, ItemOrder } from "@/types/wf-market";

/**
 * 订单元信息行内片段：等级 / 琥珀星 / 青蓝星 / 内融核心(endo) / 类型(subtype)。
 * 仅渲染该订单实际带有的字段，返回一串 `<span>`（不含外层容器），
 * 由调用方放进自己的 flex 行里。「我的订单」行与编辑弹窗行情列表共用。
 */
export function OrderMeta({
    order,
    item,
}: {
    order: ItemOrder;
    item: Item | undefined;
}) {
    const { t } = useTranslation();
    return (
        <>
            {order.perTrade != null && order.perTrade !== 1 ? (
                <span>
                    {t("market.perTrade", { perTrade: order.perTrade })}
                </span>
            ) : null}
            {order.rank != null && item?.maxRank ? (
                <span>
                    {t("market.rank", { rank: order.rank, maxRank: item.maxRank })}
                </span>
            ) : null}
            {order.amberStars != null && item?.maxAmberStars ? (
                <span>
                    {t("market.amberStars", {
                        amberStars: order.amberStars,
                        maxAmberStars: item.maxAmberStars,
                    })}
                </span>
            ) : null}
            {order.cyanStars != null && item?.maxCyanStars ? (
                <span>
                    {t("market.cyanStars", {
                        cyanStars: order.cyanStars,
                        maxCyanStars: item.maxCyanStars,
                    })}
                </span>
            ) : null}
            {order.amberStars != null || order.cyanStars != null ? (
                <span className="flex items-center gap-1 font-mono text-xs">
                    {getSumEndo(item, order.amberStars, order.cyanStars)}
                    <img
                        src="/images/resources/FusionPoints.png"
                        alt=""
                        className="size-4"
                    />
                </span>
            ) : null}
            {order.subtype ? (
                <span className="truncate">
                    {t(order.subtype, {
                        ns: "subtype",
                        defaultValue: order.subtype,
                    })}
                </span>
            ) : null}
        </>
    );
}
