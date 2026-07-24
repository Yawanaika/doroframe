import { useState } from "react";
import { ArbitrationCard } from "@/features/world/components/arbitration-card";
import {
    REGIONS,
    RegionBountyShelf,
} from "@/features/world/components/region-bounty-shelf";
import { DailyDealList } from "@/features/world/components/daily-deal-card";
import { LiteSortyList, SortyList } from "@/features/world/components/sorty-card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, CrosshairIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HomePage() {
    const { t } = useTranslation();
    const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
    const activeRegion =
        REGIONS.find((region) => region.id === activeRegionId) ?? null;

    return (
        <div className="mx-auto flex w-full min-w-0 max-w-384 flex-col gap-7 pb-2">
            <RegionBountyShelf
                activeRegion={activeRegion}
                onRegionClick={(regionId) => {
                    setActiveRegionId((current) =>
                        current === regionId ? null : regionId,
                    );
                }}
            />
            <section aria-labelledby="home-highlight-title" className="space-y-3">
                <header className="flex items-end justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <CrosshairIcon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <h2
                                id="home-highlight-title"
                                className="text-lg font-semibold text-foreground"
                            >
                                {t("home.title.highlight")}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {t("home.subtitle.highlight")}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/state">
                            {t("event.more")}
                            <ArrowRightIcon aria-hidden="true" />
                        </Link>
                    </Button>
                </header>
                <DailyChallengeGrid />
            </section>
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
