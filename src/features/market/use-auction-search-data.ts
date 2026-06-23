// 拍卖搜索/创建共用的动态数据：武器、紫卡词条、lich/sister 幻纹与怪癖。
// 全部基于已有的 manifest 查询（useRivenWeaponsQuery 等）派生，按当前语言取展示名。

import { useMemo } from "react";
import { useSettingsStore } from "@/store/settings";
import { pickI18n } from "@/features/market/assets";
import {
    useRivenWeaponsQuery,
    useRivenAttributesQuery,
    useLichWeaponsQuery,
    useLichEphemerasQuery,
    useLichQuirksQuery,
    useSisterWeaponsQuery,
    useSisterEphemerasQuery,
    useSisterQuirksQuery,
} from "@/features/market/queries";
import type { SearchTypeCode } from "@/features/market/auction-constants";

/** 下拉选项：展示名 → 值（武器/怪癖为 slug，词条为词条 slug） */
export interface Option {
    label: string;
    value: string;
}

/** 武器分组（按 group）：key 为 group（""=无分组，如 lich/sister），items 为该组武器选项 */
export interface WeaponGroup {
    key: string;
    items: Option[];
}

/** 带筛选/分组元信息的词条选项 */
type AttrOption = Option & { exclusiveTo: string[]; group: string };

/**
 * 按所选武器类型筛选词条：词条 `exclusiveTo` 列出其专属的 rivenType。
 * 该字段为空 = 通用词条，对所有武器展示；非空则仅对命中的 rivenType 展示。
 * 未选武器（rivenType 为空）时不过滤，返回全量。
 */
function keepForWeapon(opts: AttrOption[], rivenType?: string): AttrOption[] {
    return rivenType
        ? opts.filter(
              (o) => o.exclusiveTo.length === 0 || o.exclusiveTo.includes(rivenType),
          )
        : opts;
}

/** 筛选后按 `group` 分组；default 组置顶，其余按 key 字母序 */
function groupByAttrGroup(opts: AttrOption[], rivenType?: string): WeaponGroup[] {
    const map = new Map<string, Option[]>();
    for (const o of keepForWeapon(opts, rivenType)) {
        const arr = map.get(o.group);
        const item: Option = { label: o.label, value: o.value };
        if (arr) arr.push(item);
        else map.set(o.group, [item]);
    }
    return [...map.entries()]
        .map(([key, items]) => ({ key, items }))
        .sort((a, b) =>
            a.key === "default"
                ? -1
                : b.key === "default"
                  ? 1
                  : a.key.localeCompare(b.key),
        );
}

export interface AuctionSearchData {
    loading: boolean;
    /** 指定大类的武器选项（label=本地化名, value=slug） */
    weaponOptions: (type: SearchTypeCode) => Option[];
    /** 指定大类的武器分组选项：riven 按 group 分多组；lich/sister 为单个空组 */
    weaponGroups: (type: SearchTypeCode) => WeaponGroup[];
    /** 武器 slug → 本地化名（卡片渲染用） */
    weaponName: (type: SearchTypeCode, slug: string) => string;
    /** 武器 slug → 图标相对路径（卡片渲染用，可能为空） */
    weaponIcon: (type: SearchTypeCode, slug: string) => string;
    /** 武器 slug → rivenType（kitgun/melee/pistol/...，用于按武器筛选词条） */
    weaponRivenType: (type: SearchTypeCode, slug: string) => string | undefined;
    /** 按武器 rivenType 筛选的正面词条选项（label=名, value=slug）；rivenType 为空时返回全量 */
    positiveOptionsFor: (rivenType?: string) => Option[];
    /** 按武器 rivenType 筛选的负面词条选项（不含 none/has 自定义项，那两项由组件加）；rivenType 为空时返回全量 */
    negativeOptionsFor: (rivenType?: string) => Option[];
    /** 正面词条按 `group` 分组（先按武器筛选），用于分组 Combobox */
    positiveGroupsFor: (rivenType?: string) => WeaponGroup[];
    /** 负面词条按 `group` 分组（先按武器筛选），用于分组 Combobox */
    negativeGroupsFor: (rivenType?: string) => WeaponGroup[];
    /** 词条 slug → 本地化名（卡片渲染用） */
    attrName: (slug: string) => string;
    /** lich/sister：元素码 → 幻纹本地化名（卡片渲染用） */
    ephemeraName: (type: SearchTypeCode, elementCode: string) => string;
    /** lich/sister 怪癖选项（label=名, value=slug） */
    quirkOptions: (type: SearchTypeCode) => Option[];
    /** lich/sister 怪癖 slug → 本地化名（卡片渲染用） */
    quirkName: (type: SearchTypeCode, slug: string) => string;
}

export function useAuctionSearchData(): AuctionSearchData {
    const lang = useSettingsStore((s) => s.lang);

    const rivenWeapons = useRivenWeaponsQuery();
    const rivenAttrs = useRivenAttributesQuery();
    const lichWeapons = useLichWeaponsQuery();
    const lichEphemeras = useLichEphemerasQuery();
    const lichQuirks = useLichQuirksQuery();
    const sisterWeapons = useSisterWeaponsQuery();
    const sisterEphemeras = useSisterEphemerasQuery();
    const sisterQuirks = useSisterQuirksQuery();

    const loading =
        rivenWeapons.isPending ||
        rivenAttrs.isPending ||
        lichWeapons.isPending ||
        sisterWeapons.isPending;

    // 武器：slug→名 与 名→slug 选项，按大类
    const weaponMaps = useMemo(() => {
        const build = (
            list:
                | { slug: string; i18n: any; group?: string; rivenType?: string }[]
                | undefined,
        ) => {
            const options: Option[] = [];
            const bySlug = new Map<
                string,
                { name: string; icon: string; rivenType?: string }
            >();
            // 按 group 聚合（lich/sister 无该字段，统一落入 "" 组）
            const groupMap = new Map<string, Option[]>();
            for (const w of list ?? []) {
                const info = pickI18n(w.i18n, lang);
                const opt: Option = { label: info.name, value: w.slug };
                options.push(opt);
                bySlug.set(w.slug, {
                    name: info.name,
                    icon: info.icon ?? "",
                    rivenType: w.rivenType,
                });
                const gk = w.group ?? "";
                const arr = groupMap.get(gk);
                if (arr) arr.push(opt);
                else groupMap.set(gk, [opt]);
            }
            options.sort((a, b) => a.label.localeCompare(b.label));
            const groups: WeaponGroup[] = [...groupMap.entries()]
                .map(([key, items]) => ({
                    key,
                    items: items.sort((a, b) => a.label.localeCompare(b.label)),
                }))
                .sort((a, b) => a.key.localeCompare(b.key));
            return { options, bySlug, groups };
        };
        return {
            riven: build(rivenWeapons.data),
            lich: build(lichWeapons.data),
            sister: build(sisterWeapons.data),
        };
    }, [rivenWeapons.data, lichWeapons.data, sisterWeapons.data, lang]);

    // 紫卡词条：正面/负面选项（带 exclusiveTo/group 供按武器筛选与分组）+ slug→名
    const attrData = useMemo(() => {
        const positive: AttrOption[] = [];
        const negative: AttrOption[] = [];
        const bySlug = new Map<string, string>();
        for (const a of rivenAttrs.data ?? []) {
            const name = pickI18n(a.i18n, lang).name;
            bySlug.set(a.slug, name);
            const exclusiveTo = a.exclusiveTo ?? [];
            const group = a.group || "default";
            if (!a.negativeOnly)
                positive.push({ label: name, value: a.slug, exclusiveTo, group });
            if (!a.positiveOnly)
                negative.push({ label: name, value: a.slug, exclusiveTo, group });
        }
        positive.sort((a, b) => a.label.localeCompare(b.label));
        negative.sort((a, b) => a.label.localeCompare(b.label));
        return { positive, negative, bySlug };
    }, [rivenAttrs.data, lang]);

    // 幻纹：元素码 → 名，按大类
    const ephemeraMaps = useMemo(() => {
        const build = (list: { element?: string; i18n: any }[] | undefined) => {
            const byElement = new Map<string, string>();
            for (const e of list ?? []) {
                if (e.element) byElement.set(e.element, pickI18n(e.i18n, lang).name);
            }
            return byElement;
        };
        return {
            lich: build(lichEphemeras.data),
            sister: build(sisterEphemeras.data),
        };
    }, [lichEphemeras.data, sisterEphemeras.data, lang]);

    // 怪癖：选项 + slug→名，按大类
    const quirkMaps = useMemo(() => {
        const build = (list: { slug: string; i18n: any }[] | undefined) => {
            const options: Option[] = [];
            const bySlug = new Map<string, string>();
            for (const q of list ?? []) {
                const name = pickI18n(q.i18n, lang).name;
                options.push({ label: name, value: q.slug });
                bySlug.set(q.slug, name);
            }
            options.sort((a, b) => a.label.localeCompare(b.label));
            return { options, bySlug };
        };
        return {
            lich: build(lichQuirks.data),
            sister: build(sisterQuirks.data),
        };
    }, [lichQuirks.data, sisterQuirks.data, lang]);

    return {
        loading,
        weaponOptions: (type) => weaponMaps[type].options,
        weaponGroups: (type) => weaponMaps[type].groups,
        weaponName: (type, slug) => weaponMaps[type].bySlug.get(slug)?.name ?? slug,
        weaponIcon: (type, slug) => weaponMaps[type].bySlug.get(slug)?.icon ?? "",
        weaponRivenType: (type, slug) =>
            weaponMaps[type].bySlug.get(slug)?.rivenType,
        positiveOptionsFor: (rivenType) =>
            keepForWeapon(attrData.positive, rivenType).map(({ label, value }) => ({
                label,
                value,
            })),
        negativeOptionsFor: (rivenType) =>
            keepForWeapon(attrData.negative, rivenType).map(({ label, value }) => ({
                label,
                value,
            })),
        positiveGroupsFor: (rivenType) =>
            groupByAttrGroup(attrData.positive, rivenType),
        negativeGroupsFor: (rivenType) =>
            groupByAttrGroup(attrData.negative, rivenType),
        attrName: (slug) => attrData.bySlug.get(slug) ?? slug,
        ephemeraName: (type, elementCode) =>
            type === "riven"
                ? ""
                : ephemeraMaps[type].get(elementCode) ?? "",
        quirkOptions: (type) => (type === "riven" ? [] : quirkMaps[type].options),
        quirkName: (type, slug) =>
            type === "riven" ? slug : quirkMaps[type].bySlug.get(slug) ?? slug,
    };
}
