import { useState } from "react";
import { ArbitrationCard } from "@/features/world/components/arbitration-card";
import {
    REGIONS,
    RegionBountyShelf,
} from "@/features/world/components/region-bounty-shelf";
import { DailyDealList } from "@/features/world/components/daily-deal-card";
import { LiteSortyList, SortyList } from "@/features/world/components/sorty-card";

export function HomePage() {
    const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
    const activeRegion =
        REGIONS.find((region) => region.id === activeRegionId) ?? null;

    return (
        <div className="space-y-4">
            <RegionBountyShelf
                activeRegion={activeRegion}
                onRegionClick={(regionId) => {
                    setActiveRegionId((current) =>
                        current === regionId ? null : regionId,
                    );
                }}
            />
            <DailyChallengeGrid />
        </div>
    );
}

function DailyChallengeGrid() {
    return (
        <section className="grid gap-4 lg:grid-cols-2">
            <ArbitrationCard />
            <DailyDealList />
            <SortyList />
            <LiteSortyList />
        </section>
    );
}
