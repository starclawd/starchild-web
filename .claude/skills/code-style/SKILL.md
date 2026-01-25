---
name: code-style
description: 代码风格与命名规范。当需要了解代码风格、命名规范、最佳实践时使用此技能。
---

# 代码风格与命名规范

## 命名规范

| 类型        | 命名规范               | 示例                                       |
| ----------- | ---------------------- | ------------------------------------------ |
| 组件文件    | PascalCase             | `VaultInfo`, `StrategyStatus`              |
| Hook 文件   | camelCase + `use` 前缀 | `useSignal.ts`, `usePaperTradingPublic.ts` |
| Store 文件  | camelCase              | `hooks.tsx`, `vaultsdetail.ts`             |
| Styled 组件 | PascalCase             | `VaultInfoContainer`, `InnerContent`       |
| 常量        | SCREAMING_SNAKE_CASE   | `DETAIL_TYPE`, `ANI_DURATION`              |

---

## 文件结构

- 组件放在独立文件夹中，入口文件为 `index.tsx`
- 子组件放在 `components/` 子文件夹中
- 遵循模式: `pages/[PageName]/components/[ComponentName]/index.tsx`

---

## 导入规范

- 使用绝对路径导入（如 `import { IconBase } from 'components/Icons'`）
- 导入分组顺序: React/外部库 → 内部模块 → 相对导入

```typescript
// 1. React 和外部库
import { memo, useState } from 'react'
import styled from 'styled-components'

// 2. 内部模块（绝对路径）
import { useVaults } from 'store/vaults/hooks'
import { formatNumber } from 'utils/format'

// 3. 相对导入
import { SubComponent } from './components/SubComponent'
```

---

## 国际化

> 💡 基本用法见 [GLOBAL_RULES.md](../../GLOBAL_RULES.md)，详细用法见 [i18n/SKILL.md](../i18n/SKILL.md)

---

## Hooks 使用规范

- 使用 `store/` 中的自定义 hooks 进行状态管理
- 对昂贵的计算使用 `useMemo`
- 对回调函数使用 `useCallback`
- 遵循 `src/hooks/` 和 `src/store/*/hooks/` 中的现有 hook 模式

---

## Best Practices

- 正确处理 loading 和 error 状态
- 使用 TypeScript types/interfaces 定义 props 和数据结构
- 保持组件职责单一
- 将可复用逻辑提取为自定义 hooks
- **优先使用 `src/components` 中的公共组件**
- **常量统一放在 `src/constants/`**
- **工具方法放在 `src/utils/`**
- **DOM 必须使用数据驱动**

---

## 数据驱动 DOM

> 💡 详见 [GLOBAL_RULES.md](../../GLOBAL_RULES.md)

---

## 修改代码后

1. 保存文件时会自动触发 Prettier 格式化
2. 检查终端是否有 TypeScript 或 ESLint 错误
3. 在浏览器中验证修改效果
4. 如有必要，使用 DevInspector 验证改动的元素
