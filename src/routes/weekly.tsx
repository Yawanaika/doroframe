import { SortyList } from "@/features/world/components/sorty-card";
import { ActiveMissionList } from "@/features/world/components/active-mission-card";
import { SyndicateList } from "@/features/world/components/syndicate-card";
import { SeasonInfoCard } from "@/features/world/components/season-info-card";
import { ConquestList } from "@/features/world/components/conquest-card";

export function WeeklyPage() {
    return (
        <div className="space-y-6">
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">每日突击</h2>
                <SortyList />
            </section>
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">仲裁</h2>
                <ActiveMissionList />
            </section>
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">集团每日</h2>
                <SyndicateList />
            </section>
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">午夜电波</h2>
                <SeasonInfoCard />
            </section>
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">九重天</h2>
                <ConquestList />
            </section>
        </div>
    );
}
