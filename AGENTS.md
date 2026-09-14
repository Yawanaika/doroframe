# DoroFrame 开发指南

DoroFrame 是一个基于 Tauri 2、React 19、TypeScript、Vite 和 Rust 的 Warframe 桌面伴侣，提供世界状态、Warframe Market、竞拍实时更新以及玩家账户档案功能。

## 开发命令

项目使用 pnpm。提交代码前按改动范围运行以下检查：

```bash
pnpm install --frozen-lockfile
pnpm exec vitest run              # 单次运行全部前端测试
pnpm build                        # TypeScript 检查 + Vite 构建
cargo check --manifest-path src-tauri/Cargo.toml
cargo fmt --manifest-path src-tauri/Cargo.toml --check
```

常用开发命令：

```bash
pnpm start       # Vite + Tauri 桌面开发环境
pnpm dev         # 只启动 Vite 前端
pnpm test        # Vitest 监听模式
pnpm tauri build # 构建当前平台安装包
```

`pnpm start` 和 `src-tauri/tauri.conf.json` 已约定 Vite 使用 `1420` 端口，不要为了绕过端口冲突启动另一个前端服务。纯浏览器模式可以调试布局和组件，但依赖 Tauri Command 的功能不能完整工作。

## 项目结构与边界

- `src/routes/`：页面级组件；新增页面后在 `src/app/router.tsx` 注册路由，并按需更新面包屑和侧边栏。
- `src/features/world/`：世界状态查询、选择器和展示组件。
- `src/features/market/`：市场订单、拍卖、杜卡德工具、竞价 WebSocket 以及相关组件。
- `src/features/account/`：玩家账户档案和精通数据展示。
- `src/api/`：前端与 Tauri 的调用边界。这里调用 `invoke`，检查返回值，并转换成业务模型；页面组件不要直接调用外部 API 或拼接原始响应字段。
- `src/types/wf-state/`、`src/types/wf-market/`：领域模型和 `*FromJson` 解析器。外部 JSON 结构变化时，优先在这里做容错和归一化。
- `src/store/`：Zustand 状态。设置、认证、更新和账户状态需要通过现有 store 入口导出。
- `src/lib/`：查询客户端、国际化、Tauri Store 适配、WPEP 数据和通用工具。
- `src/components/`：跨功能通用组件；`src/components/ui/` 保存基础 UI 组件。
- `src/tests/`：Vitest、Testing Library 和 jsdom 测试，目录结构尽量对应被测代码。
- `src-tauri/src/commands/`：Rust 端 HTTP、认证、世界状态、档案和 WebSocket Command。
- `src-tauri/src/lib.rs`：Tauri 插件、托管状态和 `generate_handler!` Command 注册入口。
- `public/lang/{zh,en}/`：中英文界面文案和 Warframe 数据字典。
- `docs/`：外部 API 和产品方案文档；`tools/`：发布相关脚本。

模块应保持单一职责：查询和变更逻辑放在 feature/query 或 API 层，展示逻辑放在组件，跨页面状态放在 store。新增 Tauri Command 时，需要同时更新 Rust 模块声明、状态管理（如有）、`generate_handler!` 注册、前端 API 包装和相应测试。

## API 与数据处理

市场相关工作开始前先阅读：

- `docs/wfm-api-v2.md`：端点、请求方法、Header、鉴权、限流和错误信封。
- `docs/wfm-data-models.md`：Item、Order、Auction、User、Transaction 等返回和提交模型。

这两份文档是 Notion 公开页快照。后端文档更新后，用 `python scripts/notion-to-md.py ...` 按 `scripts/README.md` 的说明重新生成，不要凭记忆拼接接口。

核心数据流是：外部服务 → Rust Command → 前端 `src/api` → 类型解析器 → TanStack Query/Zustand → React 页面。Rust 端负责跨域请求、平台/语言/crossplay Header、错误处理和 WebSocket；前端只依赖归一化后的业务模型。

- TanStack Query 用于服务端数据、轮询、staleTime 和 mutation 后的缓存失效。
- Zustand 用于认证、设置、更新和竞价等客户端状态。涉及登录或登出时，要同步处理 WebSocket 连接、订阅和竞价内存状态。
- 世界状态和 browse 数据使用独立 query key；市场查询的 key 通常应包含语言和资源标识，避免不同语言或物品之间串缓存。
- 账户 Phase 1 使用 `EE.log -> accountId -> 本地绑定 -> DE 公共 CDN 档案`。只提取必要字段，不持久化 EE.log 原文；档案缓存和失败冷却按账户保存到 `profile_cache.json`。

## TypeScript、React 与样式

- `tsconfig.json` 开启 `strict`、`noUnusedLocals`、`noUnusedParameters` 和 `noFallthroughCasesInSwitch`；不要用未说明的 `any` 绕过类型错误。
- 优先使用 `@/` 导入 `src` 下的模块；保持现有文件的命名方式和导出风格。
- 组件使用 React 函数组件和现有 UI 基础组件。不要在页面中重复实现已经存在的 `src/components/ui/` 组件。
- 主题通过 `src/store/settings.ts` 和 `src/themes/` 组合；不要在组件中硬编码会破坏主题的全局颜色。
- 界面文案使用 i18next。新增用户可见文案时，同时更新 `public/lang/zh/common.json` 和 `public/lang/en/common.json`，并检查对应的 key 命名空间。
- 路由使用 TanStack Router 的 hash history。需要可复制的页面状态时，通过路由 search 参数实现深链接，而不是只放在组件内存中。

## Rust 与 Tauri

- Rust 代码遵循 rustfmt；Command 返回值保持可序列化、错误信息可读，并使用现有的 reqwest/Tokio 配置。
- 修改 `src-tauri/Cargo.toml` 后同步检查 `Cargo.lock`。
- 不要把秘密、令牌或 EE.log 原文写入日志、提交或测试 fixture。OAuth 长期凭证应沿用现有 Stronghold 设计；普通设置和非秘密缓存沿用 Tauri Store。
- 跨平台代码使用明确的 `cfg` 分支。涉及路径、进程检测或系统命令时，至少考虑 Windows、macOS 和 Linux。
- 外部服务可能限流或返回不完整字段。解析器应使用可选字段、默认值和明确错误，避免单个缺失字段导致整个页面崩溃。

## 测试要求

新增或修改以下内容时补测试：

- 外部 JSON 解析、字段兼容和边界值：放在对应 `src/tests/types/` 或 `src/tests/lib/`。
- Zustand 状态、查询选择器、缓存失效和竞价逻辑：放在对应 feature 或 `src/tests/store/`。
- 用户可见交互和状态切换：使用 Testing Library，放在对应 `src/tests/features/`。
- Rust 纯函数（日志解析、缓存有效期、字段转换）优先在 Rust 模块的 `#[cfg(test)]` 中覆盖；网络请求不要依赖真实外部服务。

修复数据解析或状态逻辑时，测试成功、空值、异常响应和重复调用等行为，不要只测试组件能渲染。

## 变更检查清单

新增世界状态字段或卡片时，通常同步检查：

1. `src/types/wf-state/` 模型和 JSON 解析。
2. `src/features/world/queries.ts` 查询选择器。
3. `src/features/world/components/` 展示组件。
4. `src/routes/` 页面入口。
5. `public/lang/zh/` 与 `public/lang/en/` 文案或字典。
6. `src/tests/` 对应解析和交互测试。

提交前保持改动聚焦，确认 `git diff` 不包含构建产物、密钥、令牌或无关格式化，并根据改动范围完成前端、Rust 和测试检查。
