# API 配置规范

新增 API 时，必须按照以下步骤配置。

## 1. 选择正确的 API 基础实例

| API 实例     | 用途                   | 文件位置                   |
| ------------ | ---------------------- | -------------------------- |
| `baseApi`    | 主业务 API（带拦截器） | `src/api/baseStarchild.ts` |
| `chatApi`    | Chat 相关 API          | `src/api/baseChat.ts`      |
| `orderlyApi` | Orderly 交易所 API     | `src/api/base.ts`          |

## 2. 定义 API 端点

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

## 3. 注册到 Store（仅新建 API 实例时需要）

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

## API Hooks 命名规范

| Hook 类型          | 命名格式                  | 示例                              |
| ------------------ | ------------------------- | --------------------------------- |
| RTK Query 生成     | `useGet[Resource]Query`   | `useGetAllStrategiesOverviewQuery` |
| 封装业务逻辑       | `use[Resource]`           | `useAllStrategiesOverview`        |

业务 hook 应封装 API 调用、状态管理和数据处理逻辑。
