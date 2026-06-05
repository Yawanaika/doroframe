import { useEffect } from "react";
import {
    useSettingsStore,
    PRIMARY_OPTIONS,
    BASE_OPTIONS,
    CHART_OPTIONS,
} from "@/features/settings/store";
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
import { ModeToggle } from "@/components/mode-toggle";

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

    useEffect(() => {
        if (!hydrated) hydrate();
    }, [hydrated, hydrate]);

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
        </div>
    );
}
