import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store";
import { avatarUrl } from "@/features/market/assets";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MarketMePage() {
    const { hydrated, hydrate, isLoggedIn } = useAuthStore();

    useEffect(() => {
        if (!hydrated) void hydrate();
    }, [hydrated, hydrate]);

    if (!hydrated) return null;

    return isLoggedIn() ? <Profile /> : <LoginForm />;
}

function Profile() {
    const { t } = useTranslation();
    const user = useAuthStore((s) => s.user);
    const signOut = useAuthStore((s) => s.signOut);
    const [pending, setPending] = useState(false);

    const handleLogout = async () => {
        setPending(true);
        try {
            await signOut();
        } finally {
            setPending(false);
        }
    };

    const name = user?.ingameName || user?.slug || "";

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-base">{t("market.me.title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar size="lg">
                        <AvatarImage src={avatarUrl(user?.avatar)} alt={name} />
                        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                        <div className="text-sm font-medium">
                            {user?.slug ?? "-"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {user?.ingameName ?? "-"}
                        </div>
                    </div>
                </div>
                <Button
                    variant="outline"
                    disabled={pending}
                    onClick={handleLogout}
                >
                    {t("market.me.logout")}
                </Button>
            </CardContent>
        </Card>
    );
}

function LoginForm() {
    const { t } = useTranslation();
    const signIn = useAuthStore((s) => s.signIn);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = email.trim().length > 0 && password.length > 0 && !pending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setPending(true);
        setError(null);
        try {
            await signIn(email.trim(), password);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setPending(false);
        }
    };

    return (
        <Card className="mx-auto w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-base">{t("market.me.login")}</CardTitle>
                <CardDescription>{t("market.me.login.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="email">
                            {t("market.me.email")}
                        </label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="password">
                            {t("market.me.password")}
                        </label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error ? (
                        <div className="text-xs text-destructive">{error}</div>
                    ) : null}
                    <Button type="submit" className="w-full" disabled={!canSubmit}>
                        {pending ? t("common.loading") : t("market.me.login")}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
