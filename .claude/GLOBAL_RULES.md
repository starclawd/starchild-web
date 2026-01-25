# 全局规则

> 此文件被 `CLAUDE.md` 和 `.cursorrules` 共同引用，修改此文件会同时影响 Claude Code 和 Cursor。

## ⚠️ 必须先读取 Skills

**任何代码修改前，必须根据任务类型读取对应的 Skill 文件。**

| 用户意图                     | Skill 文件                              |
| ---------------------------- | --------------------------------------- |
| 启动项目、运行项目           | `.claude/skills/startup/SKILL.md`       |
| 执行命令、安装依赖           | `.claude/skills/permissions/SKILL.md`   |
| 新增 API、调用接口           | `.claude/skills/api/SKILL.md`           |
| 创建 store、状态管理、redux  | `.claude/skills/store/SKILL.md`         |
| 创建公共组件、修改公共组件   | `.claude/skills/components/SKILL.md`    |
| 全局样式、主题颜色、公共样式 | `.claude/skills/styles/SKILL.md`        |
| 文件放哪里、目录结构         | `.claude/skills/directories/SKILL.md`   |
| 代码风格、命名规范           | `.claude/skills/code-style/SKILL.md`    |
| Web3 合约调用                | `.claude/skills/web3-contract/SKILL.md` |
| HTTPS 本地开发               | `.claude/skills/https/SKILL.md`         |
| WebSocket 连接               | `.claude/skills/websocket/SKILL.md`     |
| 图标处理、iconfont           | `.claude/skills/iconfont/SKILL.md`      |
| 国际化、多语言、Trans        | `.claude/skills/i18n/SKILL.md`          |
| 路由配置、页面导航、页面跳转 | `.claude/skills/router/SKILL.md`        |
| 移动端适配、vm 单位          | `.claude/skills/mobile/SKILL.md`        |
| 创建页面                     | `.claude/skills/page/SKILL.md`          |
| 部署、发布、打 tag、上线     | `.claude/skills/deploy/SKILL.md`        |

---

## ⚠️ 修改任何组件前必须检查引用

**无论是公共组件还是页面组件，修改前都必须先检查被哪些父组件引用：**

```bash
# 搜索组件被引用的位置（搜索整个 src 目录）
grep -r "import.*ComponentName" src --include="*.tsx"
# 或搜索组件标签使用
grep -r "<ComponentName" src --include="*.tsx"
```

### 适用范围

| 组件类型       | 位置                               | 需要检查 |
| -------------- | ---------------------------------- | -------- |
| 公共组件       | `src/components/`                  | ✅ 必须  |
| 页面组件       | `src/pages/[Page]/components/`     | ✅ 必须  |
| 页面私有子组件 | `src/pages/[Page]/.../components/` | ✅ 必须  |

### 如果超过 1 个父组件引用

**必须告知用户并让用户选择：**

> ⚠️ 该组件被以下父组件引用：
>
> 1. `src/pages/PageA/components/Parent1/index.tsx` → 路由: `/pagea`
> 2. `src/pages/PageB/components/Parent2/index.tsx` → 路由: `/pageb`
> 3. `src/pages/PageC/index.tsx` → 路由: `/pagec`
>
> 请确认本次修改应用到：
>
> - [ ] 仅应用到某个父组件（请指定）
> - [ ] 应用到所有引用位置

### 处理方式

| 用户选择         | 处理方式                                              |
| ---------------- | ----------------------------------------------------- |
| 应用到特定父组件 | 在该父组件目录下创建新的子组件，或通过 props 控制差异 |
| 应用到所有位置   | 直接修改原组件                                        |

### 示例

```
用户请求：修改 CreateStrategy 页面下的 TabList 组件样式

1. 检查引用：
   grep -r "import.*TabList" src --include="*.tsx"

   结果：
   - src/pages/CreateStrategy/components/StrategyInfo/index.tsx
   - src/pages/CreateStrategy/components/Summary/index.tsx

2. 询问用户：
   "TabList 组件被 2 个父组件引用：
   1. StrategyInfo → /createstrategy
   2. Summary → /createstrategy

   本次修改要应用到哪个位置？还是都应用？"

3. 根据用户选择执行修改
```

---

## 代码规范

### 组件必须 memo 包裹

```typescript
// ✅ 正确
export default memo(function ComponentName() {
  return <div>...</div>
})

// ❌ 错误
export default function ComponentName() {
  return <div>...</div>
}
```

### styled-components transient props

使用 `$` 前缀避免 props 传递到 DOM：

```typescript
// ✅ 正确
const Button = styled.button<{ $isActive: boolean }>`
  color: ${({ $isActive }) => ($isActive ? 'red' : 'blue')};
`

// ❌ 错误（会传递到 DOM，产生警告）
const Button = styled.button<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? 'red' : 'blue')};
`
```

### 国际化：所有用户可见文本必须翻译

```typescript
import { Trans } from '@lingui/react/macro'

// ✅ 正确
<Trans>Strategy</Trans>

// ❌ 错误
<span>Strategy</span>
```

### 数据驱动 DOM

**禁止硬编码重复结构，必须用数组 + map 渲染：**

```typescript
// ❌ 错误：硬编码重复结构
<div>
  <Item title="收益率" value={rate} />
  <Item title="总资产" value={total} />
  <Item title="风险等级" value={risk} />
</div>

// ✅ 正确：数据驱动
const items = [
  { title: '收益率', value: rate },
  { title: '总资产', value: total },
  { title: '风险等级', value: risk },
]

<div>
  {items.map((item) => (
    <Item key={item.title} title={item.title} value={item.value} />
  ))}
</div>
```

### 只读目录

| 目录         | 状态    | 说明               |
| ------------ | ------- | ------------------ |
| `src/theme/` | ⛔ 只读 | 主题颜色，禁止修改 |

---

## 通用规则

- 📦 包管理器：`yarn`（禁止使用 npm）
- ⚡ 执行命令：确保禁用沙盒限制（Cursor 使用 `required_permissions: ["all"]`）
- 🔍 DevInspector：`Shift + Alt + C` 开启检查模式
- 📝 Prettier：必须安装 v11.0.0 版本

## 技术栈

- React 19 + TypeScript
- Vite 构建工具
- styled-components 样式方案
- Redux Toolkit + React Redux 状态管理
- @lingui 国际化 (i18n)
