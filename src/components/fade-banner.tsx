import { memo, useEffect, useRef, useState } from "react";
import { ImageOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FadeBannerProps {
    /** 轮播图片 URL 列表 */
    images: string[];
    /** 容器边长（px）。默认 75。 */
    size?: number;
    /** 是否自动播放。默认 true。 */
    autoPlay?: boolean;
    /** 自动切换间隔（ms）。默认 1000。 */
    intervalMs?: number;
    /** 淡入淡出时长（ms）。默认 500。 */
    fadeMs?: number;
    /** 是否显示底部指示点。默认 false。 */
    showIndicator?: boolean;
    /** 图片 alt 前缀，最终为 `${alt} ${index+1}` */
    alt?: string;
    /** 透传 className */
    className?: string;
}

/**
 * 多图淡入淡出轮播。
 * 图片层用 opacity 切换实现 GPU 加速淡入淡出，避免 layout/repaint。
 */
export const FadeBanner = memo(function FadeBanner({
    images,
    size = 75,
    autoPlay = true,
    intervalMs = 1000,
    fadeMs = 500,
    showIndicator = false,
    alt = "image",
    className,
}: FadeBannerProps) {
    const [index, setIndex] = useState(0);
    const [errored, setErrored] = useState<Set<number>>(new Set());
    const timerRef = useRef<number | null>(null);

    // 切换图片时若 index 越界，回到 0
    useEffect(() => {
        if (index >= images.length && images.length > 0) {
            setIndex(0);
        }
    }, [images.length, index]);

    // 自动轮播
    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;
        const tick = () => setIndex((i) => (i + 1) % images.length);
        timerRef.current = window.setInterval(tick, intervalMs);
        return () => {
            if (timerRef.current != null) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [autoPlay, intervalMs, images.length]);

    const switchTo = (next: number) => {
        if (next < 0 || next >= images.length || next === index) return;
        // 用户主动切换：重置自动轮播节奏
        if (timerRef.current != null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIndex(next);
        if (autoPlay && images.length > 1) {
            timerRef.current = window.setInterval(
                () => setIndex((i) => (i + 1) % images.length),
                intervalMs,
            );
        }
    };

    if (images.length === 0) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center rounded-md bg-muted text-muted-foreground",
                    className,
                )}
                style={{ width: size, height: size }}
                role="img"
                aria-label={alt}
            >
                <ImageOffIcon className="size-1/3" />
            </div>
        );
    }

    return (
        <div
            className={cn("relative overflow-hidden rounded-md", className)}
            style={{ width: size, height: size }}
        >
            {images.map((src, i) => {
                const isActive = i === index;
                const hasError = errored.has(i);
                return hasError ? null : (
                    <img
                        key={src + i}
                        src={src}
                        alt={`${alt} ${i + 1}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-opacity ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                            opacity: isActive ? 1 : 0,
                            transitionDuration: `${fadeMs}ms`,
                        }}
                        onError={() =>
                            setErrored((prev) => {
                                const next = new Set(prev);
                                next.add(i);
                                return next;
                            })
                        }
                    />
                );
            })}

            {showIndicator && images.length > 1 ? (
                <div className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1">
                    {images.map((_, i) => {
                        return (
                            <button
                                key={i}
                                type="button"
                                aria-label={`切换到第 ${i + 1} 张`}
                                onClick={() => switchTo(i)}
                                className={cn(
                                    "size-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                )}
                            />
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
});
