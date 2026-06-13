import { Button } from "@/components/ui/button";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import {
    useBountyCycleQuery,
    useSyndicateMissionsQuery,
} from "@/features/world/queries";
import {
    formatCycleRemaining,
    useCetusEntratiCycle,
    useNowTick,
    useSolarisCycle,
    type RegionCycle,
} from "@/hooks/use-cycle";
import {itemDetail, tr} from "@/lib/wpep";
import { cn } from "@/lib/utils";
import { BountyJob, Syndicate} from "@/types/wf-state";
import {EventCard} from "@/components/event-card.tsx";
import {useTranslation} from "react-i18next";

export type RegionConfig = {
    id: string;
    tag: string;
    name: string;
    caption: string;
    icon: string;
    flag?: string;
};
export const REGIONS: RegionConfig[] = [
    {
        id: "cetus",
        tag: "CetusSyndicate",
        name: "syndicate.cetus",
        caption: "平原赏金",
        icon: "/images/syndicate/CetusSyndicate.png",
        flag: "/images/syndicate-flag/OstronSyndicateFlag.webp"
    },
    {
        id: "fortuna",
        tag: "SolarisSyndicate",
        name: "syndicate.fortuna",
        caption: "奥布山谷",
        icon: "/images/syndicate/SolarisSyndicate.png",
    },
    {
        id: "deimos",
        tag: "EntratiSyndicate",
        name: "syndicate.deimos",
        caption: "隔离库与赏金",
        icon: "/images/syndicate/EntratiSyndicate.png",
    },
    {
        id: "sanctum",
        tag: "EntratiLabSyndicate",
        name: "syndicate.sanctum",
        caption: "实验室赏金",
        icon: "/images/syndicate/EntratiLabSyndicate.png",
    },
    {
        id: "zariman",
        tag: "ZarimanSyndicate",
        name: "syndicate.zariman",
        caption: "虚空航舰",
        icon: "/images/syndicate/ZarimanSyndicate.png",
    },
    {
        id: "hex",
        tag: "HexSyndicate",
        name: "syndicate.hex",
        caption: "1999 委托",
        icon: "/images/syndicate/HexSyndicate.png",
    },
];

const BOUNTY_CYCLE_REGION_TAGS = new Set([
    "EntratiLabSyndicate",
    "ZarimanSyndicate",
    "HexSyndicate",
]);

// 昼夜/冷暖轮换：希图斯/魔胎之境以集团本轮 activation 为锚点，
// 福尔图娜按固定温暖起点循环；轮换计算与每秒推进的工具函数见 @/hooks/use-cycle。
function useRegionCycle(
    region: RegionConfig,
    syndicates: Syndicate[] |undefined,
): RegionCycle | null {
    const isCyclic =
        region.id === "cetus" ||
        region.id === "fortuna" ||
        region.id === "deimos";
    const now = useNowTick(isCyclic);
    if (!isCyclic) return null;
    if (region.id === "fortuna") return useSolarisCycle(now);
    const syndicate = syndicates?.find((item) => item.tag === region.tag);
    const activation = syndicate?.activation
        ? Number(syndicate.activation)
        : NaN;
    if (!Number.isFinite(activation)) return null;
    return useCetusEntratiCycle(region.id, activation, now);
}

export function RegionBountyShelf({
    activeRegion,
    onRegionClick,
}: {
    activeRegion: RegionConfig | null;
    onRegionClick: (regionId: string) => void;
}) {
    const syndicateQuery = useSyndicateMissionsQuery();
    return (
        <section className="island overflow-hidden p-3">
            <div
                className={cn(
                    "grid gap-3 transition-all duration-300 ease-premium",
                    activeRegion
                        ? "md:grid-cols-[5rem_minmax(0,1fr)]"
                        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-6",
                )}
            >
                {(activeRegion ? [activeRegion] : REGIONS).map((region) => (
                    <RegionColumn
                        key={region.id}
                        region={region}
                        active={activeRegion?.id === region.id}
                        syndicates={syndicateQuery.data}
                        onClick={() => onRegionClick(region.id)}
                    />
                ))}

                {activeRegion ? (
                    <RegionBountyPanel
                        region={activeRegion}
                        usesBountyCycle={BOUNTY_CYCLE_REGION_TAGS.has(
                            activeRegion.tag,
                        )}
                    />
                ) : null}
            </div>
        </section>
    );
}

function RegionColumn({
    region,
    active,
    syndicates,
    onClick,
}: {
    region: RegionConfig;
    active: boolean;
    syndicates: Syndicate[] | undefined;
    onClick: () => void;
}) {
    const cycle = useRegionCycle(region, syndicates);
    const [t] = useTranslation();
    return (
        <Button
            type="button"
            variant={active ? "secondary" : "ghost"}
            className={cn(
                "h-100 flex-col justify-start gap-2 rounded-xl px-2 py-3",
                active && "ring-1 ring-primary/35",
            )}
            aria-expanded={active}
            aria-controls="home-region-challenges"
            onClick={onClick}
        >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background/70 ring-1 ring-border">
                <img
                    src={region.icon}
                    alt=""
                    className="size-8 object-contain"
                    loading="lazy"
                />
            </span>
            <span className="tracking-[0.35em] text-sm font-semibold text-center whitespace-pre-line">
                {t(region.name).replace(/ /g, '\n')}
            </span>
            <div className="mt-auto w-full">
                {cycle ? (
                    <span
                        className={cn(
                            "flex items-center justify-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
                            cycle.tone === "warm"
                                ? "bg-amber-500/15 text-amber-500"
                                : "bg-sky-500/15 text-sky-400",
                        )}
                    >
                        <span>{cycle.label}</span>
                        <span className="opacity-80">
                            {formatCycleRemaining(cycle.remainingMs)}
                        </span>
                    </span>
                ) : null}
            </div>
        </Button>
    );
}

function RegionBountyPanel({
    region,
    usesBountyCycle,
}: {
    region: RegionConfig;
    usesBountyCycle: boolean;
}) {
    const syndicateQuery = useSyndicateMissionsQuery();
    const bountyCycleQuery = useBountyCycleQuery();

    const syndicate = syndicateQuery.data?.find(
        (item) => item.tag === region.tag,
    );
    const bountyCycle = bountyCycleQuery.data;
    // 世界状态的 SyndicateMissions 提供希图斯/福尔图娜/魔胎之境等传统赏金；
    // browse.wf 的 BountyCycle 提供扎里曼/解剖圣所/六人组等轮换挑战。
    const syndicateJobs = syndicate?.jobs ?? [];
    const bountyJobs = bountyCycle?.bounties?.[region.tag] ?? [];
    // 两者皆空时回退展示集团每日任务节点。
    const nodes =
        syndicateJobs.length || bountyJobs.length ? [] : (syndicate?.nodes ?? []);
    const hasContent =
        syndicateJobs.length > 0 || bountyJobs.length > 0 || nodes.length > 0;

    const activeQuery = usesBountyCycle ? bountyCycleQuery : syndicateQuery;
    const isPending = activeQuery.isPending;
    const error = activeQuery.isError ? String(activeQuery.error) : undefined;

    return (
        <div
            id="home-region-challenges"
            className="min-w-0 rounded-xl border bg-background/70 p-4 animate-fade-up"
        >
            {isPending ? <CardSkeleton rows={3} /> : null}
            {!isPending && error ? <CardError message={error} /> : null}
            {!isPending && !error && !hasContent ? (
                <CardEmpty text="暂无该地区赏金" />
            ) : null}
            {!isPending && !error && hasContent ? (
                <div className="grid gap-2 lg:grid-cols-2">
                    {syndicateJobs.map((job, index) => (
                        <SyndicateJobTile
                            key={`job-${job.jobType}-${index}`}
                            job={job}
                        />
                    ))}
                    {bountyCycle
                        ? bountyJobs.map((job, index) => (
                              <BountyJobTile
                                  key={`bounty-${job.node}-${index}`}
                                  job={job}
                              />
                          ))
                        : null}
                </div>
            ) : null}
        </div>
    );
}

function SyndicateJobTile({
    job,
}: {
    job: NonNullable<Syndicate["jobs"]>[number];
}) {
    const [t] = useTranslation("syndicate.jobs");
    const detail = itemDetail(job.jobType);
    const level =
        job.minEnemyLevel || job.maxEnemyLevel
            ? `${job.minEnemyLevel} - ${job.maxEnemyLevel} 级`
            : "等级未知";
    // const rewards = rewardTableDrops(job.rewards)
    return (
        <EventCard
            title={detail?.name || t(job.jobType) ||t(job.locationTag??"")}
            subtitle={`${level}`}
            prefixImg={detail?.icon}
            badge={job.masteryReq === 10 ? "钢铁" : undefined}
        >
            <span className="text-xs text-muted-foreground">
                {detail?.description}
            </span>
            {/*{rewards && rewards.length > 0 ? (*/}
            {/*    <div className="mt-2 space-y-1">*/}
            {/*        {rewards.map((re, rotationIndex) => (*/}
            {/*            <div key={`rotation-${rotationIndex}`} className="flex flex-wrap items-center gap-1.5">*/}
            {/*                <span className="text-[10px] font-medium text-muted-foreground">*/}
            {/*                    {String.fromCharCode(65 + rotationIndex)}:*/}
            {/*                </span>*/}
            {/*                    */}
            {/*                <span*/}
            {/*                    key={`drop-${re}`}*/}
            {/*                    className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px]"*/}
            {/*                >*/}
            {/*                    {re.detail?.icon ? (*/}
            {/*                        <img*/}
            {/*                            src={re.detail?.icon}*/}
            {/*                            alt=""*/}
            {/*                            className="size-3 object-contain"*/}
            {/*                            loading="lazy"*/}
            {/*                        />*/}
            {/*                    ) : null}*/}
            {/*                    {re.detail?.name ?? re.type}*/}
            {/*                    <span className="text-muted-foreground">*/}
            {/*                        ({(re.probability * 100).toFixed(0)}%)*/}
            {/*                    </span>*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*) : null}*/}
        </EventCard>
    );
}

function BountyJobTile({ job }: { job: BountyJob }) {
    const detail = itemDetail(job.challenge);
    const [t] = useTranslation("npc");
    const ally = job.ally ? t(job.ally) : "";
    const raw = (detail?.raw as { requiredCount?: number } | undefined);
    return (
        <EventCard
            title={detail?.name || tr(job.challenge)}
            // subtitle={}
            prefixImg={detail?.icon}
        >
            <span className="text-xs text-muted-foreground">
                {
                    detail?.description.replace("|OPEN_COLOR|","")
                        .replace("|CLOSE_COLOR|","")
                        .replace("|ALLY|",ally)
                        .replace("|COUNT|",String(raw?.requiredCount ?? ""))
                }
            </span>
        </EventCard>
    );
}
