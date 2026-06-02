import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";

export interface EndlessXpChoice extends Base {
    category: string;
    choice: string[];
}

export function endlessXpChoiceFromJson(json: any): EndlessXpChoice {
    return {
        ...parseBase(json),
        category: json?.Category ?? "",
        choice: json?.Choices ?? json?.Choice ?? [],
    };
}

export function endlessXpChoiceToJson(c: EndlessXpChoice) {
    return {
        ...serializeBase(c),
        category: c.category,
        choice: c.choice,
    };
}
