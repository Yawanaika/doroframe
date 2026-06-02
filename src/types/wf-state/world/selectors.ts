import { Base } from "@/types/wf-state/world/base.ts";
import { Alert } from "@/types/wf-state/world/alert.ts";
import { Invasion } from "@/types/wf-state/world/invasion.ts";
import { World } from "@/types/wf-state/world/world.ts";

const toMs = (s?: string) => (s ? Number(s) : NaN);

export function isExpired(b: Base, now = Date.now()): boolean {
    const e = toMs(b.expiry);
    return Number.isFinite(e) && now > e;
}

export function isActive(b: Base, now = Date.now()): boolean {
    const a = toMs(b.activation);
    if (!Number.isFinite(a) || now < a) return false;
    return !isExpired(b, now);
}

export function remainingMs(b: Base, now = Date.now()): number {
    const e = toMs(b.expiry);
    return Number.isFinite(e) ? Math.max(0, e - now) : Infinity;
}

export function elapsedMs(b: Base, now = Date.now()): number {
    const a = toMs(b.activation);
    return Number.isFinite(a) ? Math.max(0, now - a) : 0;
}

export const activeAlerts = (w: World, now = Date.now()): Alert[] =>
    w.alerts.filter((a) => isActive(a, now));

export const activeInvasions = (w: World): Invasion[] =>
    w.invasions.filter((i) => !i.completed);
