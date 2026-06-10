import { memo } from "react";
import type { BountyCycle, BountyJob } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useBountyCycleQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import {itemDetail, tr} from "@/lib/wpep";

// 地区 key → 展示名（其余未知 key 回退到 tr）
const SYNDICATE_NAME: Record<string, string> = {
    ZarimanSyndicate: "扎里曼",
    EntratiLabSyndicate: "解剖圣所",
    HexSyndicate: "六人组",
};

const JobRow = memo(function JobRow({ job }: { job: BountyJob }) {
    const node = resolveNode(job.node);
    const challenge = itemDetail(job.challenge);
    return (
        <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground">{node.nameZh}</span>
            <span className="truncate">{challenge?.name}</span>
            {job.ally ? (
                <span className="shrink-0 text-amber-300">
                    {tr(job.ally) || ""}
                </span>
            ) : null}
        </div>
    );
});

function SyndicateGroup({
    syndicate,
    jobs,
}: {
    syndicate: string;
    jobs: BountyJob[];
}) {
    return (
        <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">
                {SYNDICATE_NAME[syndicate] ?? tr(syndicate) ?? syndicate}
            </div>
            {jobs.map((job, i) => (
                <JobRow key={`${job.node}-${i}`} job={job} />
            ))}
        </div>
    );
}

const BountyCycleCard = memo(function BountyCycleCard({
    cycle,
}: {
    cycle: BountyCycle;
}) {
    // expiry 是毫秒数字，useCountdown 接受字符串
    const sec = useCountdown(String(cycle.expiry));
    return (
        <EventCard
            title="赏金轮换"
            subtitle={`轮换 ${cycle.rot} · 金库 ${cycle.vaultRot} · ${tr(
                cycle.zarimanFaction,
            )}`}
            countdown={formatCountdown(sec)}
        >
            <div className="flex flex-col gap-3">
                {Object.entries(cycle.bounties).map(([syndicate, jobs]) => (
                    <SyndicateGroup
                        key={syndicate}
                        syndicate={syndicate}
                        jobs={jobs}
                    />
                ))}
            </div>
        </EventCard>
    );
});

export function BountyCycleList() {
    const { data, isPending, isError, error } = useBountyCycleQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data || !Object.keys(data.bounties).length)
        return <CardEmpty text="无赏金轮换" />;
    return <BountyCycleCard cycle={data} />;
}
