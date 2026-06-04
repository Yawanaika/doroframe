// import "./style.css";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/query-client.ts";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {RouterProvider} from "@tanstack/react-router";
import {router} from "@/app/router.tsx";
import {Toaster} from "sonner";

function App() {
  return (
      (
          <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                  <RouterProvider router={router} />
                  <Toaster richColors position="top-right" />
              </TooltipProvider>
          </QueryClientProvider>
      )
  );
}

export default App;
