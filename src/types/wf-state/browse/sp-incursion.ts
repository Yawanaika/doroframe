export interface SpIncursion {
    /** 本轮钢铁入侵开始的 Unix 时间戳（秒） */
    activation: number;
    /** 节点 key 列表 */
    nodes: string[];
}

export function spIncursionsFromJson(json: any): SpIncursion[] {
    if (!json || typeof json !== "object") return [];
    return Object.entries(json as Record<string, string[]>)
        .map(([ts, nodes]) => ({
            activation: Number(ts),
            nodes: Array.isArray(nodes) ? nodes.map(String) : [],
        }))
        .sort((a, b) => a.activation - b.activation);
}
