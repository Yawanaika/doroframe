import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { useAlertsQuery, useVoidTradersQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { resolveNode } from "@/lib/wpep/nodes";

export function OverlayPage() {
    const { data: alerts } = useAlertsQuery();
    const { data: traders } = useVoidTradersQuery();
    const [tickAt, setTickAt] = useState<number>(Date.now());

    useEffect(() => {
        const off = listen<{ now_ms: number }>("overlay:tick", (e) =>
            setTickAt(e.payload.now_ms),
        );
        return () => {
            off.then((un) => un());
        };
    }, []);

    const nextAlert = alerts?.[0];
    const trader = traders?.[0];
    const alertSec = useCountdown(nextAlert?.expiry);
    const traderSec = useCountdown(trader?.expiry);

    return (
        <div
            className="h-screen w-screen bg-background/60 text-foreground p-3 font-medium backdrop-blur"
            style={{ borderRadius: 12 }}
        >
            <div className="flex h-full flex-col gap-2 text-sm">
                <div className="text-xs text-muted-foreground">
                    DoroFrame Overlay · {new Date(tickAt).toLocaleTimeString()}
                </div>
                {nextAlert ? (
                    <div className="rounded border px-2 py-1">
                        <div className="truncate">
                            警报：{resolveNode(nextAlert.missionInfo.location).nameZh}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {formatCountdown(alertSec)}
                        </div>
                    </div>
                ) : (
                    <div className="text-muted-foreground text-xs">无警报</div>
                )}
                {trader ? (
                    <div className="rounded border px-2 py-1">
                        <div className="truncate">
                            虚空商人：{resolveNode(trader.node).nameZh}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {formatCountdown(traderSec)}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
