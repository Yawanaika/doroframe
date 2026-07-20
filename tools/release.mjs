#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createInterface } from "node:readline/promises";

const PACKAGE_PATH = "package.json";
const CARGO_PATH = "src-tauri/Cargo.toml";
const CARGO_LOCK_PATH = "src-tauri/Cargo.lock";
const VERSION_FILES = [PACKAGE_PATH, CARGO_PATH, CARGO_LOCK_PATH];
const BUMP_TYPES = new Set(["patch", "minor", "major"]);

const USAGE = `用法：
  pnpm release <patch|minor|major|x.y.z> [选项]

示例：
  pnpm release patch
  pnpm release minor --dry-run
  pnpm release 1.0.0 --no-push

选项：
  --dry-run       只检查并显示发布计划，不修改文件
  --yes, -y       跳过发布确认
  --skip-checks   跳过测试与构建，不推荐
  --no-push       创建本地提交和标签，但不推送
  --no-fetch      推送前不执行 git fetch
  --branch <name> 指定允许发布的分支，默认 main
  --help, -h      显示帮助
`;

function runCapture(command, args, options = {}) {
    const output = execFileSync(command, args, {
        cwd: options.cwd ?? process.cwd(),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
    });
    return options.trim === false ? output : output.trim();
}

function run(command, args, options = {}) {
    const printable = [command, ...args].join(" ");
    process.stdout.write(`\n> ${printable}\n`);
    const result = spawnSync(command, args, {
        cwd: options.cwd ?? process.cwd(),
        stdio: "inherit",
        env: process.env,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
        throw new Error(`${printable} 执行失败，退出码 ${result.status ?? "unknown"}`);
    }
}

export function parseArgs(argv) {
    const options = {
        branch: "main",
        dryRun: false,
        yes: false,
        skipChecks: false,
        push: true,
        fetch: true,
        help: false,
        target: null,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === "--dry-run") options.dryRun = true;
        else if (argument === "--yes" || argument === "-y") options.yes = true;
        else if (argument === "--skip-checks") options.skipChecks = true;
        else if (argument === "--no-push") options.push = false;
        else if (argument === "--no-fetch") options.fetch = false;
        else if (argument === "--help" || argument === "-h") options.help = true;
        else if (argument === "--branch") {
            const branch = argv[index + 1];
            if (!branch || branch.startsWith("-")) {
                throw new Error("--branch 需要分支名称。");
            }
            options.branch = branch;
            index += 1;
        } else if (argument.startsWith("-")) {
            throw new Error(`未知选项：${argument}`);
        } else if (options.target) {
            throw new Error(`只能指定一个版本参数，收到：${argument}`);
        } else {
            options.target = argument;
        }
    }

    if (!options.help && !options.target) {
        throw new Error("缺少版本参数，请指定 patch、minor、major 或 x.y.z。");
    }
    return options;
}

export function parseVersion(value) {
    const match = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value);
    if (!match) {
        throw new Error(`版本格式无效：${value}，仅支持稳定版 x.y.z。`);
    }
    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
    };
}

export function formatVersion(version) {
    return `${version.major}.${version.minor}.${version.patch}`;
}

export function compareVersions(left, right) {
    return (
        left.major - right.major ||
        left.minor - right.minor ||
        left.patch - right.patch
    );
}

export function resolveTargetVersion(currentValue, target) {
    const current = parseVersion(currentValue);
    let next;
    if (BUMP_TYPES.has(target)) {
        if (target === "major") next = { major: current.major + 1, minor: 0, patch: 0 };
        else if (target === "minor") {
            next = { major: current.major, minor: current.minor + 1, patch: 0 };
        } else {
            next = { ...current, patch: current.patch + 1 };
        }
    } else {
        next = parseVersion(target);
    }

    if (compareVersions(next, current) <= 0) {
        throw new Error(
            `目标版本 ${formatVersion(next)} 必须高于当前版本 ${formatVersion(current)}。`,
        );
    }
    return formatVersion(next);
}

function cargoPackageRange(contents) {
    const header = /^\[package\][ \t]*$/m.exec(contents);
    if (!header) throw new Error("Cargo.toml 缺少 [package] section。");
    const start = header.index;
    const afterHeader = header.index + header[0].length;
    const nextHeader = /^\[/m.exec(contents.slice(afterHeader));
    const end = nextHeader ? afterHeader + nextHeader.index : contents.length;
    return { start, end };
}

export function readCargoVersion(contents) {
    const { start, end } = cargoPackageRange(contents);
    const version = contents
        .slice(start, end)
        .match(/^version[ \t]*=[ \t]*"([^"]+)"[ \t]*$/m)?.[1];
    if (!version) throw new Error("无法从 src-tauri/Cargo.toml 读取 [package] version。");
    return version;
}

export function updateCargoVersion(contents, nextVersion) {
    const { start, end } = cargoPackageRange(contents);
    const section = contents.slice(start, end);
    const updated = section.replace(
        /^version[ \t]*=[ \t]*"[^"]+"[ \t]*$/m,
        `version = "${nextVersion}"`,
    );
    if (updated === section) throw new Error("无法更新 Cargo.toml 的 [package] version。");
    return `${contents.slice(0, start)}${updated}${contents.slice(end)}`;
}

export function readCargoLockVersion(contents) {
    const version = /\[\[package\]\]\nname = "doroframe"\nversion = "([^"]+)"\n/.exec(
        contents,
    )?.[1];
    if (!version) throw new Error("Cargo.lock 中找不到 doroframe 包版本。");
    return version;
}

export function updateCargoLockVersion(contents, nextVersion) {
    const pattern = /(\[\[package\]\]\nname = "doroframe"\nversion = ")[^"]+("\n)/;
    if (!pattern.test(contents)) throw new Error("Cargo.lock 中找不到 doroframe 包版本。");
    return contents.replace(pattern, `$1${nextVersion}$2`);
}

function refExists(ref) {
    try {
        runCapture("git", ["show-ref", "--verify", "--quiet", ref]);
        return true;
    } catch {
        return false;
    }
}

function assertRepositoryState(options, tag) {
    const branch = runCapture("git", ["branch", "--show-current"]);
    if (branch !== options.branch) {
        throw new Error(`只能从 ${options.branch} 分支发布，当前分支为 ${branch || "detached HEAD"}。`);
    }

    const status = runCapture("git", ["status", "--porcelain"], {
        trim: false,
    }).trimEnd();
    if (status) {
        throw new Error(`工作区不干净，请先提交或暂存以下修改：\n${status}`);
    }
    if (refExists(`refs/tags/${tag}`)) throw new Error(`本地标签 ${tag} 已存在。`);
}

function inspectRemote(options, tag) {
    if (!options.push || options.dryRun) return;
    runCapture("git", ["remote", "get-url", "origin"]);

    if (options.fetch) {
        run("git", ["fetch", "origin", options.branch, "--tags", "--prune"]);
    }
    if (refExists(`refs/tags/${tag}`)) throw new Error(`远程或本地标签 ${tag} 已存在。`);

    const remoteBranch = `refs/remotes/origin/${options.branch}`;
    if (!refExists(remoteBranch)) {
        throw new Error(`找不到 origin/${options.branch}，请先同步远程分支。`);
    }
    const counts = runCapture("git", [
        "rev-list",
        "--left-right",
        "--count",
        `HEAD...origin/${options.branch}`,
    ]).split(/\s+/);
    const behind = Number(counts[1] ?? 0);
    if (behind > 0) {
        throw new Error(`当前分支落后 origin/${options.branch} ${behind} 个提交，请先拉取。`);
    }
}

function readVersionFiles(root) {
    const packagePath = resolve(root, PACKAGE_PATH);
    const cargoPath = resolve(root, CARGO_PATH);
    const cargoLockPath = resolve(root, CARGO_LOCK_PATH);
    const packageContents = readFileSync(packagePath, "utf8");
    const packageInfo = JSON.parse(packageContents);
    const cargoContents = readFileSync(cargoPath, "utf8");
    const cargoLockContents = readFileSync(cargoLockPath, "utf8");
    const cargoVersion = readCargoVersion(cargoContents);
    const cargoLockVersion = readCargoLockVersion(cargoLockContents);

    if (
        packageInfo.version !== cargoVersion ||
        packageInfo.version !== cargoLockVersion
    ) {
        throw new Error(
            `版本不一致：package.json=${packageInfo.version}，` +
                `Cargo.toml=${cargoVersion}，Cargo.lock=${cargoLockVersion}。`,
        );
    }
    parseVersion(packageInfo.version);
    return {
        packagePath,
        cargoPath,
        cargoLockPath,
        packageContents,
        packageInfo,
        cargoContents,
        cargoLockContents,
    };
}

function writeVersions(files, nextVersion) {
    writeFileSync(
        files.packagePath,
        `${JSON.stringify({ ...files.packageInfo, version: nextVersion }, null, 2)}\n`,
    );
    writeFileSync(files.cargoPath, updateCargoVersion(files.cargoContents, nextVersion));
    writeFileSync(
        files.cargoLockPath,
        updateCargoLockVersion(files.cargoLockContents, nextVersion),
    );
}

function restoreVersions(files) {
    writeFileSync(files.packagePath, files.packageContents);
    writeFileSync(files.cargoPath, files.cargoContents);
    writeFileSync(files.cargoLockPath, files.cargoLockContents);
}

function runChecks(options) {
    if (options.skipChecks) {
        process.stdout.write("\n已跳过测试和构建。\n");
        return;
    }
    run("pnpm", ["run", "test:release"]);
    run("pnpm", ["run", "test:changelog"]);
    run("pnpm", ["exec", "vitest", "run"]);
    run("pnpm", ["run", "build"]);
    run("cargo", ["check", "--manifest-path", CARGO_PATH]);
    run("git", ["diff", "--check"]);
}

function assertOnlyVersionFilesChanged() {
    const changed = runCapture("git", ["status", "--porcelain"], {
        trim: false,
    })
        .trimEnd()
        .split("\n")
        .filter(Boolean)
        .map((line) => line.slice(3));
    const unexpected = changed.filter((path) => !VERSION_FILES.includes(path));
    if (unexpected.length > 0) {
        throw new Error(`发布检查产生了意外文件修改：\n${unexpected.join("\n")}`);
    }
}

async function confirmRelease(currentVersion, nextVersion, options) {
    if (options.yes) return;
    if (!process.stdin.isTTY) {
        throw new Error("非交互环境请添加 --yes 明确确认发布。");
    }
    const prompt = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await prompt.question(
        `\n确认发布 DoroFrame ${currentVersion} -> ${nextVersion}？输入 release 继续：`,
    );
    prompt.close();
    if (answer.trim().toLowerCase() !== "release") {
        throw new Error("已取消发布。");
    }
}

export async function release(argv = process.argv.slice(2)) {
    const options = parseArgs(argv);
    if (options.help) {
        process.stdout.write(USAGE);
        return;
    }

    const root = runCapture("git", ["rev-parse", "--show-toplevel"]);
    process.chdir(root);
    const files = readVersionFiles(root);
    const currentVersion = files.packageInfo.version;
    const nextVersion = resolveTargetVersion(currentVersion, options.target);
    const tag = `v${nextVersion}`;

    assertRepositoryState(options, tag);
    inspectRemote(options, tag);

    process.stdout.write(
        [
            "\n发布计划",
            `  分支：${options.branch}`,
            `  版本：${currentVersion} -> ${nextVersion}`,
            `  标签：${tag}`,
            `  校验：${options.skipChecks ? "跳过" : "测试 + 前端构建 + Rust 检查"}`,
            `  推送：${options.push ? "origin（原子推送提交与标签）" : "不推送"}`,
            "",
        ].join("\n"),
    );

    if (options.dryRun) {
        process.stdout.write("Dry run 完成，未修改任何文件。\n");
        return;
    }

    await confirmRelease(currentVersion, nextVersion, options);
    writeVersions(files, nextVersion);
    try {
        runChecks(options);
        assertOnlyVersionFilesChanged();
    } catch (error) {
        restoreVersions(files);
        throw error;
    }

    run("git", ["add", ...VERSION_FILES]);
    run("git", ["commit", "-m", `chore(release): ${tag}`]);
    run("git", ["tag", "-a", tag, "-m", `DoroFrame ${tag}`]);

    if (options.push) {
        run("git", ["push", "--atomic", "origin", options.branch, tag]);
        process.stdout.write(`\n${tag} 已推送，GitHub Release CI 已触发。\n`);
    } else {
        process.stdout.write(
            `\n本地发布 ${tag} 已创建。确认后执行：git push --atomic origin ${options.branch} ${tag}\n`,
        );
    }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
    release().catch((error) => {
        process.stderr.write(`\n发布失败：${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
    });
}
