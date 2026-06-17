import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store";
import { avatarUrl } from "@/features/market/assets";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

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
                <CardTitle>{t("market.me.title")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                <Avatar className="size-12">
                    <AvatarImage src={avatarUrl(user?.avatar)} alt={name} />
                    <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{user?.slug ?? "-"}</span>
                    <span className="text-xs text-muted-foreground">
                        {user?.ingameName ?? "-"}
                    </span>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    className="w-full"
                    disabled={pending}
                    onClick={handleLogout}
                >
                    {pending ? <Spinner data-icon="inline-start" /> : null}
                    {t("market.me.logout")}
                </Button>
            </CardFooter>
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

    const handleSubmit = async (e :React.SyntheticEvent) => {
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
                <CardTitle>{t("market.me.login")}</CardTitle>
                <CardDescription>{t("market.me.login.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">
                                {t("market.me.email")}
                            </FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                aria-label={t("market.me.email")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Field>
                        <Field data-invalid={error ? true : undefined}>
                            <FieldLabel htmlFor="password">
                                {t("market.me.password")}
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                aria-label={t("market.me.password")}
                                aria-invalid={error ? true : undefined}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error ? (
                                <FieldDescription>{error}</FieldDescription>
                            ) : null}
                        </Field>
                        <Button type="submit" disabled={!canSubmit}>
                            {pending ? <Spinner data-icon="inline-start" /> : null}
                            {t("market.me.login")}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
