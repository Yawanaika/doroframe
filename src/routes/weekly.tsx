import { SortyList } from "@/features/world/components/sorty-card";
import { ActiveMissionList } from "@/features/world/components/active-mission-card";
import { SyndicateList } from "@/features/world/components/syndicate-card";
import { SeasonInfoCard } from "@/features/world/components/season-info-card";
import { ConquestList } from "@/features/world/components/conquest-card";
import { useTranslation } from "react-i18next";

export function WeeklyPage() {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t("state.title.sortie")}</h2>
                <SortyList />
            </section>
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t("state.title.arby")}</h2>
                <ActiveMissionList />
            </section>
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t("state.title.syndicate")}</h2>
                <SyndicateList />
            </section>
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t("state.title.season-info")}</h2>
                <SeasonInfoCard />
            </section>
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">{t("state.title.conquest")}</h2>
                <ConquestList />
            </section>
        </div>
    );
}
