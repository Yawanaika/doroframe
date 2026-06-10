import {Base, parseBase, serializeBase} from "./base";

export interface Syndicate extends Base{
    tag: string;
    seed: number;
    nodes?: string[];
    jobs?: Job[];
}

interface Job {
    jobType: string;
    rewards: string;
    masteryReq: number;
    minEnemyLevel: number;
    maxEnemyLevel: number;
    xpAmount: number[];
    locationTag?: string;
    isVault?: boolean;
}

export function syndicateFromJson(json: any): Syndicate {
    return {
        ...parseBase( json),
        tag: json?.Tag ?? "",
        seed: json?.Seed ?? 0,
        nodes: json?.Nodes,
        jobs: json?.Jobs ? json.Jobs.map(jobFromJson) : undefined,
    };
}

export function syndicateToJson(s: Syndicate) {
    return {
        ...serializeBase(s),
        tag: s.tag,
        seed: s.seed,
        nodes: s.nodes,
        jobs: s.jobs ? s.jobs.map(jobToJson) : undefined,
    };
}

function jobFromJson(json: any): Job {
    return {
        jobType: json?.jobType ?? "",
        rewards: json?.rewards ?? "",
        masteryReq: json?.masteryReq ?? 0,
        minEnemyLevel: json?.minEnemyLevel ?? 0,
        maxEnemyLevel: json?.maxEnemyLevel ?? 0,
        xpAmount: json?.xpAmounts ?? json?.xpAmount ?? [],
        locationTag: json?.locationTag,
        isVault: json?.isVault,
    };
}

function jobToJson(j: Job) {
    return {
        jobType: j.jobType,
        rewards: j.rewards,
        masteryReq: j.masteryReq,
        minEnemyLevel: j.minEnemyLevel,
        maxEnemyLevel: j.maxEnemyLevel,
        xpAmount: j.xpAmount,
        locationTag: j.locationTag,
        isVault: j.isVault,
    };
}
