import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface KnownCalendarSeason extends Base {
    season: string;
    yearIteration: number;
    version: number;
    upgradeAvaliabilityRequirements: string[];
    days: Day[];
}

interface Day {
    day: number;
    events: DayEvent[];
}

interface DayEvent {
    type: string;
    challenge?: string;
    reward?: string;
    upgrade?: string;
}

export function knownCalendarSeasonFromJson(json: any): KnownCalendarSeason {
    return {
        ...parseBase(json),
        season: json?.Season ?? "",
        yearIteration: json?.YearIteration ?? 0,
        version: json?.Version ?? 0,
        upgradeAvaliabilityRequirements: json?.UpgradeAvaliabilityRequirements ?? [],
        days: (json?.Days ?? []).map(dayFromJson),
    };
}

export function knownCalendarSeasonToJson(s: KnownCalendarSeason) {
    return {
        ...serializeBase(s),
        season: s.season,
        yearIteration: s.yearIteration,
        version: s.version,
        upgradeAvaliabilityRequirements: s.upgradeAvaliabilityRequirements,
        days: s.days.map(dayToJson),
    };
}

function dayFromJson(json: any): Day {
    return {
        day: json?.day ?? 0,
        events: (json?.events ?? []).map(dayEventFromJson),
    };
}

function dayToJson(d: Day) {
    return {
        day: d.day,
        events: d.events.map(dayEventToJson),
    };
}

function dayEventFromJson(json: any): DayEvent {
    return {
        type: json?.type ?? "",
        challenge: json?.challenge,
        reward: json?.reward,
        upgrade: json?.upgrade,
    };
}

function dayEventToJson(e: DayEvent) {
    return {
        type: e.type,
        challenge: e.challenge,
        reward: e.reward,
        upgrade: e.upgrade,
    };
}
