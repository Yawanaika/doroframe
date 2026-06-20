import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { AuctionSearchBar } from "@/features/market/components/auction/auction-search-bar";
import { AuctionList } from "@/features/market/components/auction/auction-list";
import { CreateAuctionDialog } from "@/features/market/components/auction/create-auction-dialog";
import { useAuctions } from "@/features/market/use-auctions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardError } from "@/components/card-states";

export function MarketAuctionsPage() {
    const { t } = useTranslation();
    const {
        auctions,
        isSearching,
        isLoggedIn,
        createOpen,
        setCreateOpen,
        onSearch,
        onReset,
    } = useAuctions();

    return (
        <div className="flex h-full flex-col gap-3">
            <Card className="p-4">
                <AuctionSearchBar onSearch={onSearch} onReset={onReset} />
            </Card>

            <div className="flex-1 overflow-auto">
                {auctions.isError ? (
                    <CardError message={String(auctions.error)} />
                ) : (
                    <AuctionList
                        auctions={auctions.data ?? []}
                        isLoading={auctions.isPending}
                        isSearching={isSearching}
                    />
                )}
            </div>

            {isLoggedIn && (
                <CreateAuctionDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    trigger={
                        <Button
                            size="icon"
                            aria-label={t("auction.create.title")}
                            className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg"
                        >
                            <Plus className="size-6" />
                        </Button>
                    }
                />
            )}
        </div>
    );
}
