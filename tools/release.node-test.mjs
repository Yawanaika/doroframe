import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
    parseArgs,
    readCargoVersion,
    resolveTargetVersion,
    updateCargoLockVersion,
    updateCargoVersion,
} from "./release.mjs";

const scriptPath = resolve(fileURLToPath(new URL("./release.mjs", import.meta.url)));

function createTestRepository(prefix = "doroframe-release-") {
    const root = mkdtempSync(join(tmpdir(), prefix));
    writeFileSync(
        join(root, "package.json"),
        `${JSON.stringify({ name: "doroframe", version: "0.1.0" }, null, 2)}\n`,
    );
    mkdirSync(join(root, "src-tauri"));
    writeFileSync(
        join(root, "src-tauri/Cargo.toml"),
        '[package]\nname = "doroframe"\nversion = "0.1.0"\n',
    );
    writeFileSync(
        join(root, "src-tauri/Cargo.lock"),
        '[[package]]\nname = "doroframe"\nversion = "0.1.0"\n',
    );
    execFileSync("git", ["init", "-b", "main"], { cwd: root });
    execFileSync("git", ["config", "user.name", "Release Test"], { cwd: root });
    execFileSync("git", ["config", "user.email", "release@example.com"], { cwd: root });
    execFileSync("git", ["add", "."], { cwd: root });
    execFileSync("git", ["commit", "-m", "initial"], { cwd: root });
    return root;
}

test("resolves semantic version bumps", () => {
    assert.equal(resolveTargetVersion("0.1.0", "patch"), "0.1.1");
    assert.equal(resolveTargetVersion("0.1.0", "minor"), "0.2.0");
    assert.equal(resolveTargetVersion("0.1.0", "major"), "1.0.0");
    assert.equal(resolveTargetVersion("0.1.0", "v0.4.2"), "0.4.2");
    assert.throws(() => resolveTargetVersion("1.0.0", "0.9.0"), /必须高于/);
    assert.throws(() => resolveTargetVersion("1.0.0", "1.1.0-beta.1"), /格式无效/);
});

test("parses release options", () => {
    assert.deepEqual(parseArgs(["minor", "--dry-run", "--branch", "release"]), {
        branch: "release",
        dryRun: true,
        yes: false,
        skipChecks: false,
        push: true,
        fetch: true,
        help: false,
        target: "minor",
    });
});

test("updates Cargo manifest and lock versions", () => {
    const manifest = '[package]\nname = "doroframe"\nversion = "0.1.0"\n\n[dependencies]\n';
    const lock = '[[package]]\nname = "doroframe"\nversion = "0.1.0"\n';
    const updatedManifest = updateCargoVersion(manifest, "0.2.0");

    assert.equal(readCargoVersion(updatedManifest), "0.2.0");
    assert.match(updateCargoLockVersion(lock, "0.2.0"), /version = "0\.2\.0"/);
});

test("dry run validates a clean repository without changing versions", () => {
    const root = createTestRepository();

    const result = spawnSync(
        process.execPath,
        [scriptPath, "patch", "--dry-run", "--branch", "main"],
        { cwd: root, encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /0\.1\.0 -> 0\.1\.1/);
    assert.match(result.stdout, /未修改任何文件/);
    assert.equal(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version, "0.1.0");
    assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }), "");
});

test("dry run rejects a dirty repository", () => {
    const root = createTestRepository("doroframe-release-dirty-");
    writeFileSync(join(root, "dirty.txt"), "dirty\n");

    const result = spawnSync(process.execPath, [scriptPath, "patch", "--dry-run"], {
        cwd: root,
        encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /工作区不干净/);
});

test("dry run rejects an existing release tag", () => {
    const root = createTestRepository("doroframe-release-tag-");
    execFileSync("git", ["tag", "v0.1.1"], { cwd: root });

    const result = spawnSync(process.execPath, [scriptPath, "patch", "--dry-run"], {
        cwd: root,
        encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /标签 v0\.1\.1 已存在/);
});

test("creates a synchronized local release commit and annotated tag", () => {
    const root = createTestRepository("doroframe-release-local-");
    const result = spawnSync(
        process.execPath,
        [scriptPath, "patch", "--yes", "--skip-checks", "--no-push"],
        { cwd: root, encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version, "0.1.1");
    assert.equal(readCargoVersion(readFileSync(join(root, "src-tauri/Cargo.toml"), "utf8")), "0.1.1");
    assert.match(readFileSync(join(root, "src-tauri/Cargo.lock"), "utf8"), /version = "0\.1\.1"/);
    assert.equal(
        execFileSync("git", ["log", "-1", "--pretty=%s"], { cwd: root, encoding: "utf8" }).trim(),
        "chore(release): v0.1.1",
    );
    assert.equal(
        execFileSync("git", ["tag", "--list", "v0.1.1"], { cwd: root, encoding: "utf8" }).trim(),
        "v0.1.1",
    );
    assert.match(
        execFileSync("git", ["cat-file", "-t", "v0.1.1"], { cwd: root, encoding: "utf8" }),
        /tag/,
    );
});
