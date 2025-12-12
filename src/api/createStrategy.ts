import { ChatContentDataType } from 'store/createstrategy/createstrategy'
import { chatApi } from './baseChat'

// Strategy API (使用 chatApi)
export const strategyApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取策略持仓信息
    getStrategyChatContent: builder.query<
      any,
      {
        strategyId: string
      }
    >({
      query: ({ strategyId }) => ({
        url: `/strategy-generator/history?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
    getAllUserStrategies: builder.query<any, void>({
      query: () => ({
        url: `/vibe-trading/strategies`,
        method: 'GET',
      }),
    }),
    getStrategyDetail: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/vibe-trading/strategies?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
    editStrategy: builder.query<any, { name: string; address: string; description: string }>({
      query: ({ name, address, description }) => ({
        url: `/vibe-trading/strategies`,
        method: 'POST',
        body: {
          name,
          wallet_id: address,
          description,
        },
      }),
    }),
    generateStrategyCode: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/strategy-generator/generate-code`,
        method: 'POST',
        body: {
          strategy_id: strategyId,
        },
      }),
    }),
    getStrategyCode: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/strategy-generator/code?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
  }),
})

// 导出 strategy hooks
export const {
  useGetStrategyChatContentQuery,
  useLazyGetStrategyChatContentQuery,
  useGetAllUserStrategiesQuery,
  useLazyGetAllUserStrategiesQuery,
  useGetStrategyDetailQuery,
  useLazyGetStrategyDetailQuery,
  useGenerateStrategyCodeQuery,
  useLazyGenerateStrategyCodeQuery,
  useGetStrategyCodeQuery,
  useLazyGetStrategyCodeQuery,
} = strategyApi
