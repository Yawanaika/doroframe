/** One weekly Vault bonus rotation and its point-based reward tiers. */
export interface WeeklyVaultBonusReward {
    weekCount: number;
    bonusRegion: string;
    rewards: WeeklyVaultBonusRewardItem[];
}

export interface WeeklyVaultBonusRewardItem {
    rewardClaimed: boolean;
    pointThreshold: number;
    itemCount: number;
    reward: string;
}

export function weeklyVaultBonusRewardFromJson(json: any): WeeklyVaultBonusReward {
    return {
        weekCount: json?.WeekCount ?? 0,
        bonusRegion: json?.BonusRegion ?? "",
        rewards: Array.isArray(json?.Rewards)
            ? json.Rewards.map(weeklyVaultBonusRewardItemFromJson)
            : [],
    };
}

export function weeklyVaultBonusRewardToJson(wv: WeeklyVaultBonusReward) {
    return {
        weekCount: wv.weekCount,
        bonusRegion: wv.bonusRegion,
        rewards: wv.rewards.map(weeklyVaultBonusRewardItemToJson),
    };
}

function weeklyVaultBonusRewardItemFromJson(json: any): WeeklyVaultBonusRewardItem {
    return {
        rewardClaimed: json?.RewardClaimed ?? false,
        pointThreshold: json?.PointThreshold ?? 0,
        itemCount: json?.ItemCount ?? 0,
        reward: json?.Reward ?? "",
    };
}

function weeklyVaultBonusRewardItemToJson(wv: WeeklyVaultBonusRewardItem) {
    return {
        rewardClaimed: wv.rewardClaimed,
        pointThreshold: wv.pointThreshold,
        itemCount: wv.itemCount,
        reward: wv.reward,
    };
}
