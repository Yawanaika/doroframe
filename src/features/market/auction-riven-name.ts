// 紫卡 Mod 名生成。移植自 doroprime utils/attr_name.dart：
// 按正面词条的 prefix/suffix 组合出所有可能的 Mod 名（创建拍卖时填 item.name 用）。

import type { Attribute } from "@/types/wf-market";

/** 词条 slug → 词缀片段（prefix/suffix） */
const ATTR_NAME_MAP: Record<string, { prefix: string; suffix: string }> = {
    punch_through: { prefix: "Lexi", suffix: "Nok" },
    slash_damage: { prefix: "Sci", suffix: "Sus" },
    impact_damage: { prefix: "Magna", suffix: "Ton" },
    toxin_damage: { prefix: "Toxi", suffix: "Tox" },
    status_duration: { prefix: "Deci", suffix: "Des" },
    ammo_maximum: { prefix: "Ampi", suffix: "Bin" },
    recoil: { prefix: "Zeti", suffix: "Mag" },
    zoom: { prefix: "Hera", suffix: "Lis" },
    channeling_damage: { prefix: "Para", suffix: "Um" },
    channeling_efficiency: { prefix: "Forti", suffix: "Us" },
    critical_chance: { prefix: "Crita", suffix: "Cron" },
    critical_damage: { prefix: "Acri", suffix: "Tis" },
    "base_damage_/_melee_damage": { prefix: "Visi", suffix: "Ata" },
    heat_damage: { prefix: "Igni", suffix: "Pha" },
    multishot: { prefix: "Sati", suffix: "Can" },
    reload_speed: { prefix: "Feva", suffix: "Tak" },
    range: { prefix: "Locti", suffix: "Tor" },
    damage_vs_corpus: { prefix: "Manti", suffix: "Tron" },
    damage_vs_grineer: { prefix: "Argi", suffix: "Con" },
    puncture_damage: { prefix: "Insi", suffix: "Cak" },
    damage_vs_infested: { prefix: "Pura", suffix: "Ada" },
    electric_damage: { prefix: "Vexi", suffix: "Tio" },
    finisher_damage: { prefix: "Exi", suffix: "Cta" },
    "fire_rate_/_attack_speed": { prefix: "Croni", suffix: "Dra" },
    projectile_speed: { prefix: "Conci", suffix: "Nak" },
    magazine_capacity: { prefix: "Arma", suffix: "Tin" },
    status_chance: { prefix: "Hexa", suffix: "Dex" },
    cold_damage: { prefix: "Geli", suffix: "Do" },
    combo_duration: { prefix: "Tempi", suffix: "Nem" },
    critical_chance_on_slide_attack: { prefix: "Pleci", suffix: "Nent" },
    chance_to_gain_extra_combo_count: { prefix: "Laci", suffix: "Nus" },
    chance_to_gain_combo_count: { prefix: "", suffix: "" },
};

function assembleName(attrs: Attribute[]): string | null {
    const seg = (slug: string) => ATTR_NAME_MAP[slug];
    if (attrs.length === 2) {
        const a = seg(attrs[0].urlName);
        const b = seg(attrs[1].urlName);
        if (!a || !b) return null;
        // [Prefix1][suffix2]
        return `${a.prefix}${b.suffix.toLowerCase()}`;
    }
    if (attrs.length === 3) {
        const a = seg(attrs[0].urlName);
        const b = seg(attrs[1].urlName);
        const c = seg(attrs[2].urlName);
        if (!a || !b || !c) return null;
        // [Prefix1]-[prefix2][suffix3]
        return `${a.prefix}-${b.prefix.toLowerCase()}${c.suffix.toLowerCase()}`;
    }
    return null;
}

/** 由词条列表生成所有可能的 Mod 名（正面词条 2~3 个时有效，否则返回 []）。 */
export function generateRivenNames(attrs: Attribute[]): string[] {
    // 仅保留正面、去重 urlName
    const positive: Attribute[] = [];
    for (const attr of attrs) {
        if (!attr.positive) continue;
        if (positive.some((e) => e.urlName === attr.urlName)) continue;
        positive.push(attr);
    }
    if (positive.length < 2 || positive.length > 3) return [];

    const results: string[] = [];
    const permute = (current: Attribute[], remaining: Attribute[]) => {
        if (remaining.length === 0) {
            const name = assembleName(current);
            if (name) results.push(name);
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            permute(
                [...current, remaining[i]],
                remaining.filter((_, idx) => idx !== i),
            );
        }
    };
    permute([], positive);
    return [...new Set(results)];
}
