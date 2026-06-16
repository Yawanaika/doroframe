import { memo, useMemo } from "react";
import type { SpIncursion } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useSpIncursionsQuery } from "@/features/world/queries";
import { resolveNode } from "@/lib/wpep/nodes";

// 钢铁之路敌人等级在节点基础上 +100
const STEEL_PATH_LEVEL_OFFSET = 100;

/** 从所有轮次中挑出当前生效的一轮（activation 已开始且最接近现在） */
function pickActiveIncursion(entries: SpIncursion[]): SpIncursion | null {
    const now = Date.now() / 1000;
    const active = entries.filter((entry) => entry.activation <= now);
    if (active.length) return active[active.length - 1];
    return null;
}

const SpIncursionRow = memo(function SpIncursionRow({
    nodeKey,
}: {
    nodeKey: string;
}) {
    const node = resolveNode(nodeKey);
    const minEnemyLevel = node.minEnemyLevel + STEEL_PATH_LEVEL_OFFSET;
    const maxEnemyLevel = node.maxEnemyLevel + STEEL_PATH_LEVEL_OFFSET;
    return (
        <EventCard
            title={`${node.missionTypeZh} (${minEnemyLevel} - ${maxEnemyLevel})`}
            subtitle={`${node.nameZh}· ${node.systemNameZh}`}
            prefixImg={"/images/resources/SteelEssence.png"}
            prefixTip="钢铁精华"
            endImg={node.factionCode ? `/images/camp/${node.factionCode}.png` : undefined}
            endTip={node.factionNameZh}
        >
            <div className="text-xs text-muted-foreground">{node.factionNameZh}</div>
        </EventCard>
    );
});

export function SpIncursionsCard() {
    const { data, isPending, isError, error } = useSpIncursionsQuery();
    const incursion = useMemo(() => pickActiveIncursion(data ?? []), [data]);

    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!incursion?.nodes.length) return <CardEmpty text="暂无钢铁侵袭任务" />;

    return (
        <div className="grid gap-3 md:grid-cols-2">
            {incursion.nodes.map((nodeKey, i) => (
                <SpIncursionRow key={`${nodeKey}-${i}`} nodeKey={nodeKey} />
            ))}
        </div>
    );
}
