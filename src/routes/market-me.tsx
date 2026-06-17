import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { enUS, zhCN } from "date-fns/locale";
import {
    GlobeIcon,
    LogOutIcon,
    MonitorIcon,
    ShieldAlertIcon,
    StarIcon,
    UsersIcon,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { useSettingsStore } from "@/store/settings";
import { avatarUrl, assetUrl } from "@/features/market/assets";
import { statusOf } from "@/features/market/constants";
import { MyOrders } from "@/features/market/components/my-orders";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

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
    const lang = useSettingsStore((s) => s.lang);
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

    if (!user) return null;

    const name = user.ingameName || user.slug || "—";
    const status = statusOf(user.status);
    const statusLabel = lang === "zh" ? status.labelZh : status.labelEn;
    const lastSeen = lastSeenText(user.lastSeen, lang);

    return (
        // flex-col gap-4 容器：个人信息卡为横向 header，订单等信息向下堆叠
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
            <Card className="relative gap-0 overflow-hidden p-0">
                <ProfileBanner background={user.background} />

                {/* 退出登录：固定卡片右上角，半透明描边按钮在背景图上保持可读 */}
                <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4 z-10 bg-card/70 backdrop-blur"
                    disabled={pending}
                    onClick={handleLogout}
                >
                    {pending ? (
                        <Spinner data-icon="inline-start" />
                    ) : (
                        <LogOutIcon data-icon="inline-start" />
                    )}
                    {t("market.me.logout")}
                </Button>

                <CardContent className="relative flex items-center gap-5 p-5">
                    {/* 头像 + 状态点 */}
                    <div className="relative shrink-0">
                        <Avatar className="size-20 ring-4 ring-card after:hidden">
                            <AvatarImage src={avatarUrl(user.avatar)} alt={name} />
                            <AvatarFallback className="text-lg font-medium">
                                {name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span
                            aria-hidden
                            className="absolute right-1 bottom-1 size-3.5 rounded-full ring-[3px] ring-card"
                            style={{ backgroundColor: status.color }}
                        />
                    </div>

                    {/* 身份 + 数据，纵向堆叠在头像右侧 */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="truncate text-xl font-semibold tracking-tight">
                                {name}
                            </h1>
                            {user.banned ? (
                                <Badge variant="destructive">
                                    <ShieldAlertIcon />
                                    {t("market.me.banned")}
                                </Badge>
                            ) : null}
                        </div>

                        <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                            <span
                                className="inline-flex size-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: status.color }}
                            />
                            <span style={{ color: status.color }}>{statusLabel}</span>
                            {user.slug ? (
                                <>
                                    <Dot />
                                    <span className="truncate">@{user.slug}</span>
                                </>
                            ) : null}
                        </div>

                        {/* 数据条：横向 inline，发丝线分隔，声誉数字等宽 */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                            <Stat
                                label={t("market.me.reputation")}
                                value={user.reputation.toLocaleString()}
                                icon={<StarIcon />}
                                mono
                            />
                            <Stat
                                label={t("market.me.platform")}
                                value={user.platform.toUpperCase() || "—"}
                                icon={<MonitorIcon />}
                            />
                            <Stat
                                label={t("market.me.region")}
                                value={(user.region || "—").toUpperCase()}
                                icon={<GlobeIcon />}
                            />
                            {user.crossplay ? (
                                <Stat
                                    label={t("market.me.crossplay")}
                                    icon={<UsersIcon />}
                                />
                            ) : null}
                        </div>

                        {(user.about?.trim() || lastSeen) && (
                            <div className="mt-3 border-t pt-3">
                                {user.about?.trim() ? (
                                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                        {user.about}
                                    </p>
                                ) : null}
                                {lastSeen ? (
                                    <p className="mt-1 text-xs text-muted-foreground/70">
                                        {t("market.me.lastSeen")}: {lastSeen}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 订单展示：出售 / 求购 双栏 */}
            <MyOrders slug={user.slug} />
        </div>
    );
}

const DEFAULT_BACKGROUND = "/images/background.png";

/** 横幅底图：有 background 用图，缺失或加载失败回退本地默认图。 */
function ProfileBanner({ background }: { background?: string }) {
    const [errored, setErrored] = useState(false);
    const src =
        errored || !background ? DEFAULT_BACKGROUND : assetUrl(background);

    return (
        <div className="absolute inset-0">
            <img
                src={src}
                alt=""
                aria-hidden
                className="size-full object-cover"
                onError={() => {
                    if (!errored) setErrored(true);
                }}
            />
            {/* 左浓右淡的 scrim：左侧信息区落在卡片底色上保证对比度，右侧透出底图 */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-card via-card/85 to-card/30" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-card/60 to-transparent" />
        </div>
    );
}

function Stat({
    label,
    value,
    icon,
    mono = false,
}: {
    label: string;
    value?: string;
    icon: React.ReactNode;
    mono?: boolean;
}) {
    return (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground [&>svg]:size-3.5 [&>svg]:shrink-0">
            {icon}
            <span className="text-xs">{label}</span>
            {value ? (
                <span
                    className={cn(
                        "font-medium text-foreground",
                        mono && "font-mono tabular-nums",
                    )}
                    title={value}
                >
                    {value}
                </span>
            ) : null}
        </span>
    );
}

function Dot() {
    return <span className="text-muted-foreground/50">·</span>;
}

function lastSeenText(raw: string | undefined, lang: string): string | null {
    if (!raw) return null;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return null;
    return formatDistanceToNow(d, {
        addSuffix: true,
        locale: lang === "zh" ? zhCN : enUS,
    });
}

function LoginForm() {
    const { t } = useTranslation();
    const signIn = useAuthStore((s) => s.signIn);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = email.trim().length > 0 && password.length > 0 && !pending;

    const handleSubmit = async (e: React.SyntheticEvent) => {
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
                <div className="mb-1 flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-primary">
                    <UsersIcon className="size-4.5" />
                </div>
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
                                <FieldDescription className="text-destructive">
                                    {error}
                                </FieldDescription>
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
