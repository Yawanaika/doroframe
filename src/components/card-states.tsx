import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton({ rows = 2 }: { rows?: number }) {
    return (
        <div className="space-y-2 rounded-xl border p-4">
            <Skeleton className="h-5 w-1/2" />
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-2/3" />
            ))}
        </div>
    );
}

export function CardError({ message }: { message?: string }) {
    return (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            加载失败{message ? `：${message}` : ""}
        </div>
    );
}

export function CardEmpty({ text }: { text: string }) {
    return (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            {text}
        </div>
    );
}
