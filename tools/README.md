# 本地发布

本地 Release 脚本会同步更新 `package.json`、`src-tauri/Cargo.toml` 和
`src-tauri/Cargo.lock` 的版本，然后运行测试、前端构建和 Rust 检查。
检查通过后，它会创建 Release 提交与 `v*` 注释标签，并原子推送到 GitHub，
从而触发 Windows x64 和 macOS Universal 发布工作流。

## 常用命令

```bash
# 0.1.0 -> 0.1.1
pnpm release patch

# 0.1.0 -> 0.2.0
pnpm release minor

# 直接指定版本
pnpm release 1.0.0

# 只查看计划
pnpm release patch --dry-run
```

正式发布默认要求：

- 当前位于 `main` 分支。
- Git 工作区没有未提交或未跟踪文件。
- 目标版本高于当前版本，且同名标签不存在。
- 本地分支没有落后 `origin/main`。
- 测试、前端构建、Rust 检查全部通过。

脚本执行前会要求输入 `release` 确认。自动化场景可使用 `--yes`；只创建本地
提交和标签时使用 `--no-push`。
