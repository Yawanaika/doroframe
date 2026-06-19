import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
    Link,
    useRouterState,
    createMemoryHistory,
} from "@tanstack/react-router";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { HomePage } from "@/routes/home";
import { StatePage } from "@/routes/state";
import { MarketItemsPage } from "@/routes/market-items";
import { MarketMePage } from "@/routes/market-me";
import {SettingsPage} from "@/routes/settings.tsx";
import { NotFoundPage } from "@/routes/not-found";
import { i18n } from "@/lib/i18n";

const rootRoute = createRootRoute({
    component: RootLayout,
    notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage,
});

const stateRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/state",
    component: StatePage,
});

const marketItemsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/market/items",
    component: MarketItemsPage,
    // 支持 ?slug= 深链：从「我的订单」等处点物品名跳转过来时定位到该物品
    validateSearch: (search: Record<string, unknown>): { slug?: string } => ({
        slug: typeof search.slug === "string" ? search.slug : undefined,
    }),
});

const marketMeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/market/me",
    component: MarketMePage,
});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/settings",
    component: SettingsPage,
});

const notFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "*",
    component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    stateRoute,
    marketItemsRoute,
    marketMeRoute,
    settingsRoute,
    notFoundRoute,
]);

const initialPath =
    typeof window !== "undefined" && window.location.hash.startsWith("#/")
        ? window.location.hash.slice(1)
        : "/";

export const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
});

function RootLayout() {
    const path = useRouterState({ select: (s) => s.location.pathname });

    // overlay 子窗口走裸渲染，不套 Sidebar
    if (path === "/overlay") {
        return <Outlet />;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {breadcrumb(path)}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

function breadcrumb(path: string): string {
    const t = i18n.t.bind(i18n);
    if (path === "/") return t("nav.home");
    if (path === "/state") return t("nav.state");
    if (path.startsWith("/market/items")) return t("nav.market.items");
    if (path.startsWith("/market/auctions")) return t("nav.market.auctions");
    if (path.startsWith("/market/me")) return t("nav.market.me");
    if (path.startsWith("/settings")) return t("nav.settings");
    return path;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export { Link };
