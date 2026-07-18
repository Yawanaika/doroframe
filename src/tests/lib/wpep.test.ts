import { describe, it, expect } from "vitest";
import { tr, setActiveLang, getActiveLang, itemDetail } from "@/lib/wpep";
import { resolveNode } from "@/lib/wpep/nodes";

describe("wpep tr()", () => {
    it("空 key 返回空字符串", () => {
        expect(tr(undefined)).toBe("");
        expect(tr(null)).toBe("");
        expect(tr("")).toBe("");
    });

    it("未命中 key 回退到原 key", () => {
        const v = tr("/Lotus/NonExistent/Key");
        expect(typeof v).toBe("string");
        expect(v.length).toBeGreaterThan(0);
    });

    it("重复调用同 key 返回引用相等字符串（缓存生效）", () => {
        const a = tr("/Lotus/Language/Items/PrimeWarframe");
        const b = tr("/Lotus/Language/Items/PrimeWarframe");
        expect(a).toBe(b);
    });

    it("切换默认语言", () => {
        setActiveLang("en");
        expect(getActiveLang()).toBe("en");
        setActiveLang("zh");
        expect(getActiveLang()).toBe("zh");
    });
});

describe("resolveNode", () => {
    it("未知 node 退化为 location 字符串", () => {
        const r = resolveNode("FAKE_NODE");
        expect(r.nameZh).toBe("FAKE_NODE");
    });

    it("undefined 返回空名", () => {
        const r = resolveNode(undefined);
        expect(r.nameZh).toBe("");
    });
});

describe("itemDetail", () => {
    it("能查询 browse.wf 最新快照中的 TennoCon 装饰与 Lotus 浮印", () => {
        setActiveLang("zh");

        const cosplayDisplay = itemDetail(
            "/Lotus/StoreItems/Types/Items/ShipDecos/Tennocon2026CosplayDisplay",
        );
        const singingLotusGlyph = itemDetail(
            "/Lotus/StoreItems/Types/StoreItems/AvatarImages/AvatarImageSingingLotusGlyph",
        );

        expect(cosplayDisplay).toMatchObject({
            key: "/Lotus/Types/Items/ShipDecos/Tennocon2026CosplayDisplay",
            source: "resources",
            name: "维米尼亚角色扮演社区展示",
        });
        expect(cosplayDisplay?.icon).toContain("TennoCon2026CosplayDisplay.png");

        expect(singingLotusGlyph).toMatchObject({
            key: "/Lotus/Types/StoreItems/AvatarImages/AvatarImageSingingLotusGlyph",
            source: "flavour",
            name: "唱歌的 Lotus 社区浮印",
        });
        expect(singingLotusGlyph?.icon).toContain("SingingLotusGlyph.png");
    });
});
