// 上架拍卖对话框。riven 路径含词条编辑器 + Mod 名生成；lich/sister 路径为元素/幻纹/伤害/怪癖。
// 价格段随策略切换：direct 仅售价（买断=售价）；auction 为起标 + 买断(∞) + 最低信誉。

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
    useAuctionSearchData,
    type Option,
    type WeaponGroup,
} from "@/features/market/use-auction-search-data";
import { useCreateAuctionMutation } from "@/features/market/queries";
import { generateRivenNames } from "@/features/market/auction-riven-name";
import { assetUrl } from "@/features/market/assets";
import { RivenCardPreview } from "@/features/market/components/auction/riven-card-preview.tsx";
import { WeaponCombobox } from "@/features/market/components/auction/weapon-combobox";
import { AttributeCombobox } from "@/features/market/components/auction/attribute-combobox";
import { PolaritySelect } from "@/features/market/components/auction/polarity-select";
import {
    SEARCH_TYPES,
    CREATE_POLICIES,
    CREATE_ELEMENTS,
    CREATE_POLARITIES,
    type SearchTypeCode,
    type BuyoutPolicyCode,
} from "@/features/market/auction-constants";
import type { Attribute, AuctionOrderParams } from "@/types/wf-market";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: React.ReactNode;
}

interface AttrRow {
    positive: boolean;
    slug: string;
    value: string;
}

const num = (v: string): number | undefined => {
    if (v.trim() === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

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

    // riven
    const [attrRows, setAttrRows] = useState<AttrRow[]>([
        { positive: true, slug: "", value: "" },
        { positive: true, slug: "", value: "" },
    ]);
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

    const quirkOptions = data.quirkOptions(type);
    const quirkMatches = useMemo(() => {
        const q = quirkInput.trim().toLowerCase();
        const base = q
            ? quirkOptions.filter((o) => o.label.toLowerCase().includes(q))
            : quirkOptions;
        return base.slice(0, 20);
    }, [quirkInput, quirkOptions]);

    // 由当前词条行生成所有可能的 Mod 名
    const modNameOptions = useMemo(() => {
        const attrs: Attribute[] = attrRows
            .filter((r) => r.slug)
            .map((r) => ({ urlName: r.slug, value: num(r.value) ?? 0, positive: r.positive }));
        return generateRivenNames(attrs);
    }, [attrRows]);

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
        setAttrRows((rows) =>
            rows.map((r) => {
                const valid = r.positive ? posValid : negValid;
                return r.slug && !valid.has(r.slug) ? { ...r, slug: "" } : r;
            }),
        );
    };

    const setRow = (i: number, patch: Partial<AttrRow>) =>
        setAttrRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

    const addRow = () =>
        setAttrRows((rows) => [...rows, { positive: true, slug: "", value: "" }]);
    const removeRow = (i: number) =>
        setAttrRows((rows) => rows.filter((_, idx) => idx !== i));

    const validate = (): string | null => {
        if (!weaponSlug) return t("auction.create.error.weapon");
        if (!startingPrice) return t("auction.create.error.price");
        if (type === "riven") {
            const positives = attrRows.filter((r) => r.positive && r.slug);
            if (positives.length < 2) return t("auction.create.error.attrs");
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
            item:
                type === "riven"
                    ? {
                          type,
                          weaponUrlName: weaponSlug,
                          name: modName,
                          polarity,
                          masteryLevel: num(mr),
                          modRank: num(modRank),
                          reRolls: num(reRolls),
                          attributes: attrRows
                              .filter((r) => r.slug)
                              .map((r) => ({
                                  urlName: r.slug,
                                  value: num(r.value) ?? 0,
                                  positive: r.positive,
                              })),
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

    // 卡面预览：紫卡词条行（含正负号 + 名称）
    const previewStats = attrRows
        .filter((r) => r.slug)
        .map((r) => `${r.positive ? "+" : ""}${r.value} ${data.attrName(r.slug)}`.trim());
    const weaponDisplayName = data.weaponName(type, weaponSlug);
    const weaponIconPath = data.weaponIcon(type, weaponSlug);

    const preview =
        type === "riven" ? (
            <RivenCardPreview
                weaponName={weaponDisplayName}
                modName={modName}
                polarity={polarity}
                stats={previewStats}
                masteryRank={mr}
                reRolls={reRolls}
            />
        ) : (
            <div className="flex w-50 shrink-0 flex-col items-center gap-3 rounded-lg border p-4">
                {weaponIconPath ? (
                    <img src={assetUrl(weaponIconPath)} alt="" className="size-28 object-contain" />
                ) : (
                    <div className="size-28 rounded-full bg-muted" />
                )}
                <div className="text-center font-medium">{weaponDisplayName}</div>
                {hasEphemera && (
                    <div className="text-center text-sm text-muted-foreground">
                        {data.ephemeraName(type, element)}
                    </div>
                )}
            </div>
        );

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
                    <div className="hidden sm:block">{preview}</div>

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
                            <Select value={type} onValueChange={(v) => resetType(v as SearchTypeCode)}>
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

                    {type === "riven" ? (
                        <RivenSection
                            attrRows={attrRows}
                            positiveGroups={positiveGroups}
                            negativeGroups={negativeGroups}
                            portalContainer={portalContainer}
                            setRow={setRow}
                            addRow={addRow}
                            removeRow={removeRow}
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
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel>{t("auction.field.element")}</FieldLabel>
                                <Select value={element} onValueChange={setElement}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CREATE_ELEMENTS.map((e) => (
                                            <SelectItem key={e} value={e}>
                                                {t(`auction.element.${e}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel>{t("auction.field.ephemera")}</FieldLabel>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={hasEphemera ? "default" : "outline"}
                                        onClick={() => setHasEphemera(true)}
                                    >
                                        {t("auction.ephemera.yes")}
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={!hasEphemera ? "default" : "outline"}
                                        onClick={() => setHasEphemera(false)}
                                    >
                                        {t("auction.ephemera.no")}
                                    </Button>
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel>{t("auction.field.damage")}</FieldLabel>
                                <Input
                                    inputMode="decimal"
                                    value={damage}
                                    onChange={(e) => setDamage(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>{t("auction.field.quirk")}</FieldLabel>
                                <Combobox<Option>
                                    items={quirkMatches}
                                    filter={null}
                                    inputValue={quirkInput}
                                    onInputValueChange={(v) => {
                                        setQuirkInput(v);
                                        if (v.trim() === "") setQuirkSlug("");
                                    }}
                                    onValueChange={(o) => {
                                        if (o) {
                                            setQuirkSlug(o.value);
                                            setQuirkInput(o.label);
                                        }
                                    }}
                                    itemToStringLabel={(o) => o.label}
                                    autoHighlight
                                >
                                    <ComboboxInput
                                        className="w-full"
                                        showTrigger={false}
                                        showClear
                                    />
                                    <ComboboxContent container={portalContainer}>
                                        <ComboboxEmpty>
                                            {t("market.search.no-match")}
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            {quirkMatches.map((o) => (
                                                <ComboboxItem key={o.value} value={o}>
                                                    {o.label}
                                                </ComboboxItem>
                                            ))}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </Field>
                        </div>
                    )}

                    {/* 价格段 */}
                    {policy === "direct" ? (
                        <Field>
                            <FieldLabel>{t("auction.field.fixedPrice")}</FieldLabel>
                            <Input
                                inputMode="numeric"
                                value={startingPrice}
                                onChange={(e) =>
                                    setStartingPrice(e.target.value.replace(/\D/g, ""))
                                }
                            />
                        </Field>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            <Field>
                                <FieldLabel>{t("auction.field.startingPrice")}</FieldLabel>
                                <Input
                                    inputMode="numeric"
                                    value={startingPrice}
                                    onChange={(e) =>
                                        setStartingPrice(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel>{t("auction.field.buyoutPrice")}</FieldLabel>
                                <Input
                                    inputMode="numeric"
                                    placeholder="∞"
                                    value={buyoutPrice}
                                    onChange={(e) =>
                                        setBuyoutPrice(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel>{t("auction.field.minReputation")}</FieldLabel>
                                <Input
                                    inputMode="numeric"
                                    value={minimalReputation}
                                    onChange={(e) =>
                                        setMinimalReputation(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </Field>
                        </div>
                    )}

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

function RivenSection({
    attrRows,
    positiveGroups,
    negativeGroups,
    portalContainer,
    setRow,
    addRow,
    removeRow,
    polarity,
    setPolarity,
    modName,
    setModName,
    modNameOptions,
    mr,
    setMr,
    modRank,
    setModRank,
    reRolls,
    setReRolls,
}: {
    attrRows: AttrRow[];
    positiveGroups: WeaponGroup[];
    negativeGroups: WeaponGroup[];
    portalContainer: React.ComponentProps<typeof AttributeCombobox>["container"];
    setRow: (i: number, patch: Partial<AttrRow>) => void;
    addRow: () => void;
    removeRow: (i: number) => void;
    polarity: string;
    setPolarity: (v: string) => void;
    modName: string;
    setModName: (v: string) => void;
    modNameOptions: string[];
    mr: string;
    setMr: (v: string) => void;
    modRank: string;
    setModRank: (v: string) => void;
    reRolls: string;
    setReRolls: (v: string) => void;
}) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col gap-3">
            {/* 词条编辑器 */}
            <div className="flex flex-col gap-2">
                <FieldLabel>{t("auction.field.attributes")}</FieldLabel>
                {attrRows.map((row, i) => {
                    const groups = row.positive ? positiveGroups : negativeGroups;
                    // 其它行已选的词条（正负不限），本行不可再选
                    const exclude = new Set(
                        attrRows
                            .filter((_, idx) => idx !== i)
                            .map((r) => r.slug)
                            .filter(Boolean),
                    );
                    return (
                        <div key={i} className="flex items-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant={row.positive ? "default" : "outline"}
                                onClick={() => setRow(i, { positive: !row.positive, slug: "" })}
                            >
                                {row.positive ? "+" : "−"}
                            </Button>
                            <div className="flex-1">
                                <AttributeCombobox
                                    groups={groups}
                                    value={row.slug}
                                    onValueChange={(v) => setRow(i, { slug: v })}
                                    exclude={exclude}
                                    container={portalContainer}
                                />
                            </div>
                            <Input
                                className="w-24"
                                inputMode="decimal"
                                placeholder={t("auction.field.value")}
                                value={row.value}
                                onChange={(e) => setRow(i, { value: e.target.value })}
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeRow(i)}
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </div>
                    );
                })}
                <Button type="button" size="sm" variant="outline" onClick={addRow}>
                    <PlusIcon className="size-4" />
                    {t("auction.field.addAttr")}
                </Button>
            </div>

            {/* 极性 + Mod 名 */}
            <div className="grid grid-cols-[1fr_2fr] gap-3">
                <Field>
                    <FieldLabel>{t("auction.field.polarity")}</FieldLabel>
                    <PolaritySelect
                        value={polarity}
                        onValueChange={setPolarity}
                        options={CREATE_POLARITIES}
                    />
                </Field>
                <Field>
                    <FieldLabel>{t("auction.field.modName")}</FieldLabel>
                    <Select
                        value={modName}
                        onValueChange={setModName}
                        disabled={modNameOptions.length === 0}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("auction.field.modNamePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {modNameOptions.map((n) => (
                                <SelectItem key={n} value={n}>
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            {/* 段位 / 等级 / 循环 */}
            <div className="grid grid-cols-3 gap-3">
                <Field>
                    <FieldLabel>{t("auction.field.mastery")}</FieldLabel>
                    <Input
                        inputMode="numeric"
                        value={mr}
                        onChange={(e) => setMr(e.target.value.replace(/\D/g, ""))}
                    />
                </Field>
                <Field>
                    <FieldLabel>{t("auction.field.modRank")}</FieldLabel>
                    <Input
                        inputMode="numeric"
                        value={modRank}
                        onChange={(e) => setModRank(e.target.value.replace(/\D/g, ""))}
                    />
                </Field>
                <Field>
                    <FieldLabel>{t("auction.field.reRolls")}</FieldLabel>
                    <Input
                        inputMode="numeric"
                        value={reRolls}
                        onChange={(e) => setReRolls(e.target.value.replace(/\D/g, ""))}
                    />
                </Field>
            </div>
        </div>
    );
}
