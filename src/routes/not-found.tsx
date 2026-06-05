import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function NotFoundPage() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <p className="text-6xl font-bold tabular-nums text-muted-foreground/30">
                404
            </p>
            <p className="text-sm text-muted-foreground">页面未找到</p>
            <Button variant="outline" size="sm" asChild>
                <Link to="/state">
                    <ArrowLeftIcon className="size-4" />
                    返回状态页
                </Link>
            </Button>
        </div>
    );
}
