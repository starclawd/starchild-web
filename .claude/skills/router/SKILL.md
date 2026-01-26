---
name: router
description: 路由配置规则。当需要添加新页面路由、配置导航、页面跳转、useNavigate、react-router、路由参数时使用此技能。
---

# 路由配置规则

项目使用 **react-router-dom** 进行路由管理。

## 路由定义位置

```
src/pages/router.ts    # 路由常量和页面懒加载
src/pages/App.tsx      # 路由配置
```

## 添加新路由步骤

### 1. 在 `router.ts` 中定义路由常量

```typescript
// src/pages/router.ts
export const ROUTER = {
  HOME: '/',
  // ... 其他路由
  NEW_PAGE: '/newpage', // 添加新路由常量
}
```

### 2. 添加懒加载组件

```typescript
// src/pages/router.ts
export const NewPage = lazy(() => import('./NewPage'))
```

### 3. 在 `App.tsx` 中配置路由

```typescript
// src/pages/App.tsx
import { NewPage, ROUTER } from './router'

<Route path={ROUTER.NEW_PAGE} element={<NewPage />} />
```

## 路由命名规范

| 类型     | 规范                 | 示例                       |
| -------- | -------------------- | -------------------------- |
| 路由常量 | SCREAMING_SNAKE_CASE | `MY_VAULT`, `AGENT_DETAIL` |
| 路径     | 小写，无下划线       | `/myvault`, `/agentdetail` |
| 组件     | PascalCase           | `MyVault`, `AgentDetail`   |

## 移动端路由

移动端页面有独立的路由配置：

```typescript
// src/pages/router.ts
export const MobileChat = lazy(() => import('./Mobile/MobileChat'))
export const MobileAgentDetail = lazy(() => import('./Mobile/MobileAgentDetail'))
```

移动端路由在 `src/pages/Mobile/index.tsx` 中配置。

## 路由跳转

```typescript
import { useNavigate } from 'react-router-dom'
import { ROUTER } from 'pages/router'

function MyComponent() {
  const navigate = useNavigate()

  // 跳转到指定页面
  navigate(ROUTER.AGENT_DETAIL)

  // 带参数跳转
  navigate(`${ROUTER.AGENT_DETAIL}?id=${agentId}`)

  // 返回上一页
  navigate(-1)
}
```

## 获取路由参数

```typescript
import { useSearchParams, useParams } from 'react-router-dom'

function MyComponent() {
  // URL 查询参数: /page?id=123
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  // 路径参数: /page/:id
  const { id } = useParams()
}
```

## ⚠️ 注意事项

1. **必须使用懒加载** (`lazy`) 导入页面组件
2. **使用 ROUTER 常量**，不要硬编码路径字符串
3. 移动端页面放在 `src/pages/Mobile/` 目录下
