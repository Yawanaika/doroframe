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
import { StatePage } from "@/routes/state";
import { WeeklyPage } from "@/routes/weekly";
import {SettingsPage} from "@/routes/settings.tsx";
import { NotFoundPage } from "@/routes/not-found";

const rootRoute = createRootRoute({
    component: RootLayout,
    notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: StatePage,
});

const stateRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/state",
    component: StatePage,
});

const weeklyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/state/weekly",
    component: WeeklyPage,
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
    weeklyRoute,
    settingsRoute,
    notFoundRoute,
]);

const initialPath =
    typeof window !== "undefined" && window.location.hash.startsWith("#/")
        ? window.location.hash.slice(1)
        : "/state";

export const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

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
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

function breadcrumb(path: string): string {
    if (path === "/state") return "Warframe 状态";
    if (path.startsWith("/state/weekly")) return "周常任务";
    if (path.startsWith("/market/items")) return "订单";
    if (path.startsWith("/market/auctions")) return "拍卖";
    if (path.startsWith("/market/me")) return "我的";
    if (path.startsWith("/settings")) return "设置";
    return path;
}

export { Link };
