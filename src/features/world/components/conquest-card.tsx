import React, { memo } from "react";
import type { Conquest } from "@/types/wf-state";
import { EventCard } from "@/components/event-card";
import { CardError, CardSkeleton } from "@/components/card-states";
import { Badge } from "@/components/ui/badge";
import { useConquestsQuery } from "@/features/world/queries";
import { useCountdown, formatCountdown } from "@/hooks/use-countdown";
import { tr } from "@/lib/wpep";
import {useTranslation} from "react-i18next";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const HARD = "CD_HARD"

const RISK_NAME = '/Lotus/Language/Conquest/Condition_{}';
const RISK_DESC = '/Lotus/Language/Conquest/Condition_{}_Desc';

const DEVIATION_NAME_MAP: Record<string, string> = {
    CT_LAB: '/Lotus/Language/Conquest/MissionVariant_LabConquest_{}',
    CT_HEX: '/Lotus/Language/Conquest/MissionVariant_HexConquest_{}',
};

const DEVIATION_DESC_MAP: Record<string, string> = {
    CT_LAB: '/Lotus/Language/Conquest/MissionVariant_LabConquest_{}_Desc',
    CT_HEX: '/Lotus/Language/Conquest/MissionVariant_HexConquest_{}_Desc',
};

const PERSONAL_MOD_NAME = '/Lotus/Language/Conquest/PersonalMod_{}';
const PERSONAL_MOD_DESC =
    '/Lotus/Language/Conquest/PersonalMod_{}_Desc';

const ConquestRow = memo(function ConquestRow({ conquest }: { conquest: Conquest }) {
    const sec = useCountdown(conquest.expiry);
    const [t] = useTranslation();
    return (
        <EventCard
            title={t(`conquest.${conquest.type}`)}
            // subtitle={`${conquest.missions.length} 个任务`}
            countdown={formatCountdown(sec)}
        >
            <div className="grid gap-1 text-sm">
                {conquest.missions.map((m, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                        <span className="min-w-[5em] shrink-0">{tr(m.missionType)}</span>
                        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                            {m.difficulties.map((d, i) =>
                                d.type === HARD ? (
                                    <React.Fragment key={i}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="outline">
                                                    {tr(DEVIATION_NAME_MAP[conquest.type].replace("{}", d.deviation))}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{tr(DEVIATION_DESC_MAP[conquest.type].replace("{}", d.deviation))}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {d.risks.map((r, ri) => (
                                            <Tooltip key={ri}>
                                                <TooltipTrigger asChild>
                                                    <Badge variant="outline">
                                                        {tr(RISK_NAME.replace("{}", r))}
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{tr(RISK_DESC.replace("{}", r))}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </React.Fragment>
                                ) : null
                            )}
                        </div>
                        <Badge variant="outline">{tr(m.faction)}</Badge>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap justify-around gap-1.5 mt-2">
                {conquest.variables.map((v, idx) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge key={idx} variant="outline">
                                    {tr(PERSONAL_MOD_NAME.replace("{}",v))}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tr(PERSONAL_MOD_DESC.replace("{}",v))}</p>
                            </TooltipContent>
                        </Tooltip>
                ))}
            </div>
        </EventCard>
    );
});

export function ConquestList() {
    const { data, isPending, isError, error } = useConquestsQuery();
    if (isPending) return <CardSkeleton />;
    if (isError) return <CardError message={String(error)} />;
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {data.map((c) => (
                <ConquestRow key={c.id} conquest={c} />
            ))}
        </div>
    );
}
