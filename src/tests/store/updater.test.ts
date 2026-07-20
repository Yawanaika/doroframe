import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    isTauri: vi.fn(),
    getVersion: vi.fn(),
    check: vi.fn(),
    relaunch: vi.fn(),
}));

vi.mock("@tauri-apps/api/core", () => ({ isTauri: mocks.isTauri }));
vi.mock("@tauri-apps/api/app", () => ({ getVersion: mocks.getVersion }));
vi.mock("@tauri-apps/plugin-updater", () => ({ check: mocks.check }));
vi.mock("@tauri-apps/plugin-process", () => ({ relaunch: mocks.relaunch }));

import { useAppUpdaterStore } from "@/store/updater";

const resetStore = () => {
    useAppUpdaterStore.setState({
        currentVersion: "0.1.0",
        availableVersion: null,
        releaseNotes: null,
        status: "idle",
        progress: null,
        downloadedBytes: 0,
        totalBytes: null,
        error: null,
        initialized: false,
    });
};

describe("app updater store", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetStore();
        mocks.isTauri.mockReturnValue(true);
        mocks.getVersion.mockResolvedValue("0.1.0");
        mocks.relaunch.mockResolvedValue(undefined);
    });

    it("从 Tauri 读取当前应用版本", async () => {
        mocks.getVersion.mockResolvedValue("1.2.3");

        await useAppUpdaterStore.getState().initialize();

        expect(useAppUpdaterStore.getState()).toMatchObject({
            initialized: true,
            currentVersion: "1.2.3",
        });
    });

    it("没有新版本时进入已是最新状态", async () => {
        mocks.check.mockResolvedValue(null);

        const available = await useAppUpdaterStore.getState().checkForUpdates();

        expect(available).toBe(false);
        expect(mocks.check).toHaveBeenCalledWith({ timeout: 15_000 });
        expect(useAppUpdaterStore.getState().status).toBe("up-to-date");
    });

    it("下载更新时计算进度并在安装后重启", async () => {
        const update = {
            version: "0.2.0",
            body: "新增自动更新功能",
            close: vi.fn().mockResolvedValue(undefined),
            downloadAndInstall: vi.fn().mockImplementation(async (onEvent) => {
                onEvent({ event: "Started", data: { contentLength: 100 } });
                onEvent({ event: "Progress", data: { chunkLength: 40 } });
                onEvent({ event: "Progress", data: { chunkLength: 60 } });
                onEvent({ event: "Finished" });
            }),
        };
        mocks.check.mockResolvedValue(update);

        const available = await useAppUpdaterStore.getState().checkForUpdates();
        expect(available).toBe(true);
        expect(useAppUpdaterStore.getState()).toMatchObject({
            status: "available",
            availableVersion: "0.2.0",
            releaseNotes: "新增自动更新功能",
        });

        await useAppUpdaterStore.getState().installUpdate();

        expect(update.downloadAndInstall).toHaveBeenCalledOnce();
        expect(mocks.relaunch).toHaveBeenCalledOnce();
        expect(useAppUpdaterStore.getState()).toMatchObject({
            status: "installed",
            progress: 100,
            downloadedBytes: 100,
            totalBytes: 100,
        });
    });

    it("连续点击安装时只下载一次", async () => {
        let finishDownload: (() => void) | undefined;
        const update = {
            version: "0.2.0",
            body: null,
            close: vi.fn().mockResolvedValue(undefined),
            downloadAndInstall: vi.fn(
                () =>
                    new Promise<void>((resolve) => {
                        finishDownload = resolve;
                    }),
            ),
        };
        mocks.check.mockResolvedValue(update);
        await useAppUpdaterStore.getState().checkForUpdates();

        const firstInstall = useAppUpdaterStore.getState().installUpdate();
        const secondInstall = useAppUpdaterStore.getState().installUpdate();

        expect(update.downloadAndInstall).toHaveBeenCalledOnce();
        finishDownload?.();
        await Promise.all([firstInstall, secondInstall]);
        expect(mocks.relaunch).toHaveBeenCalledOnce();
    });

    it("浏览器环境不调用桌面更新插件", async () => {
        mocks.isTauri.mockReturnValue(false);

        await useAppUpdaterStore.getState().initialize();
        const available = await useAppUpdaterStore.getState().checkForUpdates();

        expect(available).toBe(false);
        expect(mocks.check).not.toHaveBeenCalled();
        expect(useAppUpdaterStore.getState().status).toBe("unsupported");
    });
});
