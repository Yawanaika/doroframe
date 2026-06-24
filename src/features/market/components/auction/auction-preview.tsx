// 创建拍卖左侧预览：riven 渲染紫卡卡面，lich/sister 渲染武器图标 + 名称 + 幻纹。
// 纯展示组件，所有数据由弹窗算好后传入。

import { assetUrl } from "@/features/market/assets";
import { RivenCardPreview } from "@/features/market/components/auction/riven-card-preview.tsx";

export function AuctionPreview({
    isRiven,
    weaponName,
    weaponIcon,
    modName,
    polarity,
    stats,
    masteryRank,
    reRolls,
    hasEphemera,
    ephemeraName,
}: {
    isRiven: boolean;
    weaponName: string;
    weaponIcon: string;
    modName: string;
    polarity: string;
    stats: string[];
    masteryRank: string;
    reRolls: string;
    hasEphemera: boolean;
    ephemeraName: string;
}) {
    if (isRiven) {
        return (
            <RivenCardPreview
                weaponName={weaponName}
                modName={modName}
                polarity={polarity}
                stats={stats}
                masteryRank={masteryRank}
                reRolls={reRolls}
            />
        );
    }
    return (
        <div className="flex w-50 shrink-0 flex-col items-center gap-3 rounded-lg border p-4">
            {weaponIcon ? (
                <img src={assetUrl(weaponIcon)} alt="" className="size-28 object-contain" />
            ) : (
                <div className="size-28 rounded-full bg-muted" />
            )}
            <div className="text-center font-medium">{weaponName}</div>
            {hasEphemera && (
                <div className="text-center text-sm text-muted-foreground">
                    {ephemeraName}
                </div>
            )}
        </div>
    );
}
