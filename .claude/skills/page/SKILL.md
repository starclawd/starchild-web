---
name: page
description: 页面创建规则。当需要创建新页面、组织页面组件结构时使用此技能。
---

# 页面创建规则

## 页面目录结构

```
src/pages/[PageName]/
├── index.tsx                    # 页面入口
├── styles.ts                    # 页面样式（可选）
└── components/                  # 页面私有组件
    ├── ComponentA/
    │   └── index.tsx
    └── ComponentB/
        ├── index.tsx
        ├── types.ts             # 组件类型
        └── components/          # 子组件
            └── SubComponent/
                └── index.tsx
```

## 创建新页面步骤

### 1. 创建页面目录和入口文件

```typescript
// src/pages/NewPage/index.tsx
import { memo } from 'react'
import styled from 'styled-components'

const NewPageWrapper = styled.div`
  // 页面容器样式
`

export default memo(function NewPage() {
  return (
    <NewPageWrapper>
      {/* 页面内容 */}
    </NewPageWrapper>
  )
})
```

### 2. 配置路由

参考 `.claude/skills/router/SKILL.md`

### 3. 创建页面组件

页面私有组件放在 `components/` 子目录：

```
src/pages/NewPage/
├── index.tsx
└── components/
    ├── Header/
    │   └── index.tsx
    └── Content/
        └── index.tsx
```

## 页面组件规范

### 入口文件命名

- 页面入口：`index.tsx`
- 导出方式：`export default`

### 组件结构

```typescript
// src/pages/NewPage/components/Header/index.tsx
import { memo } from 'react'
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  // 样式
`

interface HeaderProps {
  title: string
}

export default memo(function Header({ title }: HeaderProps) {
  return <HeaderWrapper>{title}</HeaderWrapper>
})
```

### 导入页面组件

```typescript
// 在页面中导入私有组件
import Header from './components/Header'
import Content from './components/Content'
```

## 页面 vs 公共组件

| 位置                           | 用途         | 示例                       |
| ------------------------------ | ------------ | -------------------------- |
| `src/pages/[Page]/components/` | 页面私有组件 | 页面特有的 Header、Content |
| `src/components/`              | 全局公共组件 | Button、Modal、Toast       |

## 移动端页面

移动端页面放在 `src/pages/Mobile/` 目录：

```
src/pages/Mobile/
├── MobileNewPage/
│   ├── index.tsx
│   └── components/
└── index.tsx          # 移动端路由配置
```

## ⚠️ 注意事项

1. 页面私有组件放在 `components/` 子目录
2. 复用性高的组件提取到 `src/components/`
3. 页面样式使用 styled-components
4. 移动端页面以 `Mobile` 前缀命名

> 💡 `memo` 包裹等通用规则见 [GLOBAL_RULES.md](../../GLOBAL_RULES.md)
