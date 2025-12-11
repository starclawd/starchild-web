import { ChatContentDataType } from 'store/createstrategy/createstrategy'
import { liveTradingApi } from './baseLiveTrading'

// Strategy API (使用 liveTradingApi)
export const strategyApi = liveTradingApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取策略持仓信息
    getStrategyChatContent: builder.query<
      ChatContentDataType[],
      {
        strategyId: string
      }
    >({
      query: ({ strategyId }) => ({
        url: `/strategy/chatContent?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
  }),
})

// 导出 strategy hooks
export const { useGetStrategyChatContentQuery, useLazyGetStrategyChatContentQuery } = strategyApi
