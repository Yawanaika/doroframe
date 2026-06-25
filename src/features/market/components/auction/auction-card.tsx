// 拍卖卡片（只读展示 + 复制喊话）。不含右上角图标操作组与竞拍/改价操作（本轮范围外）。

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/store/settings";
import { assetUrl, avatarUrl } from "@/features/market/assets";
import { statusOf } from "@/features/market/constants";
import type { AuctionSearchData } from "@/features/market/use-auction-search-data";
import {elementImg, SearchTypeCode} from "@/features/market/auction-constants";
import type { AuctionOrder, Attribute } from "@/types/wf-market";

interface Props {
    ao: AuctionOrder;
    data: AuctionSearchData;
}

/** 词条文本：按 slug 区分几种特殊单位（对齐 doroprime _RivenAttributesRow）。 */
function formatAttr(attr: Attribute, name: string): string {
    const v = attr.value;
    const sign = attr.positive ? "+" : ""; // 负面词条 value 自带负号
    switch (attr.urlName) {
        case "damage_vs_corpus":
        case "damage_vs_grineer":
        case "damage_vs_infested":
            return `×${v} ${name}`;
        case "recoil":
            return `${attr.positive ? "" : "+"}${v}% ${name}`;
        case "combo_duration":
            return `${attr.positive ? "+" : ""}${v}秒 ${name}`;
        default:
            return `${sign}${v}% ${name}`;
    }
}

export function AuctionCard({ ao, data }: Props) {
    const { t } = useTranslation();
    const lang = useSettingsStore((s) => s.lang);
    const type = ao.item.type as SearchTypeCode;

    const weaponName = data.weaponName(type, ao.item.weaponUrlName);
    const icon = data.weaponIcon(type, ao.item.weaponUrlName);
    const displayName =
        type === "riven" ? `${weaponName} ${ao.item.name ?? ""}`.trim() : weaponName;

    const copy = useCallback(async () => {
        const isZh = ao.owner.locale === "zh-hans";
        const price =
            ao.isDirectSell || ao.buyoutPrice != null
                ? ao.buyoutPrice ?? ao.startingPrice
                : ao.startingPrice;
        const action = isZh ? "购买" : "buy";
        const text = isZh
            ? `/w ${ao.owner.ingameName} 你好! 我想以 ${price} 白金 ${action}: "${displayName}"。(warframe.market)`
            : `/w ${ao.owner.ingameName} Hi! I want to ${action}: "${displayName}" for ${price} platinum. (warframe.market)`;
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t("market.whisper.copied"));
        } catch {
            toast.error(t("market.whisper.copy-failed"));
        }
    }, [ao, displayName, lang, t]);

    const status = statusOf(ao.owner.status);
    return (
        <Card className="gap-2 p-3">
            {/* 头部：图标 + 名称 + 价格 */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    {icon ? (
                        <img src={assetUrl(icon)} alt="" className="h-9 w-12 shrink-0" />
                    ) : (
                        <div className="size-9 shrink-0 rounded bg-muted" />
                    )}
                    <div className="font-medium">{displayName}</div>
                </div>
                <AuctionPrice ao={ao} />
            </div>

            {/* 属性 / 武器信息 */}
            {type === "riven" ? (
                <div>
                    <RivenAttrs attrs={ao.item.attributes ?? []} data={data} />
                    <div className="flex text-xs text-muted-foreground gap-2">
                        <span>{t("auction.field.mastery")}: {ao.item.masteryLevel}</span>
                        <span>{t("auction.field.modRank")}: {ao.item.modRank}</span>
                        <span>{t("auction.field.reRolls")}: {ao.item.reRolls}</span>
                        <span>{t("auction.field.polarity")}: </span>
                        <div
                            className="size-4 bg-primary"
                            style={{
                                maskImage: `url(/images/polarity/POLARITY_${ao.item.polarity}.png)`,
                                WebkitMaskImage: `url(/images/polarity/POLARITY_${ao.item.polarity}.png)`,
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                            }}
                        />
                    </div>
                </div>
                
            ) : (
                <WeaponInfo ao={ao} data={data} type={type} />
            )}

            {/* 卖家 + 复制喊话 */}
            {ao.owner.ingameName !== undefined ?(
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                            <AvatarImage src={avatarUrl(ao.owner.avatar)} alt="" />
                            <AvatarFallback>{ao.owner.ingameName?.[0] ?? "?"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{ao.owner.ingameName}</span>
                        <Badge
                            variant="outline"
                            style={{ borderColor: status.color, color: status.color }}
                        >
                            {lang === "zh" ? status.labelZh : status.labelEn}
                        </Badge>
                    </div>
                    <Button size="sm" onClick={copy}>
                        <CopyIcon className="size-3.5" />
                        {t("auction.card.whisper")}
                    </Button>
                </div>
            ):null}
        </Card>
    );
}

function AuctionPrice({ ao }: { ao: AuctionOrder }) {
    const { t } = useTranslation();
    // 一口价直售（买断=起拍）：单行
    if (ao.buyoutPrice != null && ao.buyoutPrice === ao.startingPrice) {
        return (
            <div className="flex text-right text-sm">
                {t("auction.card.fixed")}: <b>{ao.buyoutPrice}</b>
                <img src={"/images/resources/Platinum.png"} alt="Platinum" className="size-4"/>
            </div>
        );
    }
    return (
        <div className="space-y-0.5 text-right text-sm">
            <div className="flex">
                {t("auction.card.starting")}: <b>{ao.startingPrice}</b>
                <img src={"/images/resources/Platinum.png"} alt="Platinum" className="size-4"/>
            </div>
            <div className="flex">
                {t("auction.card.buyout")}: <b>{ao.buyoutPrice ?? "∞"}</b>
                {ao.buyoutPrice?(
                    <img src={"/images/resources/Platinum.png"} alt="Platinum" className="size-4"/>
                ):null}
            </div>
            <div className="text-muted-foreground">
                {ao.topBid != null
                    ? `${t("auction.card.topBid")}: ${ao.topBid}`
                    : t("auction.card.noBid")}
            </div>
        </div>
    );
}

function RivenAttrs({
    attrs,
    data,
}: {
    attrs: Attribute[];
    data: AuctionSearchData;
}) {
    const row = (positive: boolean) =>
        attrs
            .filter((a) => a.positive === positive)
            .map((a) => (
                <span
                    key={a.urlName}
                    className="rounded border px-1.5 py-0.5 text-xs"
                    style={{
                        borderColor: positive ? "#22c55e" : "#ef4444",
                    }}
                >
                    {formatAttr(a, data.attrName(a.urlName))}
                </span>
            ));
    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-wrap gap-1">{row(true)}</div>
            <div className="flex flex-wrap gap-1">{row(false)}</div>
        </div>
    );
}

function WeaponInfo({
    ao,
    data,
    type,
}: {
    ao: AuctionOrder;
    data: AuctionSearchData;
    type: SearchTypeCode;
}) {
    const { t } = useTranslation();
    const item = ao.item;
    const elementSrc = elementImg(item.element);
    const ephemera =
        item.havingEphemera && item.element
            ? data.ephemeraName(type, item.element)
            : "";
    return (
        <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-3">
                <span>
                    {t("auction.card.damage")}: {item.damage}
                </span>
                {ephemera && <span className="font-semibold">{ephemera}</span>}
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
                {elementSrc ? (
                    <span className="flex items-center gap-1">
                        {t("auction.card.element")}:
                        <img src={elementSrc} alt={item.element} className="size-4" />
                    </span>
                ) : null}
                <span>
                    {t("auction.card.quirk")}:{" "}
                    {item.quirk ? data.quirkName(type, item.quirk) : "-"}
                </span>
            </div>
        </div>
    );
}
