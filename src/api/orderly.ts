import { chatApi } from './baseChat'

const orderlyApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取agents推荐列表
    getStrategyPositions: builder.query<any, void>({
      query: () => {
        return {
          url: `/strategy_positions`,
          method: 'GET',
        }
      },
    }),
    getStrategyOpenOrders: builder.query<any, void>({
      query: () => {
        return {
          url: `/strategy_open_orders`,
          method: 'GET',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyGetStrategyPositionsQuery, useLazyGetStrategyOpenOrdersQuery } = orderlyApi

// 类型定义已从 hooks/usePagination 导入

export default orderlyApi
