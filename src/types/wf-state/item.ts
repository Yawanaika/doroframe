export interface Item {
    name?: string;
    description?: string;
    icon?: string;
    resultType?: string;
    category?: string;
    era?: string;
    fusionPoints?: number;
}

export function itemFromJson(json: any): Item {
    return {
        name: json?.name,
        description: json?.description,
        icon: json?.icon,
        resultType: json?.resultType,
        category: json?.category,
        era: json?.era,
        fusionPoints: json?.fusionPoints,
    };
}

export function itemToJson(item: Item) {
    return {
        name: item.name,
        description: item.description,
        icon: item.icon,
        resultType: item.resultType,
        category: item.category,
        era: item.era,
        fusionPoints: item.fusionPoints,
    };
}