// 拍卖卡片。

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/store/settings";
import { useAuthStore } from "@/store/auth";
import { assetUrl, avatarUrl } from "@/features/market/assets";
import { statusOf } from "@/features/market/constants";
import { usePlaceBid, useCancelBid } from "@/features/market/queries";
import { myBidOf } from "@/features/market/ws/bids";
import type { AuctionSearchData } from "@/features/market/use-auction-search-data";
import {elementImg, SearchTypeCode} from "@/features/market/auction-constants";
import type { AuctionOrder, Attribute } from "@/types/wf-market";
import {PolarityIcon} from "@/features/market/components/auction/polarity-select.tsx";

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
                        <PolarityIcon polarity={ao.item.polarity} />
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

            <BidControls ao={ao} />
        </Card>
    );
}

/** 出价/加价/撤价。仅对他人的、未关闭的竞拍单（登录后）显示。 */
function BidControls({ ao }: { ao: AuctionOrder }) {
    const { t } = useTranslation();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn());
    const myId = useAuthStore((s) => s.user?.id);
    const placeBid = usePlaceBid();
    const cancelBid = useCancelBid();
    const mine = myBidOf(ao.id);
    const [value, setValue] = useState<string>(
        String((ao.topBid ?? ao.startingPrice) + 1),
    );

    // 一口价直售、已关闭、未登录、自己的单都不出价
    if (!isLoggedIn || ao.closed || ao.isDirectSell || ao.owner.id === myId) {
        return null;
    }

    const busy = placeBid.isPending || cancelBid.isPending;

    const onPlace = () => {
        const v = Math.floor(Number(value));
        if (!Number.isFinite(v) || v <= 0) return;
        placeBid.mutate(
            { auctionId: ao.id, value: v },
            {
                onSuccess: () => toast.success(t("auction.bid.success")),
                onError: (e) => toast.error(bidError(e, t)),
            },
        );
    };
    const onCancel = () =>
        cancelBid.mutate(
            { auctionId: ao.id },
            {
                onSuccess: () => toast.success(t("auction.bid.canceled")),
                onError: (e) => toast.error(bidError(e, t)),
            },
        );

    return (
        <div className="flex items-center gap-2 border-t pt-2">
            <Input
                type="number"
                min={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={busy}
                className="h-8 w-24"
                aria-label={t("auction.bid.place")}
            />
            <Button size="sm" onClick={onPlace} disabled={busy}>
                {mine ? t("auction.bid.raise") : t("auction.bid.place")}
            </Button>
            {mine ? (
                <>
                    <span className="text-xs text-muted-foreground">
                        {t("auction.bid.mine")}: {mine.value}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onCancel}
                        disabled={busy}
                    >
                        {t("auction.bid.cancel")}
                    </Button>
                </>
            ) : null}
        </div>
    );
}

/** mutation 错误 → 文案。invoke 失败 reject 的是字符串（服务端原因），直接透传。 */
function bidError(e: unknown, t: (k: string) => string): string {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "not-found") return t("auction.bid.notFound");
    if (msg === "no-user") return t("auction.bid.failed");
    return msg || t("auction.bid.failed");
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
