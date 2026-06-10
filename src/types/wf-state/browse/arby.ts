export interface ArbyEntry {
    /** 该轮仲裁开始的 Unix 时间戳（秒） */
    activation: number;
    /** 节点 key，如 SettlementNode11 */
    node: string;
}

export type Arby = ArbyEntry[];

export function arbyFromJson(json: any): Arby {
    if (!json || typeof json !== "object") return [];
    return Object.entries(json as Record<string, string>)
        .map(([ts, node]) => ({ activation: Number(ts), node: String(node) }))
        .sort((a, b) => a.activation - b.activation);
}
