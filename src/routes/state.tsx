import { useTranslation } from "react-i18next";
import { AlertList } from "@/features/world/components/alert-card";
import { ActiveMissionList } from "@/features/world/components/active-mission-card";
import { SortyList, LiteSortyList } from "@/features/world/components/sorty-card";
import { SyndicateList } from "@/features/world/components/syndicate-card";
import { InvasionList } from "@/features/world/components/invasion-card";
import { VoidTraderList } from "@/features/world/components/void-trader-card";
import { PrimeVaultList } from "@/features/world/components/prime-vault-card";
import { VoidStormList } from "@/features/world/components/void-storm-card";
import { DailyDealList } from "@/features/world/components/daily-deal-card";
import { GoalList } from "@/features/world/components/goal-card";
import { ConquestList } from "@/features/world/components/conquest-card";
import { DescentList } from "@/features/world/components/descent-card";
import { EndlessXpList } from "@/features/world/components/endless-xp-card";
import { SeasonInfoCard } from "@/features/world/components/season-info-card";
import { CalendarSeasonList } from "@/features/world/components/calendar-card";

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            {children}
        </section>
    );
}

export function StatePage() {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <Section title={t("state.title.goal")}>
                <GoalList />
            </Section>
            <Section title={t("state.title.alert")}>
                <AlertList />
            </Section>
            <Section title={t("state.title.arby")}>
                <ActiveMissionList />
            </Section>
            <Section title={t("state.title.sortie")}>
                <SortyList />
            </Section>
            <Section title={t("state.title.lite-sortie")}>
                <LiteSortyList />
            </Section>
            <Section title={t("state.title.syndicate")}>
                <SyndicateList />
            </Section>
            <Section title={t("state.title.invasion")}>
                <InvasionList />
            </Section>
            <Section title={t("state.title.void-trader")}>
                <VoidTraderList />
            </Section>
            <Section title={t("state.title.prime-vault")}>
                <PrimeVaultList />
            </Section>
            <Section title={t("state.title.void-storm")}>
                <VoidStormList />
            </Section>
            <Section title={t("state.title.daily-deal")}>
                <DailyDealList />
            </Section>
            <Section title={t("state.title.conquest")}>
                <ConquestList />
            </Section>
            <Section title={t("state.title.descent")}>
                <DescentList />
            </Section>
            <Section title={t("state.title.endless-xp")}>
                <EndlessXpList />
            </Section>
            <Section title={t("state.title.season-info")}>
                <SeasonInfoCard />
            </Section>
            <Section title={t("state.title.calendar")}>
                <CalendarSeasonList />
            </Section>
        </div>
    );
}
