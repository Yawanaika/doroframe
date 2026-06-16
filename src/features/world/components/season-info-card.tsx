import { EventCard } from "@/components/event-card";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { useSeasonInfoQuery } from "@/features/world/queries";
import {ItemDetail, itemDetail, serializeValue, tr} from "@/lib/wpep";
import {memo} from "react";
import {formatCountdown, useCountdown} from "@/hooks/use-countdown.ts";

/** 挑战的描述键约定：原始 name 翻译键末尾 _Name → _Description */
function challengeDescription(it: ItemDetail): string {
    const raw = (it.raw as { name?: string,requiredCount?: number } | undefined);
    if (!raw) return it.description;
    const name = raw?.name;
    const descKey = name?.endsWith("_Name")
        ? name?.slice(0, -"_Name".length) + "_Description"
        : `${name}_Description`;
    let translated = tr(descKey)
        .replace("|COUNT|",String(raw.requiredCount));
    translated = serializeValue(translated);
    // tr 命中失败会回退为 key 本身，此时回到 itemDetail 的通用 description
    return translated !== descKey ? translated : it.description;
}

const ChallengeRow = memo(function ChallengeRow({ item: it,expiry: expiry }: { item: ItemDetail, expiry:string| undefined }) {
    const name = it?.name;
    const icon = it?.icon;
    const desc = challengeDescription(it);
    const raw = (it.raw as { expiry: string, standing?: number } | undefined);
    return (
        <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
            {icon ? (
                <div className="size-10 shrink-0 rounded-md overflow-hidden backdrop-brightness-75 backdrop-contrast-125">
                    <img
                        src={icon}
                        alt={name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            ) : null}
            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                <span className="truncate text-sm font-medium">{name}</span>
            </div>
            <div className="flex max-w-[55%] items-center gap-3 text-xs text-muted-foreground">
                <span className="line-clamp-2">{desc}</span>
            </div>
            {raw?.standing ? (
                <div className="flex max-w-[55%] items-center gap-3 text-xs text-muted-foreground">
                    <span className="line-clamp-2">{raw.standing}</span>
                </div>
            ): null}
            {expiry ? (
                <span className="text-muted-foreground text-xs tabular-nums flex items-center gap-1">
                    <div className="w-4 h-4 shrink-0 rounded bg-muted flex items-center justify-center">
                        <img src="/images/Timer.png" alt="" className="w-3 h-3" />
                    </div>
                    {formatCountdown(useCountdown(expiry))}
                </span>
            ) : null}
        </div>
    );
});
export function SeasonInfoCard() {
    const { data, isPending, isError, error } = useSeasonInfoQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    if (!data) return <CardEmpty text="无午夜电波" />;
    const daily = data.activeChallenges.filter((c) => c.daily);
    const weekly = data.activeChallenges.filter((c) => !c.daily);
    return (
        <EventCard
            title={`午夜电波 · ${data.season} 季`}
            badge={`${data.activeChallenges.length} 挑战`}
        >
            <div className="divide-y divide-border">
                {daily.map((d) => {
                    const dd = itemDetail(d.challenge);
                    return dd ? <ChallengeRow key={d.id} item={dd} expiry={d.expiry} /> : null;
                })}
                {weekly.map((d) => {
                    const dd = itemDetail(d.challenge);
                    return dd ? <ChallengeRow key={d.id} item={dd} expiry={d.expiry}/> : null;
                })}
            </div>
        </EventCard>
    );
}
