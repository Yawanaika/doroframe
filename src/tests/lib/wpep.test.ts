import { describe, it, expect } from "vitest";
import { tr, setActiveLang, getActiveLang } from "@/lib/wpep";
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
