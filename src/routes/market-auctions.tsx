import { AuctionSearchBar } from "@/features/market/components/auction/auction-search-bar";
import { AuctionList } from "@/features/market/components/auction/auction-list";
import { NeedCreateAuction } from "@/features/market/components/auction/create-auction-dialog";
import { useAuctions } from "@/features/market/use-auctions";
import { Card } from "@/components/ui/card";
import { CardError } from "@/components/card-states";

export function MarketAuctionsPage() {
    const {
        auctions,
        isSearching,
        onSearch,
        onReset,
    } = useAuctions();

    return (
        <div className="flex h-full flex-col gap-3">
            <Card className="shrink-0 p-4">
                <AuctionSearchBar onSearch={onSearch} onReset={onReset} />
            </Card>

            <div className="min-h-0 flex-1 overflow-auto">
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
            
            <NeedCreateAuction />
        </div>
    );
}
