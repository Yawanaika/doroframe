import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore, type ThemeMode } from "@/features/settings/store";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useTranslation} from "react-i18next";

const modes: { value: ThemeMode; icon: typeof Sun ; desc: string}[] = [
    { value: "system", icon: Monitor , desc: "theme.auto"},
    { value: "light", icon: Sun , desc: "theme.light"},
    { value: "dark", icon: Moon , desc: "theme.dark"},
];

export function ModeToggle() {
    const theme = useSettingsStore((s) => s.theme);
    const update = useSettingsStore((s) => s.update);

    const idx = modes.findIndex((m) => m.value === theme);
    const current = modes[idx] ?? modes[0];
    const Icon = current.icon;
    const desc = current.desc;
    const [t] = useTranslation();

    const cycle = () => {
        const next = modes[(idx + 1) % modes.length];
        update("theme", next.value);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={cycle}>
                    <Icon className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">切换外观</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{t(desc)}</p>
            </TooltipContent>
        </Tooltip>
    );
}
