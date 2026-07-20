import { getVersion } from "@tauri-apps/api/app";
import { isTauri } from "@tauri-apps/api/core";
import { relaunch } from "@tauri-apps/plugin-process";
import {
    check,
    type DownloadEvent,
    type Update,
} from "@tauri-apps/plugin-updater";
import { create } from "zustand";
import packageInfo from "../../package.json";

export type AppUpdaterStatus =
    | "idle"
    | "checking"
    | "up-to-date"
    | "available"
    | "downloading"
    | "installing"
    | "installed"
    | "unsupported"
    | "error";

interface AppUpdaterState {
    currentVersion: string;
    availableVersion: string | null;
    releaseNotes: string | null;
    status: AppUpdaterStatus;
    progress: number | null;
    downloadedBytes: number;
    totalBytes: number | null;
    error: string | null;
    initialized: boolean;
    initialize: () => Promise<void>;
    checkForUpdates: () => Promise<boolean>;
    installUpdate: () => Promise<void>;
}

let pendingUpdate: Update | null = null;
let checkInFlight: Promise<boolean> | null = null;
let installInFlight: Promise<void> | null = null;

const errorText = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);

async function replacePendingUpdate(next: Update | null): Promise<void> {
    const previous = pendingUpdate;
    pendingUpdate = next;
    if (previous && previous !== next) {
        await previous.close().catch(() => undefined);
    }
}

export const useAppUpdaterStore = create<AppUpdaterState>((set, get) => ({
    currentVersion: packageInfo.version,
    availableVersion: null,
    releaseNotes: null,
    status: "idle",
    progress: null,
    downloadedBytes: 0,
    totalBytes: null,
    error: null,
    initialized: false,

    initialize: async () => {
        if (get().initialized) return;
        if (!isTauri()) {
            set({ initialized: true, status: "unsupported" });
            return;
        }

        try {
            set({ currentVersion: await getVersion(), initialized: true });
        } catch {
            set({ initialized: true });
        }
    },

    checkForUpdates: async () => {
        if (!isTauri()) {
            set({ status: "unsupported", error: null });
            return false;
        }
        if (checkInFlight) return checkInFlight;

        const task = (async () => {
            set({
                status: "checking",
                error: null,
                progress: null,
                downloadedBytes: 0,
                totalBytes: null,
            });

            try {
                const update = await check({ timeout: 15_000 });
                await replacePendingUpdate(update);
                if (!update) {
                    set({
                        status: "up-to-date",
                        availableVersion: null,
                        releaseNotes: null,
                    });
                    return false;
                }

                set({
                    status: "available",
                    availableVersion: update.version,
                    releaseNotes: update.body?.trim() || null,
                });
                return true;
            } catch (error) {
                set({ status: "error", error: errorText(error) });
                return false;
            }
        })();

        checkInFlight = task;
        try {
            return await task;
        } finally {
            if (checkInFlight === task) checkInFlight = null;
        }
    },

    installUpdate: async () => {
        if (installInFlight) return installInFlight;

        const update = pendingUpdate;
        if (!update) {
            set({ status: "error", error: "没有可安装的更新，请重新检查。" });
            return;
        }

        const task = (async () => {
            let downloadedBytes = 0;
            let totalBytes: number | null = null;
            set({
                status: "downloading",
                progress: 0,
                downloadedBytes: 0,
                totalBytes: null,
                error: null,
            });

            const onDownload = (event: DownloadEvent) => {
                if (event.event === "Started") {
                    totalBytes = event.data.contentLength ?? null;
                    set({ totalBytes });
                    return;
                }
                if (event.event === "Progress") {
                    downloadedBytes += event.data.chunkLength;
                    const progress = totalBytes
                        ? Math.min(
                              100,
                              Math.round((downloadedBytes / totalBytes) * 100),
                          )
                        : null;
                    set({ downloadedBytes, progress });
                    return;
                }
                set({ status: "installing", progress: 100 });
            };

            try {
                await update.downloadAndInstall(onDownload, {
                    timeout: 5 * 60_000,
                });
                set({ status: "installed", progress: 100 });
                await relaunch();
            } catch (error) {
                set({ status: "error", error: errorText(error) });
            }
        })();

        installInFlight = task;
        try {
            await task;
        } finally {
            if (installInFlight === task) installInFlight = null;
        }
    },
}));
