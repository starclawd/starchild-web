---
name: styles
description: 全局样式规范。当需要使用主题颜色（theme）、编写公共样式（src/styles/）、了解 styled-components 规范时使用此技能。注意：修改某个组件内的样式请使用 components 技能。
---

# 样式规范

## 样式编写规则

- 使用 `styled-components` 进行所有样式编写，避免内联样式
- 使用 theme 变量获取颜色
- 使用 theme media queries 做响应式

```typescript
const Title = styled.div`
  color: ${({ theme }) => theme.black0};
  background: ${({ theme }) => theme.black900};

  ${({ theme }) => theme.mediaMaxWidth.width1440} {
    font-size: 14px;
  }
`
```

## 主题颜色 (`src/theme/`)

> ⛔ 只读目录，详见 [GLOBAL_RULES.md](../../GLOBAL_RULES.md)

```typescript
// 使用 theme 变量获取颜色
const Title = styled.div`
  color: ${({ theme }) => theme.black0};
`
```

## 公共样式 (`src/styles/`)

**可复用的公共样式定义：**

| 文件名               | 用途     |
| -------------------- | -------- |
| `globalStyled.ts`    | 全局样式 |
| `animationStyled.ts` | 动画样式 |
| `borderStyled.ts`    | 边框样式 |

```typescript
// 使用示例
import { fadeIn } from 'styles/animationStyled'

const Container = styled.div`
  ${fadeIn}
`
```

## styled-components transient props

> 💡 `$` 前缀规则详见 [GLOBAL_RULES.md](../../GLOBAL_RULES.md)
