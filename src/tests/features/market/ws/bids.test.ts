import { describe, expect, it } from "vitest";

import type { AuctionBidLite } from "@/api/market";
import {pickMyLatestBid} from "@/features/market/ws/bids.ts";

const bid = (id: string, userId: string, updated: string): AuctionBidLite => ({
    id,
    value: 1,
    userId,
    updated,
});

describe("pickMyLatestBid", () => {
    it("多条取我的最新一条（按 updated）", () => {
        const bids = [
            bid("b1", "me", "2026-06-01T00:00:00Z"),
            bid("b2", "me", "2026-06-03T00:00:00Z"),
            bid("b3", "other", "2026-06-09T00:00:00Z"),
        ];
        expect(pickMyLatestBid(bids, "me")?.id).toBe("b2");
    });
    it("无我的出价 → undefined", () => {
        expect(pickMyLatestBid([bid("b1", "other", "x")], "me")).toBeUndefined();
    });
});
