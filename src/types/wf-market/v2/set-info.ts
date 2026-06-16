import {Item, itemFromJson, itemToJson} from "@/types/wf-market/item.ts";

export interface SetInfo {
    id: string;
    items: Item[]
}

export function setInfoFromJson(json: any): SetInfo {
    return {
        id: json.id,
        items: json.items.map(itemFromJson),
    }
}

export function setInfoToJson(setInfo: SetInfo): any {
    return {
        id: setInfo.id,
        items: setInfo.items.map(itemToJson),
    }
}
