import { describe, expect, it } from "vitest";

import type { AuctionOrder } from "@/types/wf-market";
import {mergeAuction} from "@/features/market/ws/live.ts";

const ao = (id: string, top?: number): AuctionOrder =>
    ({ id, topBid: top }) as AuctionOrder;

describe("mergeAuction", () => {
    it("undefined 缓存原样返回（不 panic）", () => {
        expect(mergeAuction(undefined, ao("a"))).toBeUndefined();
    });
    it("命中 id 则替换", () => {
        const next = mergeAuction([ao("a", 1), ao("b", 2)], ao("a", 9))!;
        expect(next[0].topBid).toBe(9);
        expect(next[1].topBid).toBe(2);
    });
    it("未命中 id 则原样（不插入新单）", () => {
        const old = [ao("a")];
        expect(mergeAuction(old, ao("z"))).toBe(old);
    });
});
