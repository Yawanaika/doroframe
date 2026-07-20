import assert from "node:assert/strict";
import test from "node:test";

import {
    classifyCommit,
    parseCommitRecords,
    renderChanges,
    renderTemplate,
    upsertEntry,
} from "./generate.mjs";

test("classifies conventional and breaking commits", () => {
    assert.deepEqual(classifyCommit("feat(market): 添加订单筛选"), {
        category: "新功能",
        scope: "market",
        description: "添加订单筛选",
    });
    assert.deepEqual(classifyCommit("fix!: 调整缓存格式"), {
        category: "破坏性变更",
        scope: null,
        description: "调整缓存格式",
    });
});

test("parses and renders commit records", () => {
    const commits = parseCommitRecords(
        "abcdef1234567890\x1fabcdef1\x1fYawanaika\x1ffeat(app): 自动更新\x1e",
    );
    const rendered = renderChanges(commits, "Yawanaika/doroframe");

    assert.equal(commits.length, 1);
    assert.match(rendered, /### 新功能/);
    assert.match(rendered, /\*\*app：\*\*自动更新/);
    assert.match(rendered, /Yawanaika\/doroframe\/commit\/abcdef1234567890/);
});

test("renders all template variables", () => {
    assert.equal(
        renderTemplate("{{VERSION}} {{DATE}}", {
            VERSION: "1.2.3",
            DATE: "2026-07-20",
        }),
        "1.2.3 2026-07-20",
    );
});

test("upserts a version entry idempotently", () => {
    const initial = "# Changelog\n\n<!-- changelog:entries -->\n";
    const first = upsertEntry(initial, "v1.0.0", "## [1.0.0]");
    const second = upsertEntry(first, "v1.0.0", "## [1.0.0]\n\nUpdated");

    assert.equal((second.match(/changelog:v1\.0\.0:start/g) ?? []).length, 1);
    assert.match(second, /Updated/);
});
