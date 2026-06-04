import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {useTranslation} from "react-i18next";

type EventCardProps = ComponentPropsWithoutRef<typeof Card> & {
    title: string;
    subtitle?: string;
    badge?: string;
    countdown?: string;
    redemption?: string;
    image?: string;
    imageAlt?: string;
    children?: ReactNode;
};

// 18 张状态卡的统一外壳：左侧可选图片 + 右侧标题/倒计时/徽章/内容
export const EventCard = forwardRef<HTMLDivElement, EventCardProps>(function EventCard({
    title,
    subtitle,
    badge,
    countdown,
    redemption,
    image,
    imageAlt,
    children,
    className,
    ...rest
}, ref) {
    const [t] = useTranslation();
    return (
        <Card ref={ref} className={cn("flex flex-row gap-3 p-3", className)} {...rest}>
            {image ? (
                <div className="size-16 shrink-0 rounded-md overflow-hidden backdrop-brightness-75 backdrop-contrast-125">
                    <img
                        src={image}
                        alt={imageAlt ?? title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            ) : null}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 p-0">
                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-base">{title}</CardTitle>
                        {subtitle ? (
                            <CardDescription>{subtitle}</CardDescription>
                        ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        {badge ? <Badge variant="secondary">{badge}</Badge> : null}
                        {countdown ? (
                            <span className="text-muted-foreground text-xs tabular-nums">
                                {t("event.expiry")}:{countdown}
                            </span>
                        ) : null}
                        {redemption ? (
                            <span className="text-muted-foreground text-xs tabular-nums">
                                {t("event.grace")}:{redemption}
                            </span>
                        ) : null}
                    </div>
                </CardHeader>
                {children ? <CardContent className="p-0">{children}</CardContent> : null}
            </div>
            {image ? (
                <div className="size-16 shrink-0 rounded-md overflow-hidden backdrop-brightness-75 backdrop-contrast-125">
                    <img
                        src={image}
                        alt={imageAlt ?? title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            ) : null}
        </Card>
    );
})
