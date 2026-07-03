// 我的拍卖（owner 视角）：拉取当前用户上架的拍卖，复用 AuctionList 展示 +
// 每张卡片带关闭/编辑/隐藏操作；顶部提供「展示全部/隐藏全部」批量按钮。

import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import {
    useUserAuctionsQuery,
    useSetAuctionsVisibilityMutation,
} from "@/features/market/queries";
import { AuctionList } from "@/features/market/components/auction/auction-list";
import { Button } from "@/components/ui/button";

export function MyAuctions({ slug }: { slug: string | undefined }) {
    const { t } = useTranslation();
    const auctionsQ = useUserAuctionsQuery(slug);
    const visMut = useSetAuctionsVisibilityMutation();

    const auctions = auctionsQ.data ?? [];
    const hasOpen = auctions.some((a) => !a.closed);

    const setAllVisible = (visible: boolean) =>
        visMut.mutate(visible, {
            onSuccess: () =>
                toast.success(
                    visible
                        ? t("auction.owner.shownAll")
                        : t("auction.owner.hiddenAll"),
                ),
            onError: (e) => toast.error(String(e)),
        });

    return (
        <div className="flex flex-col gap-3">
            {hasOpen ? (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        size="sm"
                        disabled={visMut.isPending}
                        onClick={() => setAllVisible(true)}
                    >
                        <EyeIcon data-icon="inline-start" />
                        {t("auction.owner.showAll")}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={visMut.isPending}
                        onClick={() => setAllVisible(false)}
                    >
                        <EyeOffIcon data-icon="inline-start" />
                        {t("auction.owner.hideAll")}
                    </Button>
                </div>
            ) : null}

            <AuctionList
                auctions={auctions}
                isLoading={auctionsQ.isPending}
                isSearching={false}
                emptyText={t("market.me.auctions.empty")}
                owner
            />
        </div>
    );
}
