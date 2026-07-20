import { useEffect } from "react";
import {
    useSettingsStore,
    PRIMARY_OPTIONS,
    BASE_OPTIONS,
    CHART_OPTIONS,
} from "@/store";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { ModeToggle } from "@/components/mode-toggle";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import { useAppUpdaterStore, type AppUpdaterStatus } from "@/store/updater";

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const updateStatusText = (
    status: AppUpdaterStatus,
    availableVersion: string | null,
    error: string | null,
): string => {
    switch (status) {
        case "checking":
            return "正在检查新版本";
        case "up-to-date":
            return "当前已经是最新版本";
        case "available":
            return `发现新版本 v${availableVersion ?? ""}`;
        case "downloading":
            return "正在下载更新";
        case "installing":
            return "正在安装更新";
        case "installed":
            return "更新已安装，正在重启";
        case "unsupported":
            return "仅桌面应用支持自动更新";
        case "error":
            return error ?? "更新操作失败";
        default:
            return "可以手动检查新版本";
    }
};

function Row({
    label,
    desc,
    children,
}: {
    label: string;
    desc?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0">
            <div className="space-y-0.5">
                <div className="text-sm font-medium">{label}</div>
                {desc ? (
                    <div className="text-xs text-muted-foreground">{desc}</div>
                ) : null}
            </div>
            <div>{children}</div>
        </div>
    );
}

export function SettingsPage() {
    const {
        hydrated,
        hydrate,
        primaryColor,
        baseColor,
        chartColor,
        lang,
        notifyAlert,
        notifyVoidTrader,
        notifyBaro,
        autoRefreshSec,
        update,
    } = useSettingsStore();
    const updaterStatus = useAppUpdaterStore((s) => s.status);
    const currentVersion = useAppUpdaterStore((s) => s.currentVersion);
    const availableVersion = useAppUpdaterStore((s) => s.availableVersion);
    const releaseNotes = useAppUpdaterStore((s) => s.releaseNotes);
    const updateProgress = useAppUpdaterStore((s) => s.progress);
    const downloadedBytes = useAppUpdaterStore((s) => s.downloadedBytes);
    const totalBytes = useAppUpdaterStore((s) => s.totalBytes);
    const updaterError = useAppUpdaterStore((s) => s.error);
    const initializeUpdater = useAppUpdaterStore((s) => s.initialize);
    const checkForUpdates = useAppUpdaterStore((s) => s.checkForUpdates);
    const installUpdate = useAppUpdaterStore((s) => s.installUpdate);

    useEffect(() => {
        if (!hydrated) hydrate();
    }, [hydrated, hydrate]);

    useEffect(() => {
        void initializeUpdater();
    }, [initializeUpdater]);

    const updaterBusy =
        updaterStatus === "checking" ||
        updaterStatus === "downloading" ||
        updaterStatus === "installing" ||
        updaterStatus === "installed";
    const statusText = updateStatusText(
        updaterStatus,
        availableVersion,
        updaterError,
    );
    const onUpdate = () => {
        if (updaterStatus === "available") {
            void installUpdate();
        } else {
            void checkForUpdates();
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">外观</CardTitle>
                    <CardDescription>主题与语言</CardDescription>
                </CardHeader>
                <CardContent>
                    <Row label="外观">
                        <ModeToggle />
                    </Row>
                    <Row label="颜色主题">
                        <Select
                            value={primaryColor}
                            onValueChange={(v) =>
                                update("primaryColor", v)
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PRIMARY_OPTIONS.map((name) => (
                                    <SelectItem key={name} value={name}>
                                        {name.charAt(0).toUpperCase() + name.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Row>
                    <Row label="基础色">
                        <Select
                            value={baseColor}
                            onValueChange={(v) =>
                                update("baseColor", v)
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {BASE_OPTIONS.map((name) => (
                                    <SelectItem key={name} value={name}>
                                        {name.charAt(0).toUpperCase() + name.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Row>
                    <Row label="图表色">
                        <Select
                            value={chartColor}
                            onValueChange={(v) =>
                                update("chartColor", v)
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CHART_OPTIONS.map((name) => (
                                    <SelectItem key={name} value={name}>
                                        {name.charAt(0).toUpperCase() + name.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Row>
                    <Row label="语言" desc="字典 / WPEP 翻译">
                        <Select
                            value={lang}
                            onValueChange={(v) =>
                                update("lang", v as typeof lang)
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="zh">中文</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                        </Select>
                    </Row>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">通知</CardTitle>
                    <CardDescription>关键事件系统通知</CardDescription>
                </CardHeader>
                <CardContent>
                    <Row label="警报">
                        <Switch
                            checked={notifyAlert}
                            onCheckedChange={(v) => update("notifyAlert", v)}
                        />
                    </Row>
                    <Row label="虚空商人到达">
                        <Switch
                            checked={notifyVoidTrader}
                            onCheckedChange={(v) =>
                                update("notifyVoidTrader", v)
                            }
                        />
                    </Row>
                    <Row label="Baro 到站">
                        <Switch
                            checked={notifyBaro}
                            onCheckedChange={(v) => update("notifyBaro", v)}
                        />
                    </Row>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base">数据</CardTitle>
                    <CardDescription>世界状态轮询间隔</CardDescription>
                </CardHeader>
                <CardContent>
                    <Row label="自动刷新（秒）">
                        <Input
                            type="number"
                            className="w-24"
                            min={10}
                            max={600}
                            value={autoRefreshSec}
                            onChange={(e) =>
                                update(
                                    "autoRefreshSec",
                                    Number(e.target.value) || 30,
                                )
                            }
                        />
                    </Row>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base">应用更新</CardTitle>
                    <CardDescription>检查、下载并安装 DoroFrame 新版本</CardDescription>
                </CardHeader>
                <CardContent>
                    <Row label="当前版本" desc={statusText}>
                        <span className="text-sm font-medium tabular-nums">
                            v{currentVersion}
                        </span>
                    </Row>
                    <Row
                        label="更新操作"
                        desc={
                            updaterStatus === "available"
                                ? `可更新到 v${availableVersion}`
                                : undefined
                        }
                    >
                        <Button
                            type="button"
                            variant={updaterStatus === "available" ? "default" : "outline"}
                            disabled={
                                updaterBusy || updaterStatus === "unsupported"
                            }
                            onClick={onUpdate}
                        >
                            {updaterBusy ? (
                                <Spinner data-icon="inline-start" />
                            ) : updaterStatus === "available" ? (
                                <DownloadIcon data-icon="inline-start" />
                            ) : (
                                <RefreshCwIcon data-icon="inline-start" />
                            )}
                            {updaterStatus === "available"
                                ? "下载并安装"
                                : updaterBusy
                                  ? statusText
                                  : "检查更新"}
                        </Button>
                    </Row>

                    {updaterStatus === "downloading" ? (
                        <div className="space-y-2 py-3">
                            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground tabular-nums">
                                <span>下载进度</span>
                                <span>
                                    {formatBytes(downloadedBytes)}
                                    {totalBytes ? ` / ${formatBytes(totalBytes)}` : ""}
                                </span>
                            </div>
                            <Progress value={updateProgress ?? 0} className="h-2" />
                        </div>
                    ) : null}

                    {releaseNotes && updaterStatus === "available" ? (
                        <div className="border-t py-3">
                            <div className="mb-1 text-xs font-medium">更新说明</div>
                            <div className="whitespace-pre-wrap wrap-break-word text-xs text-muted-foreground">
                                {releaseNotes}
                            </div>
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
}
