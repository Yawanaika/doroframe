import { memo, useMemo, useState } from "react";
import type { Invasion } from "@/types/wf-state";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useInvasionsQuery } from "@/features/world/queries";
import { resolveNode } from "@/lib/wpep/nodes";
import {itemName, Regions, tr} from "@/lib/wpep";
import { cn } from "@/lib/utils";
import {EventCard} from "@/components/event-card.tsx";
import { Progress } from "@/components/ui/progress";

const INFESTATION = "FC_INFESTATION";
const ASSASSINATION = "MT_ASSASSINATION";

type InvasionEntry = { invasion: Invasion; nodeKey: string };
type SystemGroup = { systemKey: string; systemNameZh: string; entries: InvasionEntry[] };

/// 依据入侵所在星球进行分组
function groupBySystem(invasions: Invasion[]): SystemGroup[] {
    const uniqueInvasions = new Map<string, Invasion>();

    for (const invasion of invasions) {
        if (invasion.completed) continue;
        const key = `${invasion.node}_${invasion.faction}`;
        const existing = uniqueInvasions.get(key);
        if (!existing) {
            uniqueInvasions.set(key, invasion);
            continue;
        }
        if (existing.completed && !invasion.completed) {
            uniqueInvasions.set(key, invasion);
        } else if (existing.completed === invasion.completed) {
            if (existing.count === 0 && invasion.count !== 0) {
                uniqueInvasions.set(key, invasion);
            }
        }
    }

    const grouped = new Map<string, SystemGroup>();
    for (const invasion of uniqueInvasions.values()) {
        const region = (Regions as Record<string, { systemName?: string } | undefined>)[invasion.node];
        if (!region) continue;
        const systemKey = region.systemName ?? "";
        if (!systemKey) continue;
        const systemNameZh = tr(systemKey);
        const bucket = grouped.get(systemKey) ?? {
            systemKey,
            systemNameZh,
            entries: [],
        };
        bucket.entries.push({ invasion, nodeKey: invasion.node });
        grouped.set(systemKey, bucket);
    }

    return Array.from(grouped.values());
}

function progressOf(inv: Invasion): number {
    if (inv.faction === INFESTATION) {
        return inv.count / Math.max(1, inv.goal);
    }
    return (inv.count + inv.goal) / Math.max(1, 2 * inv.goal);
}

function ProgressBar({ value }: { value: number }) {
    const clamped = Math.max(0, Math.min(1, value)) * 100;
    return (
        <Progress value={clamped} className="h-2" />
    );
}

function isPhorid(group: SystemGroup): boolean {
    if (group.entries.length !== 1) return false;
    const { invasion } = group.entries[0];
    const region = (Regions as Record<string, { missionType?: string } | undefined>)[invasion.node];
    return region?.missionType === ASSASSINATION && invasion.faction === INFESTATION;
}

const InvasionSubCard = memo(function InvasionSubCard({ invasion }: { invasion: Invasion }) {
    if (invasion.completed) return null;
    const node = resolveNode(invasion.node);
    const raw = progressOf(invasion);
    const i = raw >= 0;
    const barValue = i ? raw : 1 + raw;

    const attacker = invasion.attackerReward?.countedItems?.[0];
    const defender = invasion.defenderReward?.countedItems?.[0];

    return (
        <EventCard title={node.nameZh} className="mt-2">
            <div className="flex flex-col gap-2">
                <ProgressBar value={barValue} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        {attacker
                            ? `${itemName(attacker.itemType) || attacker.itemType} x ${attacker.itemCount}`
                            : ""}
                    </span>
                    <span>
                        {defender
                            ? `${defender.itemCount} x ${itemName(defender.itemType) || defender.itemType}`
                            : ""}
                    </span>
                </div>
            </div>
        </EventCard>
    );
});

const GroupedCard = memo(function GroupedCard({ group }: { group: SystemGroup }) {
    const [expanded, setExpanded] = useState(false);

    const allCompleted = group.entries.every((e) => e.invasion.completed);
    if (allCompleted) return null;

    const head = group.entries[0].invasion;

    let totalProgress = 0;
    let activeCount = 0;
    for (const { invasion } of group.entries) {
        if (invasion.completed) continue;
        totalProgress += progressOf(invasion);
        activeCount++;
    }
    const avg = activeCount > 0 ? totalProgress / activeCount : 0;
    const i = avg >= 0;
    const barValue = i ? avg : 1 + avg;

    const attackerPct = (i ? avg * 100 : 100 + avg * 100).toFixed(2);
    const defenderPct = (i ? 100 - avg * 100 : -avg * 100).toFixed(2);

    const phorid = isPhorid(group);
    const titleText = phorid
        ? `${group.systemNameZh} (Phorid 现形)`
        : `${group.systemNameZh} (${tr(head.faction)})`;

    return (
        <EventCard
            title={titleText}
            prefixImg={`/camp/${head.faction}.png`}
            prefixTip={tr(head.faction)}
            endImg={`/camp/${head.defenderFaction}.png`}
            endTip={tr(head.defenderFaction)}
            className="cursor-pointer"
            onClick={() => setExpanded((v) => !v)}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <ProgressBar value={barValue} />
                    <img
                        src={`/camp/${head.defenderFaction}.png`}
                        alt={head.defenderFaction}
                        className="w-6 h-6 shrink-0 object-contain"
                    />
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span>
                        {tr(head.faction)} {attackerPct}%
                    </span>
                    <span>
                        {defenderPct}% {tr(head.defenderFaction)}
                    </span>
                </div>
                <div className={cn("flex flex-col", !expanded && "hidden")}>
                    {group.entries.map(({ invasion }) => (
                        <InvasionSubCard key={invasion.id} invasion={invasion} />
                    ))}
                </div>
            </div>
        </EventCard>
    );
});

export function InvasionList() {
    const { data, isPending, isError, error } = useInvasionsQuery();
    const groups = useMemo(() => groupBySystem(data ?? []), [data]);

    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!groups.length) return <CardEmpty text="当前没有入侵任务" />;

    return (
        <div className="flex flex-col gap-2">
            {groups.map((g) => (
                <GroupedCard key={g.systemKey} group={g} />
            ))}
        </div>
    );
}
