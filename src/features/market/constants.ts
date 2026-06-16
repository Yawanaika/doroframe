// 订单类型与用户状态常量 —— 对应 doroprime 的 OrderType / UserStatus 枚举

export type OrderTypeCode = "sell" | "buy";

export interface OrderTypeDef {
    code: OrderTypeCode;
    /** 列表里订单方的标签（出售方 / 求购方） */
    labelZh: string;
    labelEn: string;
    /** 我方对这条订单要执行的动作（卖单→我买；买单→我卖），用于喊话模板 */
    actionZh: string;
    actionEn: string;
    /** 强调色（卖单绿、买单蓝），对应 doroprime accentColor */
    accent: string;
}

export const ORDER_TYPES: Record<OrderTypeCode, OrderTypeDef> = {
    sell: {
        code: "sell",
        labelZh: "出售",
        labelEn: "WTS",
        actionZh: "购买",
        actionEn: "buy",
        accent: "rgba(34,197,94,0.7)",
    },
    buy: {
        code: "buy",
        labelZh: "求购",
        labelEn: "WTB",
        actionZh: "出售",
        actionEn: "sell",
        accent: "rgba(59,130,246,0.7)",
    },
};

export type UserStatusCode = "ingame" | "online" | "offline";

export interface UserStatusDef {
    code: UserStatusCode;
    /** 排序权重，越大越靠前（游戏中 > 在线 > 离线） */
    sort: number;
    labelZh: string;
    labelEn: string;
    /** 徽标色 */
    color: string;
}

export const USER_STATUS: Record<UserStatusCode, UserStatusDef> = {
    ingame: { code: "ingame", sort: 3, labelZh: "游戏中", labelEn: "In Game", color: "#22c55e" },
    online: { code: "online", sort: 2, labelZh: "在线", labelEn: "Online", color: "#f59e0b" },
    offline: { code: "offline", sort: 1, labelZh: "离线", labelEn: "Offline", color: "#9ca3af" },
};

export const statusOf = (code: string | undefined): UserStatusDef =>
    USER_STATUS[(code as UserStatusCode)] ?? USER_STATUS.offline;
