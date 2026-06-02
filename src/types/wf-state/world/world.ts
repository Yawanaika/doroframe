import { Alert, alertFromJson, alertToJson } from "@/types/wf-state/world/alert.ts";
import {
    ActiveMission,
    activeMissionFromJson,
    activeMissionToJson,
} from "@/types/wf-state/world/active-mission.ts";
import { Goal, goalFromJson, goalToJson } from "@/types/wf-state/world/goal.ts";
import { Sorty, sortyFromJson, sortyToJson } from "@/types/wf-state/world/sorty.ts";
import {
    Syndicate,
    syndicateFromJson,
    syndicateToJson,
} from "@/types/wf-state/world/syndicate.ts";
import {
    Invasion,
    invasionFromJson,
    invasionToJson,
} from "@/types/wf-state/world/invasion.ts";
import {
    VoidTrader,
    voidTraderFromJson,
    voidTraderToJson,
} from "@/types/wf-state/world/void-trader.ts";
import {
    PrimeVault,
    primeVaultFromJson,
    primeVaultToJson,
} from "@/types/wf-state/world/prime-vault.ts";
import {
    VoidStorm,
    voidStormFromJson,
    voidStormToJson,
} from "@/types/wf-state/world/void-storm.ts";
import {
    DailyDeal,
    dailyDealFromJson,
    dailyDealToJson,
} from "@/types/wf-state/world/daily-deal.ts";
import { ProjectPct } from "@/types/wf-state/world/project-pct.ts";
import {
    EndlessXpChoice,
    endlessXpChoiceFromJson,
    endlessXpChoiceToJson,
} from "@/types/wf-state/world/endless-xp-choice.ts";
import {
    EndlessXpSchedule,
    endlessXpScheduleFromJson,
    endlessXpScheduleToJson,
} from "@/types/wf-state/world/endless-xp-schedule.ts";
import {
    SeasonInfo,
    seasonInfoFromJson,
    seasonInfoToJson,
} from "@/types/wf-state/world/season-info.ts";
import {
    KnownCalendarSeason,
    knownCalendarSeasonFromJson,
    knownCalendarSeasonToJson,
} from "@/types/wf-state/world/known-calendar-season.ts";
import {
    Conquest,
    conquestFromJson,
    conquestToJson,
} from "@/types/wf-state/world/conquest.ts";
import {
    Descent,
    descentFromJson,
    descentToJson,
} from "@/types/wf-state/world/descent.ts";

export interface World {
    worldSeed: string;
    version: number;
    mobileVersion: string;
    buildLabel: string;
    time: number;
    goals: Goal[];
    alerts: Alert[];
    sorties: Sorty[];
    liteSorties: Sorty[];
    syndicateMissions: Syndicate[];
    activeMissions: ActiveMission[];
    invasions: Invasion[];
    voidTraders: VoidTrader[];
    primeVaultTraders: PrimeVault[];
    voidStorms: VoidStorm[];
    dailyDeals: DailyDeal[];
    projectPct: ProjectPct;
    endlessXpChoices: EndlessXpChoice[];
    endlessXpSchedule: EndlessXpSchedule[];
    seasonInfo?: SeasonInfo;
    knownCalendarSeasons: KnownCalendarSeason[];
    conquests: Conquest[];
    descents: Descent[];
}

const arr = <T>(json: any, key: string, parse: (j: any) => T): T[] =>
    Array.isArray(json?.[key]) ? json[key].map(parse) : [];

export function worldFromJson(json: any): World {
    return {
        worldSeed: json?.WorldSeed ?? "",
        version: json?.Version ?? 0,
        mobileVersion: json?.MobileVersion ?? "",
        buildLabel: json?.BuildLabel ?? "",
        time: json?.Time ?? 0,
        goals: arr(json, "Goals", goalFromJson),
        alerts: arr(json, "Alerts", alertFromJson),
        sorties: arr(json, "Sorties", sortyFromJson),
        liteSorties: arr(json, "LiteSorties", sortyFromJson),
        syndicateMissions: arr(json, "SyndicateMissions", syndicateFromJson),
        activeMissions: arr(json, "ActiveMissions", activeMissionFromJson),
        invasions: arr(json, "Invasions", invasionFromJson),
        voidTraders: arr(json, "VoidTraders", voidTraderFromJson),
        primeVaultTraders: arr(json, "PrimeVaultTraders", primeVaultFromJson),
        voidStorms: arr(json, "VoidStorms", voidStormFromJson),
        dailyDeals: arr(json, "DailyDeals", dailyDealFromJson),
        projectPct: { values: json?.ProjectPct ?? [] },
        endlessXpChoices: arr(json, "EndlessXpChoices", endlessXpChoiceFromJson),
        endlessXpSchedule: arr(json, "EndlessXpSchedule", endlessXpScheduleFromJson),
        seasonInfo: json?.SeasonInfo ? seasonInfoFromJson(json.SeasonInfo) : undefined,
        knownCalendarSeasons: arr(json, "KnownCalendarSeasons", knownCalendarSeasonFromJson),
        conquests: arr(json, "Conquests", conquestFromJson),
        descents: arr(json, "Descents", descentFromJson),
    };
}

export function worldToJson(w: World) {
    return {
        worldSeed: w.worldSeed,
        version: w.version,
        mobileVersion: w.mobileVersion,
        buildLabel: w.buildLabel,
        time: w.time,
        goals: w.goals.map(goalToJson),
        alerts: w.alerts.map(alertToJson),
        sorties: w.sorties.map(sortyToJson),
        liteSorties: w.liteSorties.map(sortyToJson),
        syndicateMissions: w.syndicateMissions.map(syndicateToJson),
        activeMissions: w.activeMissions.map(activeMissionToJson),
        invasions: w.invasions.map(invasionToJson),
        voidTraders: w.voidTraders.map(voidTraderToJson),
        primeVaultTraders: w.primeVaultTraders.map(primeVaultToJson),
        voidStorms: w.voidStorms.map(voidStormToJson),
        dailyDeals: w.dailyDeals.map(dailyDealToJson),
        projectPct: w.projectPct,
        endlessXpChoices: w.endlessXpChoices.map(endlessXpChoiceToJson),
        endlessXpSchedule: w.endlessXpSchedule.map(endlessXpScheduleToJson),
        seasonInfo: w.seasonInfo ? seasonInfoToJson(w.seasonInfo) : undefined,
        knownCalendarSeasons: w.knownCalendarSeasons.map(knownCalendarSeasonToJson),
        conquests: w.conquests.map(conquestToJson),
        descents: w.descents.map(descentToJson),
    };
}
