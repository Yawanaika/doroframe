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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
    useAuctionSearchData,
    type Option,
    type WeaponGroup,
    type AttrMeta,
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

interface AttrInput {
    slug: string;
    value: string;
}

const MAX_POSITIVE = 3;
const MIN_POSITIVE = 2;

const num = (v: string): number | undefined => {
    if (v.trim() === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

/** 词条单位对应的数值后缀符号：百分比 % / 乘法 × */
const unitSymbol = (unit?: string): string =>
    unit === "percent" ? "%" : unit === "multiply" ? "×" : "";

/**
 * 卡面词条文本：`符号 数值[单位] 名称`。
 * - multiply：一律为乘法，无正负号，形如 `×2.5 名称`。
 * - 其余：正面 +/负面 −；positiveIsNegative（如后坐力）时正负号反向；percent 追加 %。
 */
const formatStat = (
    value: string,
    name: string,
    positiveSection: boolean,
    meta?: { unit?: string; positiveIsNegative?: boolean },
): string => {
    const v = value.trim() === "" ? "0" : value.trim();
    if (meta?.unit === "multiply") return `×${v} ${name}`.trim();
    const positive = meta?.positiveIsNegative ? !positiveSection : positiveSection;
    const sign = positive ? "+" : "−";
    const pct = meta?.unit === "percent" ? "%" : "";
    return `${sign}${v}${pct} ${name}`.trim();
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

    const quirkOptions = data.quirkOptions(type);
    const quirkMatches = useMemo(() => {
        const q = quirkInput.trim().toLowerCase();
        const base = q
            ? quirkOptions.filter((o) => o.label.toLowerCase().includes(q))
            : quirkOptions;
        return base.slice(0, 20);
    }, [quirkInput, quirkOptions]);

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
    const modNameOptions = useMemo(
        () => generateRivenNames(allAttrs),
        [allAttrs],
    );

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
        setNegative((r) =>
            r.slug && !negValid.has(r.slug) ? { ...r, slug: "" } : r,
        );
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
        if (type === "riven") {
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
                            positives={positives}
                            negative={negative}
                            positiveGroups={positiveGroups}
                            negativeGroups={negativeGroups}
                            portalContainer={portalContainer}
                            attrMeta={data.attrMeta}
                            setPos={setPos}
                            addPos={addPos}
                            removePos={removePos}
                            setNegative={setNegative}
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

/** 词条数值输入：右侧附加单位符号（% / ×）；未选词条时禁用 */
function AttrValueInput({
    value,
    onChange,
    symbol,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    symbol: string;
    disabled?: boolean;
}) {
    return (
        <InputGroup>
            <InputGroupInput
                inputMode="decimal"
                placeholder="0.00"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />
            {symbol && (
                <InputGroupAddon align="inline-end">{symbol}</InputGroupAddon>
            )}
        </InputGroup>
    );
}

function RivenSection({
    positives,
    negative,
    positiveGroups,
    negativeGroups,
    portalContainer,
    attrMeta,
    setPos,
    addPos,
    removePos,
    setNegative,
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
    positives: AttrInput[];
    negative: AttrInput;
    positiveGroups: WeaponGroup[];
    negativeGroups: WeaponGroup[];
    portalContainer: React.ComponentProps<typeof AttributeCombobox>["container"];
    attrMeta: (slug: string) => AttrMeta | undefined;
    setPos: (i: number, patch: Partial<AttrInput>) => void;
    addPos: () => void;
    removePos: (i: number) => void;
    setNegative: React.Dispatch<React.SetStateAction<AttrInput>>;
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
    // 已选 slug（正负不限），同一词条不可重复选择
    const positiveSlugs = positives.map((r) => r.slug).filter(Boolean);
    return (
        <div className="flex flex-col gap-4">
            {/* 正面词条 */}
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_7rem_2rem] items-center gap-2">
                    <FieldLabel className="text-emerald-600 dark:text-emerald-500">
                        {t("auction.field.positive")}
                    </FieldLabel>
                    <FieldLabel className="text-emerald-600 dark:text-emerald-500">
                        {t("auction.field.value")}
                    </FieldLabel>
                    <span />
                </div>
                {positives.map((row, i) => {
                    // 排除其它正面行 + 负面已选
                    const exclude = new Set(
                        [
                            ...positives.filter((_, idx) => idx !== i).map((r) => r.slug),
                            negative.slug,
                        ].filter(Boolean),
                    );
                    const removable = positives.length > MIN_POSITIVE;
                    return (
                        <div
                            key={i}
                            className="grid grid-cols-[1fr_7rem_2rem] items-center gap-2"
                        >
                            <AttributeCombobox
                                groups={positiveGroups}
                                value={row.slug}
                                onValueChange={(v) => setPos(i, { slug: v })}
                                exclude={exclude}
                                container={portalContainer}
                            />
                            <AttrValueInput
                                value={row.value}
                                onChange={(v) => setPos(i, { value: v })}
                                symbol={unitSymbol(attrMeta(row.slug)?.unit)}
                            />
                            {removable ? (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removePos(i)}
                                >
                                    <XIcon className="size-4" />
                                </Button>
                            ) : (
                                <span />
                            )}
                        </div>
                    );
                })}
                {positives.length < MAX_POSITIVE && (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-fit"
                        onClick={addPos}
                    >
                        <PlusIcon className="size-4" />
                        {t("auction.field.addAttr")}
                    </Button>
                )}
            </div>

            {/* 负面词条 */}
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_7rem_2rem] items-center gap-2">
                    <FieldLabel className="text-destructive">
                        {t("auction.field.negative")}
                    </FieldLabel>
                    <FieldLabel className="text-destructive">
                        {t("auction.field.value")}
                    </FieldLabel>
                    <span />
                </div>
                <div className="grid grid-cols-[1fr_7rem_2rem] items-center gap-2">
                    <AttributeCombobox
                        groups={negativeGroups}
                        value={negative.slug}
                        onValueChange={(v) => setNegative((r) => ({ ...r, slug: v }))}
                        exclude={new Set(positiveSlugs)}
                        container={portalContainer}
                        placeholder={t("auction.negative.none")}
                    />
                    <AttrValueInput
                        value={negative.value}
                        onChange={(v) => setNegative((r) => ({ ...r, value: v }))}
                        symbol={unitSymbol(attrMeta(negative.slug)?.unit)}
                        disabled={!negative.slug}
                    />
                    <span />
                </div>
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
