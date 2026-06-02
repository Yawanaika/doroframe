import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface Descent extends Base {
    randSeed: number;
    challenges: DescentChallenge[];
}

interface DescentChallenge {
    index: number;
    type: string;
    challenge: string;
}

export function descentFromJson(json: any): Descent {
    return {
        ...parseBase(json),
        randSeed: json?.RandSeed ?? 0,
        challenges: (json?.Challenges ?? []).map(descentChallengeFromJson),
    };
}

export function descentToJson(d: Descent) {
    return {
        ...serializeBase(d),
        randSeed: d.randSeed,
        challenges: d.challenges.map(descentChallengeToJson),
    };
}

function descentChallengeFromJson(json: any): DescentChallenge {
    return {
        index: json?.Index ?? 0,
        type: json?.Type ?? "",
        challenge: json?.Challenge ?? "",
    };
}

function descentChallengeToJson(c: DescentChallenge) {
    return {
        index: c.index,
        type: c.type,
        challenge: c.challenge,
    };
}
