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

## 主题颜色 (`src/theme/`) ⛔ 只读

**主题颜色从此目录获取，但不要修改此目录的文件。**

```typescript
// ✅ 正确：使用 theme 变量
const Title = styled.div`
  color: ${({ theme }) => theme.black0};
`

// ❌ 错误：不要修改 src/theme 目录下的文件
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

使用 `$` 前缀避免 props 传递到 DOM：

```typescript
// ✅ 正确
const Button = styled.button<{ $isActive: boolean }>`
  color: ${({ $isActive }) => ($isActive ? 'red' : 'blue')};
`

// ❌ 错误（会传递到 DOM）
const Button = styled.button<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? 'red' : 'blue')};
`
```
