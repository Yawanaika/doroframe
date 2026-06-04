import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { wmLogin, wmLogout, wmMe, wmMyOrders } from "@/api/wm-auth";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CardEmpty, CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";

function LoginDialog() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const setProfile = useAuthStore((s) => s.setProfile);

    async function submit() {
        setPending(true);
        try {
            const p = await wmLogin(email, password);
            setProfile(p);
            toast.success(`已登录 ${p.ingameName}`);
            setOpen(false);
        } catch (e) {
            toast.error(`登录失败：${String(e)}`);
        } finally {
            setPending(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>登录 Warframe Market</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>登录</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <Input
                        placeholder="邮箱"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button
                        disabled={!email || !password || pending}
                        onClick={submit}
                    >
                        {pending ? "登录中…" : "登录"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function MyOrders() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["wm", "me", "orders"],
        queryFn: wmMyOrders,
        refetchInterval: 60_000,
    });
    if (isPending) return <CardSkeleton rows={4} />;
    if (isError) return <CardError message={String(error)} />;
    if (!data?.length) return <CardEmpty text="无个人订单" />;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>物品</TableHead>
                    <TableHead>方向</TableHead>
                    <TableHead className="text-right">P</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((o) => (
                    <TableRow key={o.id}>
                        <TableCell className="truncate max-w-[260px]">
                            {o.itemNameZh}
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={
                                    o.type === "sell"
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {o.type === "sell" ? "卖" : "买"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                            {o.platinum}
                        </TableCell>
                        <TableCell className="text-right">
                            {o.quantity}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function MarketMePage() {
    const profile = useAuthStore((s) => s.profile);
    const setProfile = useAuthStore((s) => s.setProfile);

    useEffect(() => {
        wmMe()
            .then((p) => p && setProfile(p))
            .catch(() => undefined);
    }, [setProfile]);

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-12">
                <p className="text-sm text-muted-foreground">
                    需要登录 Warframe Market 才能管理个人订单
                </p>
                <LoginDialog />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        {profile.ingameName}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3 text-sm">
                    <Badge variant="secondary">声望 {profile.reputation}</Badge>
                    <Badge variant="outline">{profile.platinum} P</Badge>
                    <Badge variant="outline">{profile.region}</Badge>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={async () => {
                            await wmLogout();
                            setProfile(null);
                            toast.success("已登出");
                        }}
                    >
                        登出
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">我的订单</CardTitle>
                </CardHeader>
                <CardContent>
                    <MyOrders />
                </CardContent>
            </Card>
        </div>
    );
}
