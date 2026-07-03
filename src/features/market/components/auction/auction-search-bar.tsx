// 拍卖搜索栏。riven 与 lich/sister 两套筛选项随大类切换。
// 校验门槛同 doroprime：武器非空 / 正面词条非空 / (负面非空且武器非空) 三者之一才发起搜索。

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { WeaponCombobox } from "@/features/market/components/auction/weapon-combobox";
import { AttributeMultiCombobox } from "@/features/market/components/auction/attribute-combobox";
import { PolaritySelect } from "@/features/market/components/auction/polarity-select";
import {
    useAuctionSearchData,
    type WeaponGroup,
} from "@/features/market/use-auction-search-data";
import {
    SEARCH_TYPES,
    BUYOUT_POLICIES,
    WEAPON_ELEMENTS,
    SORT_OPTIONS,
    NEGATIVE_CUSTOM,
    type SearchTypeCode,
    type BuyoutPolicyCode,
    type WeaponElementCode,
    type PolarityCode, elementImg, DAMAGE_MIN, DAMAGE_MAX, DAMAGE_STEP,
} from "@/features/market/auction-constants";
import type { AuctionSearchParams } from "@/types/wf-market";
import { RangeInput } from "@/components/ui/range-input";

interface Props {
    onSearch: (params: AuctionSearchParams) => void;
    onReset: () => void;
}

export function AuctionSearchBar({ onSearch, onReset }: Props) {
    const { t } = useTranslation();
    const data = useAuctionSearchData();

    const [type, setType] = useState<SearchTypeCode>("riven");
    const [weaponSlug, setWeaponSlug] = useState("");
    const [weaponInput, setWeaponInput] = useState("");
    const [positive, setPositive] = useState<string[]>([]);
    const [negative, setNegative] = useState<string[]>([]);
    const [element, setElement] = useState<WeaponElementCode>("all");
    const [hasEphemera, setHasEphemera] = useState(false);
    const [damageMin, setDamageMin] = useState("");
    const [damageMax, setDamageMax] = useState("");
    const [polarity, setPolarity] = useState<PolarityCode>("any");
    const [buyoutPolicy, setBuyoutPolicy] = useState<BuyoutPolicyCode>("all");
    const [sortBy, setSortBy] = useState<string>(SORT_OPTIONS.riven[0]);

    // 所选武器的 rivenType，用于按武器筛选正/负词条（未选武器则不筛选）
    const weaponType = weaponSlug
        ? data.weaponRivenType("riven", weaponSlug)
        : undefined;

    const positiveGroups = useMemo(
        () => data.positiveGroupsFor(weaponType),
        [data, weaponType],
    );

    // 负面词条：自定义组（none/has，无标签）置顶，其后接按 group 分组的词条
    const negativeGroups: WeaponGroup[] = useMemo(
        () => [
            {
                key: "",
                items: NEGATIVE_CUSTOM.map((c) => ({
                    label: t(`auction.negative.${c}`),
                    value: c,
                })),
            },
            ...data.negativeGroupsFor(weaponType),
        ],
        [data, weaponType, t],
    );

    const onTypeChange = (next: SearchTypeCode) => {
        setType(next);
        setWeaponSlug("");
        setWeaponInput("");
        setPositive([]);
        setNegative([]);
        setElement("all");
        setHasEphemera(false);
        setDamageMin("");
        setDamageMax("");
        setPolarity("any");
        setSortBy(SORT_OPTIONS[next][0]);
    };

    const buildParams = (): AuctionSearchParams => {
        // 正面词条为空但排序按正面 → 回落价格升序
        let sort = sortBy;
        if (positive.length === 0 && sort.startsWith("positive_attr")) {
            sort = "price_asc";
        }
        const p: AuctionSearchParams = {
            type,
            weaponUrlName: weaponSlug || undefined,
            sortBy: sort,
            buyoutPolicy,
        };
        if (type === "riven") {
            if (positive.length) p.positiveStats = positive.join(",");
            if (negative.length) p.negativeStats = negative.join(",");
            if (polarity !== "any") p.polarity = polarity;
        } else {
            if (hasEphemera && element !== "all") p.element = element;
            p.hasEphemera = hasEphemera;
            const dMin = Number(damageMin);
            const dMax = Number(damageMax);
            if (damageMin && Number.isFinite(dMin)) p.damageMin = dMin;
            if (damageMax && Number.isFinite(dMax)) p.damageMax = dMax;
        }
        return p;
    };

    const canSearch =
        weaponSlug !== "" ||
        positive.length > 0 ||
        (negative.length > 0 && weaponSlug !== "");

    const submit = () => {
        if (!canSearch) return;
        onSearch(buildParams());
    };

    const reset = () => {
        onTypeChange(type);
        setBuyoutPolicy("all");
        onReset();
    };

    return (
        <div className="flex flex-col gap-1">
            {/* 大类 + 武器 */}
            <div className="grid grid-cols-2 gap-3">
                <Field>
                    <FieldLabel>{t("auction.field.type")}</FieldLabel>
                    <Select value={type} onValueChange={(v) => onTypeChange(v as SearchTypeCode)}>
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
                                // 换武器后剔除对新武器不适用的已选词条
                                const rt = data.weaponRivenType("riven", o.value);
                                const posValid = new Set(
                                    data.positiveOptionsFor(rt).map((x) => x.value),
                                );
                                const negValid = new Set(
                                    data.negativeOptionsFor(rt).map((x) => x.value),
                                );
                                setPositive((prev) => prev.filter((v) => posValid.has(v)));
                                setNegative((prev) =>
                                    prev.filter(
                                        (v) =>
                                            negValid.has(v) ||
                                            (NEGATIVE_CUSTOM as readonly string[]).includes(v),
                                    ),
                                );
                            }
                        }}
                    />
                </Field>
            </div>

            {/* riven: 正/负词条；lich/sister: 元素 + 幻纹 + 伤害 */}
            {type === "riven" ? (
                <div className="grid grid-cols-[7fr_3fr] gap-3">
                    <Field>
                        <FieldLabel>{t("auction.field.positive")}</FieldLabel>
                        <AttributeMultiCombobox
                            groups={positiveGroups}
                            value={positive}
                            onChange={setPositive}
                            max={3}
                            exclude={new Set(negative)}
                            placeholder={t("auction.field.positive")}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>{t("auction.field.negative")}</FieldLabel>
                        <AttributeMultiCombobox
                            groups={negativeGroups}
                            value={negative}
                            onChange={setNegative}
                            max={1}
                            exclude={new Set(positive)}
                            placeholder={t("auction.field.negative")}
                        />
                    </Field>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    <Field>
                        <FieldLabel>{t("auction.field.element")}</FieldLabel>
                        <Select
                            value={element}
                            onValueChange={(v) => setElement(v as WeaponElementCode)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {WEAPON_ELEMENTS.map((e) => (
                                    <SelectItem key={e} value={e}>
                                        <img
                                            className="inline-block h-6 w-6"
                                            src={elementImg(e)}
                                            alt={t(`auction.element.${e}`)}
                                        />
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
                                variant={!hasEphemera ? "default" : "outline"}
                                onClick={() => setHasEphemera(false)}
                            >
                                {t("auction.ephemera.no")}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={hasEphemera ? "default" : "outline"}
                                onClick={() => setHasEphemera(true)}
                            >
                                {t("auction.ephemera.yes")}
                            </Button>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>{t("auction.field.damage")}</FieldLabel>
                        <RangeInput
                            min={DAMAGE_MIN}
                            max={DAMAGE_MAX}
                            step={DAMAGE_STEP}
                            minValue={damageMin}
                            maxValue={damageMax}
                            onMinChange={setDamageMin}
                            onMaxChange={setDamageMax}
                            minPlaceholder={String(DAMAGE_MIN)}
                            maxPlaceholder={String(DAMAGE_MAX)}
                        />
                    </Field>
                </div>
            )}

            {/* 买断策略 + (极性 / 占位) + 排序 */}
            <div className="grid grid-cols-3 gap-3">
                <Field>
                    <FieldLabel>{t("auction.field.policy")}</FieldLabel>
                    <div className="flex gap-2">
                        {BUYOUT_POLICIES.map((bp) => (
                            <Button
                                key={bp}
                                type="button"
                                size="sm"
                                variant={buyoutPolicy === bp ? "default" : "outline"}
                                onClick={() => setBuyoutPolicy(bp)}
                            >
                                {t(`auction.policy.${bp}`)}
                            </Button>
                        ))}
                    </div>
                </Field>
                {type === "riven" ? (
                    <Field>
                        <FieldLabel>{t("auction.field.polarity")}</FieldLabel>
                        <PolaritySelect
                            value={polarity}
                            onValueChange={(v) => setPolarity(v as PolarityCode)}
                        />
                    </Field>
                ) : (
                    <div />
                )}
                <Field>
                    <FieldLabel>{t("auction.field.sort")}</FieldLabel>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS[type].map((s) => (
                                <SelectItem key={s} value={s}>
                                    {t(`auction.sort.${s}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            {/* 操作 */}
            <div className="flex gap-2">
                <Button className="flex-1" onClick={submit} disabled={!canSearch}>
                    <SearchIcon className="size-4" />
                    {t("auction.action.search")}
                </Button>
                <Button variant="outline" onClick={reset}>
                    <RotateCcwIcon className="size-4" />
                    {t("auction.action.reset")}
                </Button>
            </div>
        </div>
    );
}
