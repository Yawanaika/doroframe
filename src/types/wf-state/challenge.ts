export interface Challenge {
    name: string;
    description?: string;
    flavour?: string;
    icon: string;
    challengeName?: string;
    challengeDescription?: string;
}

export function challengeFromJson(json: any): Challenge {
    return {
        name: json.name,
        description: json?.description,
        flavour: json?.flavour,
        icon: json.icon,
        challengeName: json?.challengeName,
        challengeDescription: json?.challengeDescription,
    };
}

export function challengeToJson(c: Challenge) {
    return {
        name: c.name,
        description: c.description,
        flavour: c.flavour,
        icon: c.icon,
        challengeName: c.challengeName,
        challengeDescription: c.challengeDescription,
    };
}