# Project Rules

> 请在开始任何工作前仔细阅读并遵循以下指南。

---

## ⚡ 执行权限

执行终端命令时，**必须请求完整权限**以避免沙盒环境的权限限制：

- 使用 `required_permissions: ["all"]` 执行所有终端命令
- 涉及 git 操作时使用 `required_permissions: ["git_write", "network"]`
- 涉及网络请求（如 yarn install）时使用 `required_permissions: ["network"]`

> ⚠️ 不要使用默认的沙盒权限执行命令，否则可能会遇到权限错误。

### 📦 安装依赖必须使用完整权限

```
yarn install        → required_permissions: ["all"]
yarn add <pkg>      → required_permissions: ["all"]
yarn add -D <pkg>   → required_permissions: ["all"]
```

**原因：** 沙盒环境会限制 node_modules 的写入权限，导致安装失败。

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

### 3. 检查 Prettier 扩展

确保用户已安装 Prettier 扩展 (`esbenp.prettier-vscode`)，**必须安装 v11.0.0 版本**（新版本在 Cursor 存在兼容性问题）。项目已配置保存时自动格式化。

### 4. 启动开发服务器

```bash
yarn start
```

---

## 🔍 DevInspector 使用指南

项目内置了 DevInspector 工具，可以帮助你快速定位页面元素对应的源码位置。

### 使用方法

| 操作              | 说明                                       |
| ----------------- | ------------------------------------------ |
| `Shift + Alt + C` | 开启/关闭检查模式                          |
| 鼠标悬停          | 查看组件名和文件路径                       |
| 点击元素          | 复制组件名，并自动在 Cursor 中打开对应文件 |
| `ESC`             | 退出检查模式                               |

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

## 🔌 API 配置规范

新增 API 时，必须按照以下步骤配置：

### 1. 选择正确的 API 基础实例

| API 实例     | 用途                   | 文件位置                   |
| ------------ | ---------------------- | -------------------------- |
| `baseApi`    | 主业务 API（带拦截器） | `src/api/baseStarchild.ts` |
| `chatApi`    | Chat 相关 API          | `src/api/baseChat.ts`      |
| `orderlyApi` | Orderly 交易所 API     | `src/api/base.ts`          |

### 2. 定义 API 端点

在 `src/api/` 目录下创建或修改对应的 API 文件：

```typescript
// src/api/example.ts
import { baseApi } from './baseStarchild'

// 1. 定义接口类型
export interface ExampleResponse {
  id: string
  name: string
}

// 2. 注入端点
const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExample: builder.query<ExampleResponse, string>({
      query: (id) => `/example/${id}`,
    }),
  }),
})

// 3. 导出生成的 hook
export const { useGetExampleQuery } = exampleApi
```

### 3. 注册到 Store（仅新建 API 实例时需要）

如果创建了新的 `createApi` 实例，需要在 `src/store/index.ts` 中注册：

```typescript
// 1. 导入 API
import { newApi } from '../api/base'

// 2. 添加到 rootReducer
const rootReducer = combineReducers({
  // ...其他 reducer
  [newApi.reducerPath]: newApi.reducer,
})

// 3. 添加到 middleware
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(
    // ...其他 middleware
    newApi.middleware,
  ),

// 4. 添加到 RootState 类型
export interface RootState {
  // ...其他类型
  [newApi.reducerPath]: ReturnType<typeof newApi.reducer>
}
```

### 4. 创建业务 Hooks（在 store 目录中）

API 的业务封装 hooks 必须放在 `src/store/` 目录下：

**目录命名规则：**

| 目录名称       | 是否持久化 | 说明                            |
| -------------- | ---------- | ------------------------------- |
| `vaults/`      | ❌ 否      | 普通状态，刷新后丢失            |
| `vaultscache/` | ✅ 是      | 持久化到 localStorage，刷新保留 |

**创建新 store 目录的步骤：**

```
src/store/example/           # 不需要缓存
├── example.d.ts             # 类型定义
├── reducer.ts               # Redux reducer
└── hooks/
    └── useExample.ts        # 业务 hooks

src/store/examplecache/      # 需要本地缓存
├── examplecache.d.ts
├── reducer.ts
└── hooks.ts
```

**注册到 `src/store/index.ts`：**

```typescript
// 1. 导入 reducer
import exampleReducer from './example/reducer'
import examplecacheReducer from './examplecache/reducer'

// 2. 添加到 rootReducer
const rootReducer = combineReducers({
  // ...
  example: exampleReducer,
  examplecache: examplecacheReducer,
})

// 3. 如果需要持久化，添加到 persistConfig.whitelist
const persistConfig = {
  whitelist: [
    // ...
    'examplecache', // 带 cache 的才加到这里
  ],
}

// 4. 添加到 RootState 类型
export interface RootState {
  // ...
  example: ReturnType<typeof exampleReducer>
  examplecache: ReturnType<typeof examplecacheReducer>
}
```

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

| 类型        | 命名规范               | 示例                                       |
| ----------- | ---------------------- | ------------------------------------------ |
| 组件文件    | PascalCase             | `VaultInfo`, `StrategyStatus`              |
| Hook 文件   | camelCase + `use` 前缀 | `useSignal.ts`, `usePaperTradingPublic.ts` |
| Store 文件  | camelCase              | `hooks.tsx`, `vaultsdetail.ts`             |
| Styled 组件 | PascalCase             | `VaultInfoContainer`, `InnerContent`       |
| 常量        | SCREAMING_SNAKE_CASE   | `DETAIL_TYPE`, `ANI_DURATION`              |

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

- 确保安装了 Prettier 扩展 (`esbenp.prettier-vscode`)，**版本必须是 v11.0.0**
- 新版本在 Cursor 有兼容性问题，请勿升级
- 检查 `.vscode/settings.json` 中的 `editor.formatOnSave` 是否为 `true`

### DevInspector 不工作

- 确保在开发环境运行（`yarn start`）
- 按 `Shift + Alt + C` 开启检查模式
