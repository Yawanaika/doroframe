// import "./style.css";
import {useEffect} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/query-client.ts";
import {initAuctionLive} from "@/features/market/ws/live.ts";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {RouterProvider} from "@tanstack/react-router";
import {router} from "@/app/router.tsx";
import {Toaster} from "sonner";
import {SessionExpiryGuard} from "@/features/market/components/session-expiry-guard.tsx";

function App() {
  useEffect(() => initAuctionLive(), []);
  return (
      (
          <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                  <RouterProvider router={router} />
                  <SessionExpiryGuard />
                  <Toaster richColors position="top-right" />
              </TooltipProvider>
          </QueryClientProvider>
      )
  );
}

export default App;
