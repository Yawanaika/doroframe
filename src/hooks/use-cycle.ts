import {useEffect, useState} from "react";

export type RegionCycle = {
    label: string;
    remainingMs: number;
    tone: "warm" | "cold";
};

const CETUS_CYCLE_MS = 150 * 60 * 1000;
const CETUS_DAY_MS = 100 * 60 * 1000;
const VALLIS_WARM_START = 1763368800000; // 2025-11-17 16:40:00 温暖起点
const VALLIS_CYCLE_MS = 1600000;
const VALLIS_WARM_MS = 400000;

const mod = (value: number, length: number) =>
    ((value % length) + length) % length;

export function useCetusEntratiCycle(
    regionId: string,
    activationMs: number,
    now: number,
): RegionCycle {
    const pos = mod(now - activationMs, CETUS_CYCLE_MS);
    const isDay = pos < CETUS_DAY_MS;
    const remainingMs = isDay ? CETUS_DAY_MS - pos : CETUS_CYCLE_MS - pos;
    const label =
        regionId === "cetus"
            ? isDay
                ? "白天"
                : "夜晚"
            : isDay
                ? "Fass"
                : "Vome";
    return { label, remainingMs, tone: isDay ? "warm" : "cold" };
}

export function formatCycleRemaining(ms: number): string {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function useNowTick(enabled: boolean): number {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!enabled) return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [enabled]);
    return now;
}

export function useSolarisCycle(now: number): RegionCycle {
    const pos = mod(now - VALLIS_WARM_START, VALLIS_CYCLE_MS);
    const isWarm = pos < VALLIS_WARM_MS;
    const remainingMs = isWarm ? VALLIS_WARM_MS - pos : VALLIS_CYCLE_MS - pos;
    return {
        label: isWarm ? "温暖" : "寒冷",
        remainingMs,
        tone: isWarm ? "warm" : "cold",
    };
}
