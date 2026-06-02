import { Base, parseBase, serializeBase } from "@/types/wf-state/world/base.ts";
import {
    EndlessXpChoice,
    endlessXpChoiceFromJson,
    endlessXpChoiceToJson,
} from "@/types/wf-state/world/endless-xp-choice.ts";

export interface EndlessXpSchedule extends Base {
    categoryChoices: EndlessXpChoice[];
}

export function endlessXpScheduleFromJson(json: any): EndlessXpSchedule {
    return {
        ...parseBase(json),
        categoryChoices: (json?.CategoryChoices ?? []).map(endlessXpChoiceFromJson),
    };
}

export function endlessXpScheduleToJson(s: EndlessXpSchedule) {
    return {
        ...serializeBase(s),
        categoryChoices: s.categoryChoices.map(endlessXpChoiceToJson),
    };
}
