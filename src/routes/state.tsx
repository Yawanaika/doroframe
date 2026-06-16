import { useTranslation } from "react-i18next";
import { AlertList } from "@/features/world/components/alert-card";
import { ActiveMissionList } from "@/features/world/components/active-mission-card";
import { InvasionList } from "@/features/world/components/invasion-card";
import { VoidTraderList } from "@/features/world/components/void-trader-card";
import { PrimeVaultList } from "@/features/world/components/prime-vault-card";
import { VoidStormList } from "@/features/world/components/void-storm-card";
import { GoalList } from "@/features/world/components/goal-card";
import { ConquestList } from "@/features/world/components/conquest-card";
import { DescentList } from "@/features/world/components/descent-card";
import { EndlessXpList } from "@/features/world/components/endless-xp-card";
import { SeasonInfoCard } from "@/features/world/components/season-info-card";
import { CalendarMonthList } from "@/features/world/components/calendar-month-card";
import {SpIncursionsCard} from "@/features/world/components/sp-incursions-card.tsx";

function Section({
    title,
    children,
    index = 0,
}: {
    title: string;
    children: React.ReactNode;
    index?: number;
}) {
    return (
        <section
            className="space-y-2 animate-fade-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <h2 className="text-lg font-semibold">{title}</h2>
            {children}
        </section>
    );
}

export function StatePage() {
    const { t } = useTranslation();
    let i = 0;
    const S = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <Section title={title} index={i++}>
            {children}
        </Section>
    );
    return (
        <div className="space-y-6">
            <S title={t("state.title.goal")}><GoalList /></S>
            <S title={t("state.title.alert")}><AlertList /></S>
            <S title={t("state.title.sp-incursions")}><SpIncursionsCard /></S>
            <S title={t("state.title.active-mission")}><ActiveMissionList /></S>
            <S title={t("state.title.void-storm")}><VoidStormList /></S>
            {/*<div className="grid gap-3 md:grid-cols-2">*/}
            {/*    <S title={t("state.title.sortie")}><SortyList /></S>*/}
            {/*    <S title={t("state.title.lite-sortie")}><LiteSortyList /></S>*/}
            {/*</div>*/}
            {/*<S title={t("state.title.syndicate")}><SyndicateList /></S>*/}
            <S title={t("state.title.invasion")}><InvasionList /></S>
            <S title={t("state.title.void-trader")}><VoidTraderList /></S>
            <S title={t("state.title.prime-vault")}><PrimeVaultList /></S>
            {/*<S title={t("state.title.daily-deal")}><DailyDealList /></S>*/}
            <S title={t("state.title.conquest")}><ConquestList /></S>
            <S title={t("state.title.descent")}><DescentList /></S>
            <S title={t("state.title.endless-xp")}><EndlessXpList /></S>
            {/*<S title={t("state.title.bounty-cycle")}><BountyCycleList /></S>*/}
            <S title={t("state.title.season-info")}><SeasonInfoCard /></S>
            <S title={t("state.title.calendar")}><CalendarMonthList /></S>
        </div>
    );
}
