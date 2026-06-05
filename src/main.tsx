import React from "react";
import ReactDOM from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { warmupTrCache } from "@/lib/wpep";
import { useSettingsStore } from "@/features/settings/store";
import "@/lib/i18n";
import "./style.css";
import App from "@/App.tsx";

warmupTrCache("zh");

// // 先应用默认主题，确保首次渲染就有样式
// applyColorTheme(DEFAULT_PRIMARY, DEFAULT_BASE, DEFAULT_CHART);
// applyTheme("system");
// 异步加载已保存的设置并覆盖
useSettingsStore.getState().hydrate();
// registerShortcuts();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <TooltipProvider>
            <App />
        </TooltipProvider>
    </React.StrictMode>,
);
