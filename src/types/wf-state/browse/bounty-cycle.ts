export interface BountyJob {
    /** 节点 key，如 SolNode233 */
    node: string;
    /** 挑战路径，如 /Lotus/Types/Challenges/Zariman/... */
    challenge: string;
    /** 协同 NPC 路径（仅 HexSyndicate 的部分条目有） */
    ally?: string;
}

export interface BountyCycle {
    /** 本轮到期时间，Unix 毫秒时间戳 */
    expiry: number;
    /** 当前轮换，如 "B" */
    rot: string;
    /** 金库轮换，如 "A" */
    vaultRot: string;
    /** 扎里曼当前敌对阵营，如 FC_GRINEER */
    zarimanFaction: string;
    /** 地区 key（ZarimanSyndicate / EntratiLabSyndicate / HexSyndicate ...）→ 赏金列表 */
    bounties: Record<string, BountyJob[]>;
}

export function bountyCycleFromJson(json: any): BountyCycle {
    const bounties: Record<string, BountyJob[]> = {};
    const raw = json?.bounties ?? {};
    for (const [syndicate, jobs] of Object.entries(raw)) {
        bounties[syndicate] = Array.isArray(jobs)
            ? jobs.map(bountyJobFromJson)
            : [];
    }
    return {
        expiry: json?.expiry ?? 0,
        rot: json?.rot ?? "",
        vaultRot: json?.vaultRot ?? "",
        zarimanFaction: json?.zarimanFaction ?? "",
        bounties,
    };
}

function bountyJobFromJson(json: any): BountyJob {
    return {
        node: json?.node ?? "",
        challenge: json?.challenge ?? "",
        ally: json?.ally,
    };
}
