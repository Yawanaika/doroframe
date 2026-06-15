import { memo, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { KnownCalendarSeason } from "@/types/wf-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useCalendarSeasonsQuery } from "@/features/world/queries";
import { itemDetail, tr } from "@/lib/wpep";
import {dayOfYearTo1999Date, cn, DAYS_IN_MONTH, MONTH_NAMES} from "@/lib/utils";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";

// 1999-01-01 是星期五（Sun=0 … Sat=6 → 5）
const YEAR_START_WEEKDAY = 5;
const WEEKDAY_LABELS = ["lable.sunday", "lable.monday", "lable.tuesday", "lable.wednesday", "lable.thursday", "lable.friday", "lable.saturday"];

/** 年内第几天 → 月份索引(0-11) */
function monthOfDay(doy: number): number {
    let acc = 0;
    for (let m = 0; m < 12; m++) {
        if (doy <= acc + DAYS_IN_MONTH[m]) return m;
        acc += DAYS_IN_MONTH[m];
    }
    return 11;
}
/** 某月 1 号的“年内第几天” */
function firstDayOfMonth(monthIndex: number): number {
    let doy = 1;
    for (let m = 0; m < monthIndex; m++) doy += DAYS_IN_MONTH[m];
    return doy;
}
/** 年内第几天 → 星期(Sun=0) */
function weekdayOfDay(doy: number): number {
    return (doy - 1 + YEAR_START_WEEKDAY) % 7;
}

// ── 事件归一化：把三类事件统一成 {kind,name,desc,icon} ───────────────────────
type EventKind = "upgrade" | "challenge" | "reward";
interface EventView {
    kind: EventKind;
    name: string;
    desc: string;
    icon: string;
}
interface CalendarUpgradeInfo {
    name?: string;
    desc?: string;
    ally?: string;
}

const KIND_DOT: Record<EventKind, string> = {
    challenge: "bg-amber-500",
    reward: "bg-emerald-500",
    upgrade: "bg-sky-500",
};

function resolveEvent(
    e: { type: string; challenge?: string; reward?: string; upgrade?: string },
    tCal: TFunction,
): EventView | null {
    switch (e.type) {
        case "CET_UPGRADE": {
            if (!e.upgrade) return null;
            const info = tCal(e.upgrade, { returnObjects: true }) as
                | CalendarUpgradeInfo
                | string;
            const name = typeof info === "string" ? info : info?.name ?? e.upgrade;
            const desc = typeof info === "string" ? "" : info?.desc ?? "";
            const ally = typeof info === "string" ? "" : info?.ally ?? "";
            return {
                kind: "upgrade",
                name,
                desc,
                icon: ally ? `/images/npc/${ally}.webp` : "",
            };
        }
        case "CET_CHALLENGE": {
            if (!e.challenge) return null;
            const c = itemDetail(e.challenge);
            const raw = c?.raw as { requiredCount?: number } | undefined;
            const desc = (c?.description ?? "").replace(
                "|COUNT|",
                String(raw?.requiredCount ?? ""),
            );
            return { kind: "challenge", name: c?.name ?? "", desc, icon: c?.icon ?? "" };
        }
        default: {
            if (!e.reward) return null;
            const r = itemDetail(e.reward);
            return {
                kind: "reward",
                name: r?.name ?? "",
                desc: r?.description ?? "",
                icon: r?.icon ?? "",
            };
        }
    }
}

// ── 单个季节：月历网格 + 右侧详情面板 ────────────────────────────────────────
const SeasonCalendar = memo(function SeasonCalendar({
    season,
}: {
    season: KnownCalendarSeason;
}) {
    const [tCal] = useTranslation("calender");
    const [tMonth] = useTranslation("month");

    // day-of-year → 当天的事件列表
    const eventsByDay = useMemo(() => {
        const map = new Map<number, KnownCalendarSeason["days"][number]["events"]>();
        for (const d of season.days) if (d.events.length) map.set(d.day, d.events);
        return map;
    }, [season.days]);

    // 该季节涉及到的月份（升序）
    const months = useMemo(() => {
        const set = new Set<number>();
        for (const d of season.days) set.add(monthOfDay(d.day));
        return [...set].sort((a, b) => a - b);
    }, [season.days]);

    const [monthIndex, setMonthIndex] = useState(() => months[0] ?? 0);
    const [selectedDoy, setSelectedDoy] = useState<number | null>(() => {
        const first = season.days.find((d) => d.events.length);
        return first?.day ?? null;
    });

    const monthPos = months.indexOf(monthIndex);
    const goMonth = (dir: -1 | 1) => {
        const next = monthPos + dir;
        if (next < 0 || next >= months.length) return;
        setMonthIndex(months[next]);
    };

    // 当前月的格子：前导空格 + 各天
    const lead = weekdayOfDay(firstDayOfMonth(monthIndex));
    const daysInMonth = DAYS_IN_MONTH[monthIndex];
    const firstDoy = firstDayOfMonth(monthIndex);

    const selectedEvents = selectedDoy ? eventsByDay.get(selectedDoy) : undefined;
    const selectedViews = (selectedEvents ?? [])
        .map((e) => resolveEvent(e, tCal))
        .filter((v): v is EventView => v !== null);

    const seasonName = tr(season.season) || season.season;
    const secs = useCountdown(season.expiry);
    const countdown = formatCountdown(secs);
    const [label] = useTranslation("calender.dict");

    return (
        <Card className="p-3 sm:p-4">
            {/* 顶部栏：季节标题 + 月份切换 + 下一个季节倒计时 */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">1999 {label(seasonName)}</span>
                    <Badge variant="secondary">Year {season.yearIteration}</Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={monthPos <= 0}
                        onClick={() => goMonth(-1)}
                        aria-label="上一个月"
                    >
                        <ChevronLeft />
                    </Button>
                    <span className="min-w-14 text-center text-sm font-medium tabular-nums">
                        {tMonth(MONTH_NAMES[monthIndex])}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={monthPos >= months.length - 1}
                        onClick={() => goMonth(1)}
                        aria-label="下一个月"
                    >
                        <ChevronRight />
                    </Button>
                </div>
                {season.expiry ? (
                    <div className="flex flex-col items-end leading-tight">
                        <span className="text-xs text-muted-foreground">{label("season.next")}</span>
                        <span className="text-sm font-medium tabular-nums">{countdown}</span>
                    </div>
                ) : null}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                {/* 月历网格 */}
                <div>
                    <div className="grid grid-cols-7 gap-1">
                        {WEEKDAY_LABELS.map((w, i) => (
                            <div
                                key={w}
                                className={cn(
                                    "pb-1 text-center text-xs font-medium text-muted-foreground",
                                    (i === 0 || i === 6) && "text-foreground/70",
                                )}
                            >
                                {label(w)}
                            </div>
                        ))}

                        {Array.from({ length: lead }).map((_, i) => (
                            <div key={`lead-${i}`} />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayOfMonth = i + 1;
                            const doy = firstDoy + i;
                            const events = eventsByDay.get(doy);
                            const view = events
                                ? resolveEvent(events[0], tCal)
                                : null;
                            const selected = selectedDoy === doy;
                            return (
                                <button
                                    key={doy}
                                    type="button"
                                    disabled={!events}
                                    onClick={() => setSelectedDoy(doy)}
                                    className={cn(
                                        "relative flex aspect-square flex-col items-center justify-start rounded-md border p-1 text-left transition-colors",
                                        events
                                            ? "cursor-pointer border-border bg-muted/40 hover:bg-muted"
                                            : "border-transparent bg-muted/10 text-muted-foreground",
                                        selected &&
                                            "border-primary bg-primary/10 ring-1 ring-primary",
                                    )}
                                >
                                    <span className="text-xs tabular-nums">{dayOfMonth}</span>
                                    {view ? (
                                        
                                            <img
                                                src={`/images/calendar/${view.kind}.png`}
                                                alt={view.kind}
                                                loading="lazy"
                                                className="mx-auto mt-0.5 size-16 shrink-0 object-contain"
                                            />
                                        
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 右侧：待办事项（预览） */}
                <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="mb-2 text-sm font-medium">
                        {selectedViews.length
                            ? label(`event.${selectedViews[0].kind}`)
                            : null}
                    </div>
                    {selectedDoy && selectedViews.length ? (
                        <div className="space-y-3">
                            <div className="text-xs text-muted-foreground">
                                {dayOfYearTo1999Date(selectedDoy)}
                            </div>
                            {selectedViews.map((v, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 text-center">
                                    {v.icon ? (
                                        <img
                                            src={v.icon}
                                            alt={v.name}
                                            loading="lazy"
                                            className="size-20 object-contain"
                                        />
                                    ) : (
                                        <span
                                            className={cn(
                                                "size-12 rounded-full",
                                                KIND_DOT[v.kind],
                                            )}
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "text-sm font-semibold",
                                            v.kind === "challenge" && "text-destructive",
                                        )}
                                    >
                                        {v.name}
                                    </div>
                                    {v.desc ? (
                                        <p className="text-xs text-muted-foreground">{v.desc}</p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </Card>
    );
});

export function CalendarMonthList() {
    const { data, isPending, isError, error } = useCalendarSeasonsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无 1999 日历" />;
    return (
        <div className="grid gap-3">
            {data.map((s) => (
                <SeasonCalendar key={s.id} season={s} />
            ))}
        </div>
    );
}
