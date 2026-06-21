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

/** 武器分组（按 rivenType）：key 为 rivenType（""=无分组，如 lich/sister），items 为该组武器选项 */
export interface WeaponGroup {
    key: string;
    items: Option[];
}

export interface AuctionSearchData {
    loading: boolean;
    /** 指定大类的武器选项（label=本地化名, value=slug） */
    weaponOptions: (type: SearchTypeCode) => Option[];
    /** 指定大类的武器分组选项：riven 按 rivenType 分多组；lich/sister 为单个空组 */
    weaponGroups: (type: SearchTypeCode) => WeaponGroup[];
    /** 武器 slug → 本地化名（卡片渲染用） */
    weaponName: (type: SearchTypeCode, slug: string) => string;
    /** 武器 slug → 图标相对路径（卡片渲染用，可能为空） */
    weaponIcon: (type: SearchTypeCode, slug: string) => string;
    /** 紫卡正面词条选项（label=名, value=slug） */
    positiveOptions: Option[];
    /** 紫卡负面词条选项（不含 none/has 自定义项，那两项由组件加） */
    negativeOptions: Option[];
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
            list: { slug: string; i18n: any; rivenType?: string }[] | undefined,
        ) => {
            const options: Option[] = [];
            const bySlug = new Map<string, { name: string; icon: string }>();
            // 按 rivenType 聚合（lich/sister 无该字段，统一落入 "" 组）
            const groupMap = new Map<string, Option[]>();
            for (const w of list ?? []) {
                const info = pickI18n(w.i18n, lang);
                const opt: Option = { label: info.name, value: w.slug };
                options.push(opt);
                bySlug.set(w.slug, { name: info.name, icon: info.icon ?? "" });
                const gk = w.rivenType ?? "";
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

    // 紫卡词条：正面/负面选项 + slug→名
    const attrData = useMemo(() => {
        const positive: Option[] = [];
        const negative: Option[] = [];
        const bySlug = new Map<string, string>();
        for (const a of rivenAttrs.data ?? []) {
            const name = pickI18n(a.i18n, lang).name;
            bySlug.set(a.slug, name);
            if (!a.negativeOnly) positive.push({ label: name, value: a.slug });
            if (!a.positiveOnly) negative.push({ label: name, value: a.slug });
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
        positiveOptions: attrData.positive,
        negativeOptions: attrData.negative,
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
