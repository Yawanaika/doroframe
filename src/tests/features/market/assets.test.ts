import { describe, expect, it } from "vitest";
import {
    DEFAULT_AVATAR,
    assetUrl,
    avatarUrl,
} from "@/features/market/assets";

const sourceUrl = (proxiedUrl: string): string | null =>
    new URL(proxiedUrl).searchParams.get("url");

describe("warframe.market assets", () => {
    it("通过允许跨域的图片代理加载 market 静态资源", () => {
        const path =
            "items/images/en/fragor_prime_set.2b917b8a12f0981ff0a9a48c6c24edb1.png";
        const url = assetUrl(path);

        expect(url).toMatch(/^https:\/\/wsrv\.nl\/\?url=/);
        expect(sourceUrl(url)).toBe(
            `https://warframe.market/static/assets/${path}`,
        );
    });

    it("规范化资源路径开头的斜杠", () => {
        expect(sourceUrl(assetUrl("/sub_icons/blueprint_128x128.png"))).toBe(
            "https://warframe.market/static/assets/sub_icons/blueprint_128x128.png",
        );
    });

    it("头像缺失时同样使用代理后的默认头像", () => {
        expect(avatarUrl(undefined)).toBe(DEFAULT_AVATAR);
        expect(sourceUrl(DEFAULT_AVATAR)).toBe(
            "https://warframe.market/static/assets/user/default-avatar.png",
        );
    });
});
