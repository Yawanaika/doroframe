import {
    useQuery,
    type UseQueryResult,
} from "@tanstack/react-query";
import { fetchWorld } from "@/api/world";
import { useSettingsStore } from "@/store/settings";
import type {
    World,
    Alert,
    Sorty,
    Syndicate,
    ActiveMission,
    Invasion,
    VoidTrader,
    PrimeVault,
    VoidStorm,
    DailyDeal,
    EndlessXpChoice,
    EndlessXpSchedule,
    SeasonInfo,
    KnownCalendarSeason,
    Conquest,
    Descent,
    Goal,
} from "@/types/wf-state";

const WORLD_KEY = ["world"] as const;

// 共享同一个 fetch / 轮询节奏；每个 selector 独立比较返回值，未变化的切片不会触发对应组件 re-render。
// 轮询间隔来自设置页的 autoRefreshSec（秒），并设 5 秒下限避免误填过小值导致狂刷。
function useWorldSelect<T>(select: (w: World) => T): UseQueryResult<T> {
    const autoRefreshSec = useSettingsStore((s) => s.autoRefreshSec);
    const intervalMs = Math.max(5, autoRefreshSec) * 1000;
    return useQuery({
        queryKey: WORLD_KEY,
        queryFn: fetchWorld,
        refetchInterval: intervalMs,
        staleTime: Math.max(0, intervalMs - 5_000),
        select,
    });
}

export const useAlertsQuery = (): UseQueryResult<Alert[]> =>
    useWorldSelect((w) => w.alerts);

export const useSortiesQuery = (): UseQueryResult<Sorty[]> =>
    useWorldSelect((w) => w.sorties);

export const useLiteSortiesQuery = (): UseQueryResult<Sorty[]> =>
    useWorldSelect((w) => w.liteSorties);

export const useSyndicateMissionsQuery = (): UseQueryResult<Syndicate[]> =>
    useWorldSelect((w) => w.syndicateMissions);

export const useActiveMissionsQuery = (): UseQueryResult<ActiveMission[]> =>
    useWorldSelect((w) => w.activeMissions);

export const useInvasionsQuery = (): UseQueryResult<Invasion[]> =>
    useWorldSelect((w) => w.invasions);

export const useVoidTradersQuery = (): UseQueryResult<VoidTrader[]> =>
    useWorldSelect((w) => w.voidTraders);

export const usePrimeVaultTradersQuery = (): UseQueryResult<PrimeVault[]> =>
    useWorldSelect((w) => w.primeVaultTraders);

export const useVoidStormsQuery = (): UseQueryResult<VoidStorm[]> =>
    useWorldSelect((w) => w.voidStorms);

export const useDailyDealsQuery = (): UseQueryResult<DailyDeal[]> =>
    useWorldSelect((w) => w.dailyDeals);

export const useEndlessXpChoicesQuery = (): UseQueryResult<EndlessXpChoice[]> =>
    useWorldSelect((w) => w.endlessXpChoices);

export const useEndlessXpScheduleQuery = (): UseQueryResult<EndlessXpSchedule[]> =>
    useWorldSelect((w) => w.endlessXpSchedule);

export const useSeasonInfoQuery = (): UseQueryResult<SeasonInfo | undefined> =>
    useWorldSelect((w) => w.seasonInfo);

export const useCalendarSeasonsQuery = (): UseQueryResult<KnownCalendarSeason[]> =>
    useWorldSelect((w) => w.knownCalendarSeasons);

export const useConquestsQuery = (): UseQueryResult<Conquest[]> =>
    useWorldSelect((w) => w.conquests);

export const useDescentsQuery = (): UseQueryResult<Descent[]> =>
    useWorldSelect((w) => w.descents);

export const useGoalsQuery = (): UseQueryResult<Goal[]> =>
    useWorldSelect((w) => w.goals);
