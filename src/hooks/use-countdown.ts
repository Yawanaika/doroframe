import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

// 解析后端给的 ISO / millis 字符串，返回剩余秒数；过期返回 0
export function useCountdown(expiry: string | undefined): number {
    const target = expiry ? Number(expiry) : 0;
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!target) return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [target]);

    if (!target) return 0;
    return Math.max(0, Math.floor((target - now) / 1000));
}

export function formatCountdown(sec: number): string {
    const [t] = useTranslation();
    if (sec <= 0) return t("time.over");
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (d > 0) return t("time.days", {d:d,h:h});
    if (h > 0) return t("time.hours", {h:h,m:m});
    if (m > 0) return t("time.minutes", {m:m,s:s});
    return t("time.seconds", {s:s});
}
