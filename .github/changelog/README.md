# Changelog 生成说明

发布工作流会在 Windows 和 macOS 构建全部成功后运行
[`generate.mjs`](generate.mjs)，根据当前标签与上一个标签之间的 Git 提交生成版本记录。

## 模板变量

模板位于 [`.github/CHANGELOG_TEMPLATE.md`](../CHANGELOG_TEMPLATE.md)，支持以下变量：

| 变量 | 内容 |
| --- | --- |
| `{{VERSION}}` | 不带 `v` 的版本号，例如 `1.2.0` |
| `{{TAG}}` | Git 标签，例如 `v1.2.0` |
| `{{DATE}}` | UTC 发布日期 |
| `{{RELEASE_URL}}` | GitHub Release 地址 |
| `{{COMPARE_URL}}` | 当前标签与上一个标签的比较地址 |
| `{{CHANGES}}` | 按 Conventional Commits 分类的提交列表 |
| `{{CONTRIBUTORS}}` | 标签区间内的 Git 提交作者 |

## 提交分类

- `feat`：新功能
- `fix`：问题修复
- `perf`：性能优化
- `refactor`：代码重构
- `style`、`ui`、`ux`：界面与样式
- `remove`、`removes`：移除内容
- `docs`：文档
- `test`：测试
- `build`、`ci`、`chore`、`deps`：工程与依赖
- 带 `!` 的 Conventional Commit：破坏性变更
- 其他格式：其他变更

## 本地预览

```bash
pnpm changelog:generate --dry-run --tag v1.2.0 --version 1.2.0
```

正式发布时不需要手动执行。发布工作流会更新 `CHANGELOG.md`、提交到默认分支，
并把同一份版本内容写入 GitHub Release 描述。
