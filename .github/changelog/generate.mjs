#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");

const CATEGORY_RULES = [
    { title: "破坏性变更", types: ["break"] },
    { title: "新功能", types: ["feat", "feature"] },
    { title: "问题修复", types: ["fix", "bugfix"] },
    { title: "性能优化", types: ["perf"] },
    { title: "代码重构", types: ["refactor"] },
    { title: "界面与样式", types: ["style", "ui", "ux"] },
    { title: "移除内容", types: ["remove", "removes"] },
    { title: "文档", types: ["docs", "doc"] },
    { title: "测试", types: ["test", "tests"] },
    {
        title: "工程与依赖",
        types: ["build", "ci", "chore", "deps", "dependency"],
    },
    { title: "其他变更", types: ["other"] },
];

const CHANGELOG_MARKER = "<!-- changelog:entries -->";

function runGit(args, options = {}) {
    return execFileSync("git", args, {
        cwd: repositoryRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        ...options,
    }).trim();
}

function parseArgs(argv) {
    const args = {};
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (!argument.startsWith("--")) {
            throw new Error(`未知参数：${argument}`);
        }
        const key = argument.slice(2);
        const value = argv[index + 1];
        if (!value || value.startsWith("--")) {
            args[key] = true;
            continue;
        }
        args[key] = value;
        index += 1;
    }
    return args;
}

function normalizeRepository(repository) {
    if (!repository) return null;
    return repository
        .replace(/^git@github\.com:/, "")
        .replace(/^https:\/\/github\.com\//, "")
        .replace(/\.git$/, "")
        .replace(/^\/+|\/+$/g, "");
}

function resolveRepository(explicitRepository) {
    const fromArgument = normalizeRepository(explicitRepository);
    if (fromArgument) return fromArgument;

    const fromEnvironment = normalizeRepository(process.env.GITHUB_REPOSITORY);
    if (fromEnvironment) return fromEnvironment;

    return normalizeRepository(runGit(["remote", "get-url", "origin"]));
}

function refExists(ref) {
    try {
        runGit(["rev-parse", "--verify", "--quiet", ref]);
        return true;
    } catch {
        return false;
    }
}

function findPreviousTag(ref) {
    try {
        return runGit(["describe", "--tags", "--abbrev=0", `${ref}^`]);
    } catch {
        return null;
    }
}

export function parseCommitRecords(rawLog) {
    return rawLog
        .split("\x1e")
        .map((record) => record.trim())
        .filter(Boolean)
        .map((record) => {
            const [hash, shortHash, author, ...subjectParts] = record.split("\x1f");
            return {
                hash,
                shortHash,
                author,
                subject: subjectParts.join("\x1f"),
            };
        });
}

function readCommits(ref, previousTag) {
    const range = previousTag ? `${previousTag}..${ref}` : ref;
    const rawLog = runGit([
        "log",
        range,
        "--no-merges",
        "--pretty=format:%H%x1f%h%x1f%an%x1f%s%x1e",
    ]);
    return parseCommitRecords(rawLog).filter(
        (commit) => !/^docs\(changelog\): release v/i.test(commit.subject),
    );
}

export function classifyCommit(subject) {
    const conventional = /^([a-zA-Z]+)(?:\(([^)]+)\))?(!)?:\s+(.+)$/.exec(
        subject,
    );
    if (!conventional) {
        return {
            category: "其他变更",
            scope: null,
            description: subject,
        };
    }

    const [, rawType, scope, breaking, description] = conventional;
    if (breaking) {
        return { category: "破坏性变更", scope: scope || null, description };
    }

    const type = rawType.toLowerCase();
    const rule = CATEGORY_RULES.find((candidate) =>
        candidate.types.includes(type),
    );
    return {
        category: rule?.title ?? "其他变更",
        scope: scope || null,
        description,
    };
}

export function renderChanges(commits, repository) {
    if (commits.length === 0) return "### 其他变更\n\n- 本版本没有可列出的提交。";

    const groups = new Map(CATEGORY_RULES.map((rule) => [rule.title, []]));
    for (const commit of commits) {
        const parsed = classifyCommit(commit.subject);
        groups.get(parsed.category).push({ ...commit, ...parsed });
    }

    return CATEGORY_RULES.flatMap((rule) => {
        const items = groups.get(rule.title);
        if (!items.length) return [];
        const lines = items.map((item) => {
            const scope = item.scope ? `**${item.scope}：**` : "";
            const commitUrl = `https://github.com/${repository}/commit/${item.hash}`;
            return `- ${scope}${item.description} ([${item.shortHash}](${commitUrl}))`;
        });
        return [`### ${rule.title}`, "", ...lines, ""];
    })
        .join("\n")
        .trim();
}

export function renderContributors(commits) {
    const contributors = [...new Set(commits.map((commit) => commit.author))]
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right, "zh-CN"));
    if (contributors.length === 0) return "### 贡献者\n\n- 暂无贡献者信息。";
    return `### 贡献者\n\n${contributors.map((name) => `- ${name}`).join("\n")}`;
}

export function renderTemplate(template, values) {
    return template.replace(/\{\{([A-Z_]+)}}/g, (placeholder, key) => {
        if (!(key in values)) throw new Error(`模板变量未提供：${placeholder}`);
        return values[key];
    });
}

export function upsertEntry(changelog, tag, entry) {
    const startMarker = `<!-- changelog:${tag}:start -->`;
    const endMarker = `<!-- changelog:${tag}:end -->`;
    const versionBlock = `${startMarker}\n${entry.trim()}\n${endMarker}`;
    const startIndex = changelog.indexOf(startMarker);
    const endIndex = changelog.indexOf(endMarker);

    if (startIndex >= 0 && endIndex >= startIndex) {
        const afterEnd = endIndex + endMarker.length;
        return `${changelog.slice(0, startIndex)}${versionBlock}${changelog.slice(afterEnd)}`;
    }
    if (!changelog.includes(CHANGELOG_MARKER)) {
        throw new Error(`CHANGELOG.md 缺少插入标记：${CHANGELOG_MARKER}`);
    }
    return changelog.replace(
        CHANGELOG_MARKER,
        `${CHANGELOG_MARKER}\n\n${versionBlock}`,
    );
}

function readPackageVersion() {
    const packageInfo = JSON.parse(
        readFileSync(resolve(repositoryRoot, "package.json"), "utf8"),
    );
    return packageInfo.version;
}

export function generateChangelog(options) {
    const version = options.version ?? readPackageVersion();
    const tag = options.tag ?? `v${version}`;
    const repository = resolveRepository(options.repository);
    if (!repository) throw new Error("无法确定 GitHub 仓库名称。");

    const ref = refExists(`refs/tags/${tag}`) ? tag : "HEAD";
    const previousTag = options.previousTag ?? findPreviousTag(ref);
    const commits = readCommits(ref, previousTag);
    const date = options.date ?? new Date().toISOString().slice(0, 10);
    const releaseUrl = `https://github.com/${repository}/releases/tag/${tag}`;
    const compareUrl = previousTag
        ? `https://github.com/${repository}/compare/${previousTag}...${tag}`
        : `https://github.com/${repository}/commits/${tag}`;
    const templatePath = resolve(
        repositoryRoot,
        options.template ?? ".github/CHANGELOG_TEMPLATE.md",
    );
    const outputPath = resolve(
        repositoryRoot,
        options.output ?? "CHANGELOG.md",
    );
    const template = readFileSync(templatePath, "utf8");
    const entry = renderTemplate(template, {
        VERSION: version,
        TAG: tag,
        DATE: date,
        RELEASE_URL: releaseUrl,
        COMPARE_URL: compareUrl,
        CHANGES: renderChanges(commits, repository),
        CONTRIBUTORS: renderContributors(commits),
    }).trim();
    const changelog = readFileSync(outputPath, "utf8");
    const nextChangelog = `${upsertEntry(changelog, tag, entry).trimEnd()}\n`;

    if (!options.dryRun) writeFileSync(outputPath, nextChangelog);
    if (options.entryOutput) {
        writeFileSync(resolve(repositoryRoot, options.entryOutput), `${entry}\n`);
    }
    return { entry, changelog: nextChangelog, commits, previousTag, tag, version };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const result = generateChangelog({
        version: args.version,
        tag: args.tag,
        repository: args.repository,
        previousTag: args["previous-tag"],
        template: args.template,
        output: args.output,
        entryOutput: args["entry-output"],
        date: args.date,
        dryRun: args["dry-run"] === true,
    });
    process.stdout.write(
        `Generated ${result.tag} changelog from ${result.commits.length} commits` +
            `${result.previousTag ? ` after ${result.previousTag}` : ""}.\n`,
    );
    if (args["dry-run"]) process.stdout.write(`\n${result.entry}\n`);
}

const invokedPath = process.argv[1]
    ? pathToFileURL(resolve(process.argv[1])).href
    : null;
if (invokedPath === import.meta.url) {
    main().catch((error) => {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
    });
}
