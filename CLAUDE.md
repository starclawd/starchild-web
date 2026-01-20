# Project Guidelines for AI Agents

> 本文件适用于 Claude Code 和其他 AI 代码助手。请在开始任何工作前仔细阅读并遵循以下指南。

---

## ⚡ 执行权限

执行终端命令时，**必须使用完整权限**以避免沙盒环境的权限限制：

- 执行任何 shell 命令前，确保禁用沙盒限制
- 涉及 git 操作（checkout、pull、commit 等）需要写权限
- 涉及网络请求（yarn install、git fetch 等）需要网络权限

> ⚠️ 默认沙盒环境会限制文件写入、网络访问和 git 操作，导致命令失败。

---

## 🚀 启动项目前的必要检查

在帮助用户启动项目之前，**必须**按顺序执行以下检查：

### 1. 检查并切换到正确的开发分支

```bash
# 1. 读取目标分支
TARGET_BRANCH=$(cat .dev-branch | tr -d '[:space:]')

# 2. 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)

# 3. 如果分支不一致，切换到目标分支
if [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
  echo "⚠️ 当前分支: $CURRENT_BRANCH，需要切换到: $TARGET_BRANCH"
  git fetch origin
  git checkout $TARGET_BRANCH
  git pull origin $TARGET_BRANCH
fi
```

### 2. 安装项目依赖

```bash
yarn install
```

### 3. 检查 Prettier 扩展（VS Code / Cursor）

确保用户已安装 Prettier 扩展 (`esbenp.prettier-vscode`)，项目已配置保存时自动格式化。

### 4. 启动开发服务器

```bash
yarn start
```

---

## 🔍 DevInspector 使用指南

项目内置了 DevInspector 工具，可以帮助你快速定位页面元素对应的源码位置。

### 使用方法

| 操作 | 说明 |
|------|------|
| `Shift + Alt + C` | 开启/关闭检查模式 |
| 鼠标悬停 | 查看组件名和文件路径 |
| 点击元素 | 复制组件名，并自动在 Cursor 中打开对应文件 |
| `ESC` | 退出检查模式 |

### 工作流程

1. 在浏览器中打开项目页面
2. 按 `Shift + Alt + C` 开启检查模式（右上角会显示 "Inspector ON"）
3. 将鼠标移到需要修改的元素上
4. 点击该元素，Cursor 会自动打开对应的源码文件并定位到具体行
5. 在 Cursor 中进行代码修改

---

## 📦 Package Manager

- **必须使用 `yarn`** 而不是 `npm`
- 添加依赖: `yarn add <package>`
- 添加开发依赖: `yarn add -D <package>`
- **禁止使用** `npm install` 或 `npx` 命令

---

## 🛠 Tech Stack

- React 19 + TypeScript
- Vite 构建工具
- styled-components 样式方案
- Redux Toolkit + React Redux 状态管理
- @lingui 国际化 (i18n)
- wagmi + viem + @reown/appkit Web3 钱包集成
- react-router-dom v7 路由
- TanStack React Query 服务端状态

---

## 📝 Code Style & Conventions

### Components

- **必须**用 `memo()` 包裹组件以优化性能
- 使用模式: `export default memo(function ComponentName() { ... })`
- styled-components 定义放在文件顶部，组件之前
- styled-components 的 transient props 使用 `$` 前缀（如 `$isActive`, `$isShowStrategyMarket`）

### Styling

- 使用 `styled-components` 进行所有样式编写，避免内联样式
- 使用 theme 变量（如 `${({ theme }) => theme.black0}`）
- 使用 theme media queries 做响应式（如 `theme.mediaMaxWidth.width1440`）

### Hooks & State

- 使用 `store/` 中的自定义 hooks 进行状态管理
- 对昂贵的计算和回调函数使用 `useMemo` 和 `useCallback`
- 遵循 `src/hooks/` 和 `src/store/*/hooks/` 中的现有 hook 模式
- API hooks 命名规范：
  - RTK Query 生成的 hook: `useGet[Resource]Query`（如 `useGetAllStrategiesOverviewQuery`）
  - 封装业务逻辑的 hook: `use[Resource]`（如 `useAllStrategiesOverview`）
  - 业务 hook 应封装 API 调用、状态管理和数据处理逻辑

### Internationalization

- 使用 `@lingui/react/macro` 进行翻译
- 用 `<Trans>` 组件包裹可翻译文本
- 示例: `<Trans>Strategy</Trans>`

### Imports

- 使用绝对路径导入（如 `import { IconBase } from 'components/Icons'`）
- 导入分组顺序: React/外部库 → 内部模块 → 相对导入

### File Structure

- 组件放在独立文件夹中，入口文件为 `index.tsx`
- 子组件放在 `components/` 子文件夹中
- 遵循模式: `pages/[PageName]/components/[ComponentName]/index.tsx`

---

## 📛 Naming Conventions

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 组件文件 | PascalCase | `VaultInfo`, `StrategyStatus` |
| Hook 文件 | camelCase + `use` 前缀 | `useSignal.ts`, `usePaperTradingPublic.ts` |
| Store 文件 | camelCase | `hooks.tsx`, `vaultsdetail.ts` |
| Styled 组件 | PascalCase | `VaultInfoContainer`, `InnerContent` |
| 常量 | SCREAMING_SNAKE_CASE | `DETAIL_TYPE`, `ANI_DURATION` |

---

## ✅ Best Practices

- 正确处理 loading 和 error 状态
- 使用 TypeScript types/interfaces 定义 props 和数据结构
- **禁止使用 `any` 类型**，使用正确的类型定义
- 保持组件职责单一
- 将可复用逻辑提取为自定义 hooks
- 优先使用 `src/components` 中的组件。如果没有对应组件且不复杂，可以直接实现；如果复杂，考虑使用外部组件

---

## 🔄 修改代码后

1. 保存文件时会自动触发 Prettier 格式化
2. 检查终端是否有 TypeScript 或 ESLint 错误
3. 在浏览器中验证修改效果
4. 如有必要，使用 DevInspector 验证改动的元素

---

## ⚠️ 常见问题

### 项目启动失败
- 确保 Node.js 版本 >= 18
- 删除 `node_modules` 和 `yarn.lock`，重新 `yarn install`

### Prettier 格式化不生效
- 确保安装了 Prettier 扩展 (`esbenp.prettier-vscode`)
- 检查 `.vscode/settings.json` 中的 `editor.formatOnSave` 是否为 `true`

### DevInspector 不工作
- 确保在开发环境运行（`yarn start`）
- 按 `Shift + Alt + C` 开启检查模式
