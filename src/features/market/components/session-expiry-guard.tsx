import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store";

// 兜底轮询间隔。过期是否生效以 Date.now() 与 expiresAt 的比较为准（精确），
// 轮询只决定“用户什么都不操作时，最迟多久会弹提示”，60s 足够且不耗电。
const POLL_INTERVAL = 60_000;

/**
 * 会话有效期守卫：token(set-cookie) 的 Expires 到期时提示“登录过期”并自动退出登录。
 *
 * 过期时刻直接取自后端 Expires（通常 90 天后的精确时刻），不在前端估算。
 * 检测采用「低频轮询 + 窗口聚焦/可见时检查」而非单个超长定时器 —— 后者在系统
 * 休眠、应用长时间挂起后并不可靠，对 90 天这种长周期尤甚。
 *
 * 挂载在应用根部，无渲染输出。
 */
export function SessionExpiryGuard() {
    const { t } = useTranslation();
    const hydrated = useAuthStore((s) => s.hydrated);
    const token = useAuthStore((s) => s.token);
    const expiresAt = useAuthStore((s) => s.expiresAt);
    const signOut = useAuthStore((s) => s.signOut);

    useEffect(() => {
        if (!hydrated || !token || expiresAt == null) return;

        const check = () => {
            if (Date.now() < expiresAt) return;
            // 固定 id 去重，避免轮询/聚焦重复触发时弹出多个 toast
            toast.error(t("market.me.session.expired"), {
                id: "session-expired",
            });
            void signOut();
        };

        // 立即检查一次（覆盖“启动时已过期”）
        check();

        const timer = setInterval(check, POLL_INTERVAL);
        // 用户切回应用/窗口重新可见时立即校验，无需等下一次轮询
        const onVisible = () => {
            if (document.visibilityState === "visible") check();
        };
        window.addEventListener("focus", check);
        document.addEventListener("visibilitychange", onVisible);

        return () => {
            clearInterval(timer);
            window.removeEventListener("focus", check);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [hydrated, token, expiresAt, signOut, t]);

    return null;
}
