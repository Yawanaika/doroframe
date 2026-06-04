import React from "react";
import ReactDOM from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { warmupTrCache } from "@/lib/wpep";
import { useSettingsStore } from "@/features/settings/store";
import "@/lib/i18n";
import "./style.css";
import App from "@/App.tsx";

warmupTrCache("zh");
useSettingsStore.getState().hydrate();
// registerShortcuts();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <TooltipProvider>
            <App />
        </TooltipProvider>
    </React.StrictMode>,
);
