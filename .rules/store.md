# Store 配置规范

API 的业务封装 hooks 必须放在 `src/store/` 目录下。

## 目录命名规则

| 目录名称       | 是否持久化 | 说明                            |
| -------------- | ---------- | ------------------------------- |
| `vaults/`      | ❌ 否      | 普通状态，刷新后丢失            |
| `vaultscache/` | ✅ 是      | 持久化到 localStorage，刷新保留 |

> 💡 带 `cache` 后缀的目录会持久化到 localStorage。

## 创建新 Store 目录

### 目录结构

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

### 注册到 `src/store/index.ts`

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

## 业务 Hooks 示例

```typescript
// src/store/vaults/hooks/useAllStrategiesOverview.ts
export function useAllStrategiesOverview() {
  const dispatch = useDispatch()
  const allStrategies = useSelector((state: RootState) => state.vaults.allStrategies)

  const { data, isLoading, error, refetch } = useGetAllStrategiesOverviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  // 处理数据、更新 store...

  return {
    allStrategies,
    isLoading,
    error,
    refetch,
  }
}
```
