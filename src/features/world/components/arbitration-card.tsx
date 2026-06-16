import { useMemo } from "react";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useArbyQuery } from "@/features/world/queries";
import { resolveNode } from "@/lib/wpep/nodes";
import type { ArbyEntry } from "@/types/wf-state";
import {useTranslation} from "react-i18next";
import {formatCountdown, useCountdown} from "@/hooks/use-countdown.ts";

export function ArbitrationCard() {
    const { data, isPending, isError, error } = useArbyQuery();
    const entries = useMemo(() => pickArbitrationEntries(data ?? []), [data]);
    const [t] = useTranslation();

    // 当前仲裁的剩余时间 = 下一条的激活时刻（即当前这条结束的时刻）
    // activation 是 Unix 秒，useCountdown 内部按毫秒处理，需要 * 1000
    const next = entries[entries.length - 1];
    const expiry = next ? String(Math.floor(next.activation * 1000)) : undefined;
    const countdown = useCountdown(expiry);
    
    return (
        <EventCard
            title={t("state.title.arby")}
            prefixImg={"/images/resources/Elitium.png"}
            prefixTip={t("resource.elitium")}
            countdown={formatCountdown(countdown)}
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
                                    {i === 0 ? t("event.now") : t("event.next")}
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
