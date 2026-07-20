// import "./style.css";
import {useEffect} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/query-client.ts";
import {initAuctionLive} from "@/features/market/ws/live.ts";
import {prewarmMyBids} from "@/features/market/ws/bids.ts";
import {useAuthStore} from "@/store/auth.ts";
import {useSettingsStore} from "@/store/settings.ts";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {RouterProvider} from "@tanstack/react-router";
import {router} from "@/app/router.tsx";
import {Toaster} from "sonner";
import {SessionExpiryGuard} from "@/features/market/components/session-expiry-guard.tsx";
import {UpdateNotifier} from "@/features/updater/update-notifier.tsx";

function App() {
  useEffect(() => initAuctionLive(), []);

  // 登录后全局预热我的出价，使大厅/搜索列表也能显示「我的出价」而非误判为未出价
  const token = useAuthStore((s) => s.token);
  const myId = useAuthStore((s) => s.user?.id);
  const lang = useSettingsStore((s) => s.lang);
  useEffect(() => {
    if (token && myId) void prewarmMyBids(token, myId, lang);
  }, [token, myId, lang]);
  return (
      (
          <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                  <RouterProvider router={router} />
                  <SessionExpiryGuard />
                  <UpdateNotifier />
                  <Toaster richColors position="top-right" />
              </TooltipProvider>
          </QueryClientProvider>
      )
  );
}

export default App;
