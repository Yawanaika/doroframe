import { memo } from "react";
import type { KnownCalendarSeason } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useCalendarSeasonsQuery } from "@/features/world/queries";
import {itemDetail, tr} from "@/lib/wpep";
import {dayOfYearTo1999Date} from "@/lib/utils.ts";
import {useTranslation} from "react-i18next";

// calender.json 的每个条目是对象：{ name, desc, ally }
interface CalendarUpgradeInfo {
    name?: string;
    desc?: string;
    ally?: string;
}

const SeasonRow = memo(function SeasonRow({
    season,
}: {
    season: KnownCalendarSeason;
}) {
    const [t] = useTranslation("calender");
    return (
        <EventCard
            title={`1999 日历 · ${tr(season.season) || season.season}`}
            subtitle={`Year ${season.yearIteration}`}
            badge={`v${season.version}`}
        >
            {season.days.map((d) => (
                <div key={d.day} className="mb-2">
                    <EventCard title={`${dayOfYearTo1999Date(d.day)}`}>
                    {d.events.map((e, eventIndex) => {
                        switch (e.type) {
                            case "CET_UPGRADE": {
                                if (!e.upgrade) return null;
                                // returnObjects 取整个 { name, desc, ally } 对象；
                                // 未命中字典时 i18next 回退为原 key 字符串。
                                const info = t(e.upgrade, {
                                    returnObjects: true,
                                }) as CalendarUpgradeInfo | string;
                                const name =
                                    typeof info === "string"
                                        ? info
                                        : info?.name ?? e.upgrade;
                                const desc =
                                    typeof info === "string" ? "" : info?.desc ?? "";
                                const ally =
                                    typeof info === "string" ? "" : info?.ally ?? "";
                                return (
                                    <div key={eventIndex} className="flex items-center gap-2 space-y-0.5">
                                        <img src={`/images/npc/${ally}.webp`} alt={ally}/>
                                        <div>
                                            <div className="text-sm font-medium">
                                                {name}
                                            </div>
                                            {desc ? (
                                                <div className="text-xs text-muted-foreground">
                                                    {desc}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            }
                            case "CET_CHALLENGE":
                                if (!e.challenge) return null;
                                const challenge = itemDetail(e.challenge);
                                const raw = (challenge?.raw as { requiredCount?: number } | undefined);
                                return (
                                    <div key={eventIndex} className="flex items-center gap-2 space-y-0.5">
                                        <img src={`${challenge?.icon}`} alt={challenge?.name} className={"size-12 shrink-0"}/>
                                        <div>
                                            <div className="text-sm font-medium">
                                                {challenge?.name}
                                            </div>
                                            {challenge?.description ? (
                                                <div className="text-xs text-muted-foreground">
                                                    {challenge?.description.replace("|COUNT|",String(raw?.requiredCount ?? ""))}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            default:
                                if (!e.reward) return null;
                                const reward = itemDetail(e.reward);
                                return (
                                    <div key={eventIndex} className="flex items-center gap-2 space-y-0.5">
                                        <img src={`${reward?.icon}`} alt={reward?.name} className={"size-12 shrink-0"}/>
                                        <div>
                                            <div className="text-sm font-medium">
                                                {reward?.name}
                                            </div>
                                            {reward?.description ? (
                                                <div className="text-xs text-muted-foreground">
                                                    {reward?.description}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                        }
                    })}
                </EventCard>
                </div>
            ))}
        </EventCard>
    );
});

export function CalendarSeasonList() {
    const { data, isPending, isError, error } = useCalendarSeasonsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无 1999 日历" />;
    return (
        <div className="grid gap-3 md:grid-cols-1">
            {data.map((s) => (
                <SeasonRow key={s.id} season={s} />
            ))}
        </div>
    );
}
