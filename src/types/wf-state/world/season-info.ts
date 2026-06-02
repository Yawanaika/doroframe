import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface SeasonInfo extends Base {
    affiliationTag: string;
    season: number;
    phase: number;
    params?: string;
    activeChallenges: SeasonChallenge[];
}

interface SeasonChallenge extends Base {
    daily?: boolean;
    challenge: string;
}

export function seasonInfoFromJson(json: any): SeasonInfo {
    return {
        ...parseBase(json),
        affiliationTag: json?.AffiliationTag ?? "",
        season: json?.Season ?? 0,
        phase: json?.Phase ?? 0,
        params: json?.Params?? "",
        activeChallenges: (json?.ActiveChallenges ?? []).map(seasonChallengeFromJson),
    };
}

export function seasonInfoToJson(s: SeasonInfo) {
    return {
        ...serializeBase(s),
        affiliationTag: s.affiliationTag,
        season: s.season,
        phase: s.phase,
        params: s.params,
        activeChallenges: s.activeChallenges.map(seasonChallengeToJson),
    };
}

function seasonChallengeFromJson(json: any): SeasonChallenge {
    return {
        ...parseBase(json),
        daily: json?.Daily,
        challenge: json?.Challenge ?? "",
    };
}

function seasonChallengeToJson(c: SeasonChallenge) {
    return {
        ...serializeBase(c),
        daily: c.daily,
        challenge: c.challenge,
    };
}
