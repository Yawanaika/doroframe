import { useMemo } from "react";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useArbyQuery } from "@/features/world/queries";
import { resolveNode } from "@/lib/wpep/nodes";
import type { ArbyEntry } from "@/types/wf-state";

export function ArbitrationCard() {
    const { data, isPending, isError, error } = useArbyQuery();
    const entries = useMemo(() => pickArbitrationEntries(data ?? []), [data]);

    return (
        <EventCard
            title="仲裁"
            prefixImg={"/images/resources/Elitium.png"}
            prefixTip="生息精华"
        >
            {isPending ? <CardSkeleton rows={2} /> : null}
            {!isPending && isError ? <CardError message={String(error)} /> : null}
            {!isPending && !isError && !entries.length ? (
                <CardEmpty text="暂无仲裁轮换" />
            ) : null}
            {!isPending && !isError && entries.length ? (
                <div className="space-y-2">
                    {entries.map((entry, i) => {
                        const node = resolveNode(entry.node);
                        return (
                            <div
                                key={`${entry.activation}-${entry.node}-${i}`}
                                className="flex items-center justify-between gap-2 text-sm"
                            >
                                <span className="min-w-0 truncate">
                                    {i === 0 ? "当前" : "下一轮"}
                                    {` : `}
                                    {`${node.nameZh} · ${node.systemNameZh} · ${node.missionTypeZh}`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </EventCard>
    );
}

function pickArbitrationEntries(entries: ArbyEntry[]): ArbyEntry[] {
    const now = Date.now() / 1000;
    const past = entries.filter((entry) => entry.activation <= now);
    const future = entries.filter((entry) => entry.activation > now);
    return [...past.slice(-1), ...future.slice(0, 1)].slice(0, 2);
}
