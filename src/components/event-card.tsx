import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FadeBanner } from "@/components/fade-banner";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

/** 缩略图：单图 URL 或多图 URL 列表（多图时自动轮播） */
type EventCardImage = string | string[];

type EventCardProps = ComponentPropsWithoutRef<typeof Card> & {
    title: string;
    subtitle?: string|ReactNode;
    badge?: string;
    countdown?: string;
    redemption?: string;
    image?: EventCardImage;
    imageTip?: string;
    children?: ReactNode;
};

const THUMB_SIZE = 64;

function Thumbnail({ image, alt }: { image: EventCardImage; alt: string }) {
    if (Array.isArray(image)) {
        return (
            <FadeBanner
                images={image}
                size={THUMB_SIZE}
                alt={alt}
                className="backdrop-brightness-75 backdrop-contrast-125"
            />
        );
    }
    return (
        <div className="size-16 shrink-0 rounded-md overflow-hidden backdrop-brightness-75 backdrop-contrast-125">
            <img
                src={image}
                alt={alt}
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>
    );
}

// 18 张状态卡的统一外壳：左侧可选图片 + 右侧标题/倒计时/徽章/内容
export const EventCard = forwardRef<HTMLDivElement, EventCardProps>(function EventCard({
    title,
    subtitle,
    badge,
    countdown,
    redemption,
    image,
    imageTip,
    children,
    className,
    ...rest
}, ref) {
    const [t] = useTranslation();
    return (
        <Card ref={ref} className={cn("flex flex-row gap-3 p-3", className)} {...rest}>
            {image && (Array.isArray(image) ? image.length > 0 : true) ? (
                imageTip ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="shrink-0">
                                <Thumbnail image={image} alt={imageTip ?? title} />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{imageTip}</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <Thumbnail image={image} alt={imageTip ?? title} />
                )
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
                            <span className="text-muted-foreground text-xs tabular-nums flex items-center gap-1">
                                <div className="w-4 h-4 shrink-0 rounded bg-muted flex items-center justify-center">
                                    <img src="/images/Timer.png" alt={t("event.expiry")} className="w-3 h-3" />
                                </div>
                                {countdown}
                            </span>
                        ) : null}
                        {redemption ? (
                            <span className="text-muted-foreground text-xs tabular-nums">
                                {t("event.grace")}:  {redemption}
                            </span>
                        ) : null}
                    </div>
                </CardHeader>
                {children ? <CardContent className="p-0">{children}</CardContent> : null}
            </div>
        </Card>
    );
});
