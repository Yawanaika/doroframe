// 上架拍卖对话框。riven 路径含词条编辑器 + Mod 名生成；lich/sister 路径为元素/幻纹/伤害/怪癖。
// 价格段随策略切换：direct 仅售价（买断=售价）；auction 为起标 + 买断(∞) + 最低信誉。
// 各字段段拆分为独立组件，本文件仅持有表单状态并编排提交/预览。

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuctionSearchData } from "@/features/market/use-auction-search-data";
import { useCreateAuctionMutation } from "@/features/market/queries";
import { generateRivenNames } from "@/features/market/auction-riven-name";
import { WeaponCombobox } from "@/features/market/components/auction/weapon-combobox";
import { AuctionPreview } from "@/features/market/components/auction/auction-preview";
import {
    RivenAttributeEditor,
    RivenMetaFields,
} from "@/features/market/components/auction/riven-fields";
import { LichSisterFields } from "@/features/market/components/auction/lich-sister-fields";
import { PriceFields } from "@/features/market/components/auction/price-fields";
import {
    type AttrInput,
    MAX_POSITIVE,
    MIN_POSITIVE,
    num,
    formatStat,
} from "@/features/market/create-auction-shared";
import {
    SEARCH_TYPES,
    CREATE_POLICIES,
    CREATE_ELEMENTS,
    CREATE_POLARITIES,
    type SearchTypeCode,
    type BuyoutPolicyCode,
} from "@/features/market/auction-constants";
import type { Attribute, AuctionOrderParams } from "@/types/wf-market";
import {Plus} from "lucide-react";
import {useAuctions} from "@/features/market/use-auctions.ts";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export const NeedCreateAuction = () => {
    const { t } = useTranslation();
    const { isLoggedIn, createOpen, setCreateOpen} = useAuctions();
    return (
        isLoggedIn && (
            <CreateAuctionDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                trigger={
                    <Button
                        size="icon"
                        aria-label={t("auction.create.title")}
                        className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg"
                    >
                        <Plus className="size-6" />
                    </Button>
                }
            />
        )
    )
}

export function CreateAuctionDialog({ open, onOpenChange, trigger }: Props) {
    const { t } = useTranslation();
    const data = useAuctionSearchData();
    const createMut = useCreateAuctionMutation();
    // Combobox(base-ui)弹层默认 portal 到 body，会被 Dialog(radix)的焦点陷阱打断选中。
    // 用此容器把弹层渲染进 Dialog 内部，规避跨库冲突。
    const portalContainer = useRef<HTMLDivElement>(null);

    const [type, setType] = useState<SearchTypeCode>("riven");
    const [policy, setPolicy] = useState<BuyoutPolicyCode>("direct");
    const [visible, setVisible] = useState(true);
    const [weaponSlug, setWeaponSlug] = useState("");
    const [weaponInput, setWeaponInput] = useState("");

    // riven：正面词条（2~3 条）与负面词条（至多 1 条）分开维护
    const [positives, setPositives] = useState<AttrInput[]>([
        { slug: "", value: "" },
        { slug: "", value: "" },
    ]);
    const [negative, setNegative] = useState<AttrInput>({ slug: "", value: "" });
    const [polarity, setPolarity] = useState<string>(CREATE_POLARITIES[0]);
    const [modName, setModName] = useState("");
    const [mr, setMr] = useState("8");
    const [modRank, setModRank] = useState("0");
    const [reRolls, setReRolls] = useState("0");

    // lich/sister
    const [element, setElement] = useState<string>(CREATE_ELEMENTS[0]);
    const [hasEphemera, setHasEphemera] = useState(false);
    const [damage, setDamage] = useState("25");
    const [quirkSlug, setQuirkSlug] = useState("");
    const [quirkInput, setQuirkInput] = useState("");

    // price / note
    const [startingPrice, setStartingPrice] = useState("");
    const [buyoutPrice, setBuyoutPrice] = useState("");
    const [minimalReputation, setMinimalReputation] = useState("0");
    const [note, setNote] = useState("");

    const isRiven = type === "riven";

    // 正面 + 负面合并为 API 词条列表（仅取已选 slug）
    const allAttrs = useMemo<Attribute[]>(() => {
        const out: Attribute[] = positives
            .filter((r) => r.slug)
            .map((r) => ({ urlName: r.slug, value: num(r.value) ?? 0, positive: true }));
        if (negative.slug)
            out.push({
                urlName: negative.slug,
                value: num(negative.value) ?? 0,
                positive: false,
            });
        return out;
    }, [positives, negative]);

    // 由当前词条生成所有可能的 Mod 名（仅正面词条参与）
    const modNameOptions = useMemo(() => generateRivenNames(allAttrs), [allAttrs]);

    // Mod 名选项变化时，确保选中值有效
    useEffect(() => {
        if (modNameOptions.length === 0) {
            if (modName) setModName("");
        } else if (!modNameOptions.includes(modName)) {
            setModName(modNameOptions[0]);
        }
    }, [modNameOptions, modName]);

    // 所选武器的 rivenType，用于按武器筛选正/负词条（未选武器则不筛选）
    const weaponType = weaponSlug
        ? data.weaponRivenType("riven", weaponSlug)
        : undefined;
    const positiveGroups = useMemo(
        () => data.positiveGroupsFor(weaponType),
        [data, weaponType],
    );
    const negativeGroups = useMemo(
        () => data.negativeGroupsFor(weaponType),
        [data, weaponType],
    );

    const resetType = (next: SearchTypeCode) => {
        setType(next);
        setWeaponSlug("");
        setWeaponInput("");
        setQuirkSlug("");
        setQuirkInput("");
    };

    // 换武器后清空对新武器不适用的已选词条 slug
    const onWeaponChange = (slug: string) => {
        const rt = data.weaponRivenType("riven", slug);
        const posValid = new Set(data.positiveOptionsFor(rt).map((x) => x.value));
        const negValid = new Set(data.negativeOptionsFor(rt).map((x) => x.value));
        setPositives((rows) =>
            rows.map((r) => (r.slug && !posValid.has(r.slug) ? { ...r, slug: "" } : r)),
        );
        setNegative((r) => (r.slug && !negValid.has(r.slug) ? { ...r, slug: "" } : r));
    };

    const setPos = (i: number, patch: Partial<AttrInput>) =>
        setPositives((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    const addPos = () =>
        setPositives((rows) =>
            rows.length >= MAX_POSITIVE ? rows : [...rows, { slug: "", value: "" }],
        );
    const removePos = (i: number) =>
        setPositives((rows) =>
            rows.length <= MIN_POSITIVE ? rows : rows.filter((_, idx) => idx !== i),
        );

    const validate = (): string | null => {
        if (!weaponSlug) return t("auction.create.error.weapon");
        if (!startingPrice) return t("auction.create.error.price");
        if (isRiven) {
            if (positives.filter((r) => r.slug).length < MIN_POSITIVE)
                return t("auction.create.error.attrs");
            if (!modName) return t("auction.create.error.modName");
        }
        return null;
    };

    const buildParams = (): AuctionOrderParams => {
        const sp = num(startingPrice);
        const isDirect = policy === "direct";
        return {
            visible,
            startingPrice: sp,
            buyoutPrice: isDirect ? sp : num(buyoutPrice),
            minimalReputation: isDirect ? 0 : num(minimalReputation) ?? 0,
            note,
            item: isRiven
                ? {
                      type,
                      weaponUrlName: weaponSlug,
                      name: modName,
                      polarity,
                      masteryLevel: num(mr),
                      modRank: num(modRank),
                      reRolls: num(reRolls),
                      attributes: allAttrs,
                  }
                : {
                      type,
                      weaponUrlName: weaponSlug,
                      element,
                      damage: num(damage),
                      havingEphemera: hasEphemera,
                      quirk: quirkSlug || undefined,
                  },
        };
    };

    const submit = async () => {
        const err = validate();
        if (err) {
            toast.error(err);
            return;
        }
        try {
            await createMut.mutateAsync(buildParams());
            toast.success(t("auction.create.success"));
            onOpenChange(false);
        } catch (e) {
            toast.error(`${t("auction.create.failed")}: ${String(e)}`);
        }
    };

    // 卡面预览：紫卡词条行（含正负号 / 单位 + 名称）
    const previewStats = [
        ...positives
            .filter((r) => r.slug)
            .map((r) =>
                formatStat(r.value, data.attrName(r.slug), true, data.attrMeta(r.slug)),
            ),
        ...(negative.slug
            ? [
                  formatStat(
                      negative.value,
                      data.attrName(negative.slug),
                      false,
                      data.attrMeta(negative.slug),
                  ),
              ]
            : []),
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent
                ref={portalContainer}
                className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
            >
                <DialogHeader>
                    <DialogTitle>{t("auction.create.title")}</DialogTitle>
                </DialogHeader>

                <div className="flex gap-4">
                    <div className="hidden sm:block">
                        <AuctionPreview
                            isRiven={isRiven}
                            weaponName={data.weaponName(type, weaponSlug)}
                            weaponIcon={data.weaponIcon(type, weaponSlug)}
                            modName={modName}
                            polarity={polarity}
                            stats={previewStats}
                            masteryRank={mr}
                            reRolls={reRolls}
                            damage={damage}
                            element={element}
                            hasEphemera={hasEphemera}
                            ephemeraName={data.ephemeraName(type, element)}
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                        {/* 策略 + 可见度 */}
                        <div className="grid grid-cols-2 gap-3">
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
                        </div>

                        {/* 类型 + 武器 */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel>{t("auction.field.type")}</FieldLabel>
                                <Select
                                    value={type}
                                    onValueChange={(v) => resetType(v as SearchTypeCode)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEARCH_TYPES.map((st) => (
                                            <SelectItem key={st} value={st}>
                                                {t(`auction.type.${st}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel>{t("auction.field.weapon")}</FieldLabel>
                                <WeaponCombobox
                                    groups={data.weaponGroups(type)}
                                    inputValue={weaponInput}
                                    onInputValueChange={(v) => {
                                        setWeaponInput(v);
                                        if (v.trim() === "") setWeaponSlug("");
                                    }}
                                    onValueChange={(o) => {
                                        if (o) {
                                            setWeaponSlug(o.value);
                                            setWeaponInput(o.label);
                                            onWeaponChange(o.value);
                                        }
                                    }}
                                    container={portalContainer}
                                />
                            </Field>
                        </div>

                        {isRiven ? (
                            <div className="flex flex-col gap-4">
                                <RivenAttributeEditor
                                    positives={positives}
                                    negative={negative}
                                    positiveGroups={positiveGroups}
                                    negativeGroups={negativeGroups}
                                    attrMeta={data.attrMeta}
                                    container={portalContainer}
                                    setPos={setPos}
                                    addPos={addPos}
                                    removePos={removePos}
                                    setNegative={setNegative}
                                />
                                <RivenMetaFields
                                    polarity={polarity}
                                    setPolarity={setPolarity}
                                    modName={modName}
                                    setModName={setModName}
                                    modNameOptions={modNameOptions}
                                    mr={mr}
                                    setMr={setMr}
                                    modRank={modRank}
                                    setModRank={setModRank}
                                    reRolls={reRolls}
                                    setReRolls={setReRolls}
                                />
                            </div>
                        ) : (
                            <LichSisterFields
                                data={data}
                                type={type}
                                element={element}
                                setElement={setElement}
                                hasEphemera={hasEphemera}
                                setHasEphemera={setHasEphemera}
                                damage={damage}
                                setDamage={setDamage}
                                quirkInput={quirkInput}
                                setQuirkInput={setQuirkInput}
                                setQuirkSlug={setQuirkSlug}
                                container={portalContainer}
                            />
                        )}

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

                        <Button onClick={submit} disabled={createMut.isPending}>
                            {createMut.isPending && <Spinner data-icon="inline-start" />}
                            {t("auction.create.submit")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
