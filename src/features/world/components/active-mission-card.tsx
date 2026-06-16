import { memo, useMemo, useState } from "react";
import type { ActiveMission } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActiveMissionsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";
import {modifyVoidEnemyLevel, sortVoidEvents} from "@/features/world/sort-void-events.ts";
import {useTranslation} from "react-i18next";

type DifficultyFilter = "normal" | "hard";

const ActiveMissionRow = memo(function ActiveMissionRow({
    mission,
}: {
    mission: ActiveMission;
}) {
    const sec = useCountdown(mission.expiry);
    const node = resolveNode(mission.node);
    const [t] = useTranslation();
    const [vd] = useTranslation('void.dict');
    const maxEnemyLevel = modifyVoidEnemyLevel(mission.hard, mission.modifier, node.maxEnemyLevel);
    const minEnemyLevel = modifyVoidEnemyLevel(mission.hard, mission.modifier, node.minEnemyLevel);
    return (
        <EventCard
            title={`${node.missionTypeZh} (${minEnemyLevel} - ${maxEnemyLevel})`}
            subtitle={`${node.nameZh}· ${node.systemNameZh}`}
            prefixImg={mission.modifier === 'VoidT6'?[
                '/images/void/VoidT1.png',
                '/images/void/VoidT2.png',
                '/images/void/VoidT3.png',
                '/images/void/VoidT4.png',
            ]:`/images/void/${mission.modifier}.png`}
            badge={mission.hard ? t("event.hard") : t("event.normal")}
            countdown={formatCountdown(sec)}
        >
            <div className="text-xs text-muted-foreground">{`${vd(mission.modifier)} ${node.factionNameZh}` }</div>
        </EventCard>
    );
});

export function ActiveMissionList() {
    const { data, isPending, isError, error } = useActiveMissionsQuery();
    const [difficulty, setDifficulty] = useState<DifficultyFilter>("normal");

    const { normalCount, hardCount, visible } = useMemo(() => {
        const list = data ?? [];
        const normal = list.filter((m) => !m.hard);
        const hard = list.filter((m) => m.hard);
        return {
            normalCount: normal.length,
            hardCount: hard.length,
            visible: sortVoidEvents(difficulty === "hard" ? hard : normal),
        };
    }, [data, difficulty]);
    
    const [t] = useTranslation();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无虚空裂缝" />;
    return (
        <div className="space-y-3">
            <Tabs
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as DifficultyFilter)}
            >
                <TabsList>
                    <TabsTrigger value="normal">{t("event.normal")} · {normalCount}</TabsTrigger>
                    <TabsTrigger value="hard">{t("event.hard")} · {hardCount}</TabsTrigger>
                </TabsList>
            </Tabs>
            {visible.length === 0 ? (
                <CardEmpty
                    text={difficulty === "hard" ? "无钢铁虚空裂缝" : "无普通虚空裂缝"}
                />
            ) : (
                <div className="grid gap-3 md:grid-cols-2">
                    {visible.map((m) => (
                        <ActiveMissionRow key={m.id} mission={m} />
                    ))}
                </div>
            )}
        </div>
    );
}
