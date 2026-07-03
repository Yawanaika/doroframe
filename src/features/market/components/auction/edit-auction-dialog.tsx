// 编辑拍卖对话框：只改价格 / 最低信誉 / 描述 / 可见度（物品本身不可改，故不含词条编辑）。
// 价格段复用 PriceFields，策略由 ao.isDirectSell 推断（direct 仅固定价，buyout=起标）。

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { PriceFields } from "@/features/market/components/auction/price-fields";
import { AuctionPreview } from "@/features/market/components/auction/auction-preview";
import { num, formatStat } from "@/features/market/create-auction-shared";
import { useEditAuctionMutation } from "@/features/market/queries";
import { useAuctionSearchData } from "@/features/market/use-auction-search-data";
import type { AuctionOrder } from "@/types/wf-market";
import {
    BuyoutPolicyCode,
    CREATE_POLICIES,
    type SearchTypeCode,
} from "@/features/market/auction-constants.ts";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ao: AuctionOrder;
    trigger?: React.ReactNode;
}

export function EditAuctionDialog({ open, onOpenChange, ao , trigger}: Props) {
    const { t } = useTranslation();
    const editMut = useEditAuctionMutation();
    const data = useAuctionSearchData();
    const itemType = ao.item.type as SearchTypeCode;
    const isRiven = itemType === "riven";
    // 卡面词条行：从已有 attributes 复用 formatStat（与创建弹窗同一格式化）
    const previewStats = (ao.item.attributes ?? []).map((a) =>
        formatStat(String(a.value), data.attrName(a.urlName), a.positive, data.attrMeta(a.urlName)),
    );
    const [policy, setPolicy] = useState<BuyoutPolicyCode>(ao.isDirectSell ? "direct" : "auction");
    const [startingPrice, setStartingPrice] = useState("");
    const [buyoutPrice, setBuyoutPrice] = useState("");
    const [minimalReputation, setMinimalReputation] = useState("0");
    const [note, setNote] = useState("");
    const [visible, setVisible] = useState(true);

    // 每次打开用当前拍卖值回填
    useEffect(() => {
        if (!open) return;
        setStartingPrice(String(ao.startingPrice));
        setBuyoutPrice(ao.buyoutPrice != null ? String(ao.buyoutPrice) : "");
        setMinimalReputation(String(ao.minimalReputation));
        setNote(ao.noteRaw);
        setVisible(ao.visible);
    }, [open, ao]);

    const submit = async () => {
        const sp = num(startingPrice);
        if (sp == null) {
            toast.error(t("auction.create.error.price"));
            return;
        }
        const isDirect = policy === "direct";
        try {
            await editMut.mutateAsync({
                id: ao.id,
                params: {
                    startingPrice: sp,
                    buyoutPrice: isDirect ? sp : num(buyoutPrice),
                    minimalReputation: isDirect ? 0 : num(minimalReputation) ?? 0,
                    visible,
                    note,
                },
            });
            toast.success(t("auction.edit.success"));
            onOpenChange(false);
        } catch (e) {
            toast.error(`${t("auction.edit.failed")}: ${String(e)}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t("auction.edit.title")}</DialogTitle>
                </DialogHeader>

                <div className="flex gap-4">
                    {/* 左侧：武器 / 紫卡卡面预览（与创建弹窗一致） */}
                    <div className="hidden sm:block">
                        <AuctionPreview
                            isRiven={isRiven}
                            weaponName={data.weaponName(itemType, ao.item.weaponUrlName)}
                            weaponIcon={data.weaponIcon(itemType, ao.item.weaponUrlName)}
                            modName={ao.item.name ?? ""}
                            polarity={ao.item.polarity ?? ""}
                            stats={previewStats}
                            masteryRank={String(ao.item.masteryLevel ?? "")}
                            reRolls={String(ao.item.reRolls ?? "")}
                            damage={String(ao.item.damage ?? "")}
                            element={ao.item.element ?? ""}
                            hasEphemera={ao.item.havingEphemera ?? false}
                            ephemeraName={data.ephemeraName(itemType, ao.item.element ?? "")}
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                    <Field>
                        <FieldLabel>{t("auction.field.policy")}</FieldLabel>
                        <div className="flex gap-2">
                            {CREATE_POLICIES.map((p) => (
                                <Button
                                    key={p}
                                    type="button"
                                    size="sm"
                                    variant={policy === p ? "default" : "outline"}
                                    onClick={() => setPolicy(p)}
                                >
                                    {t(`auction.policy.${p}`)}
                                </Button>
                            ))}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>{t("auction.field.visibility")}</FieldLabel>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant={visible ? "default" : "outline"}
                                onClick={() => setVisible(true)}
                            >
                                {t("order.visible")}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={!visible ? "default" : "outline"}
                                onClick={() => setVisible(false)}
                            >
                                {t("order.invisible")}
                            </Button>
                        </div>
                    </Field>

                    <PriceFields
                        policy={policy}
                        startingPrice={startingPrice}
                        setStartingPrice={setStartingPrice}
                        buyoutPrice={buyoutPrice}
                        setBuyoutPrice={setBuyoutPrice}
                        minimalReputation={minimalReputation}
                        setMinimalReputation={setMinimalReputation}
                    />

                    <Field>
                        <FieldLabel>{t("auction.field.note")}</FieldLabel>
                        <Textarea
                            value={note}
                            maxLength={200}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </Field>

                    <Button onClick={submit} disabled={editMut.isPending}>
                        {editMut.isPending && <Spinner data-icon="inline-start" />}
                        {t("auction.edit.submit")}
                    </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
