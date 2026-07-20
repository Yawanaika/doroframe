import { useEffect } from "react";
import { toast } from "sonner";
import { useAppUpdaterStore } from "@/store/updater";

let startupCheckStarted = false;

/** 启动时静默检查；检测到新版本后由用户主动确认下载安装。 */
export function UpdateNotifier() {
    const status = useAppUpdaterStore((s) => s.status);
    const availableVersion = useAppUpdaterStore((s) => s.availableVersion);
    const releaseNotes = useAppUpdaterStore((s) => s.releaseNotes);
    const initialize = useAppUpdaterStore((s) => s.initialize);
    const checkForUpdates = useAppUpdaterStore((s) => s.checkForUpdates);
    const installUpdate = useAppUpdaterStore((s) => s.installUpdate);

    useEffect(() => {
        if (startupCheckStarted) return;
        startupCheckStarted = true;
        void initialize().then(() => {
            if (import.meta.env.PROD) void checkForUpdates();
        });
    }, [checkForUpdates, initialize]);

    useEffect(() => {
        if (status !== "available" || !availableVersion) return;
        const toastId = `app-update-${availableVersion}`;
        const description = releaseNotes
            ? releaseNotes.replace(/\s+/g, " ").slice(0, 160)
            : "新版本已经可以下载安装。";
        toast.info(`发现新版本 v${availableVersion}`, {
            id: toastId,
            description,
            duration: Infinity,
            action: {
                label: "下载安装",
                onClick: () => void installUpdate(),
            },
        });

        return () => {
            toast.dismiss(toastId);
        };
    }, [availableVersion, installUpdate, releaseNotes, status]);

    return null;
}
