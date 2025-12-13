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
        url: `/vibe-trading/chat_content?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
    getMyStrategies: builder.query<any, void>({
      query: () => ({
        url: `/vibe-trading/strategies`,
        method: 'GET',
      }),
    }),
    getStrategyDetail: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/vibe-trading/strategy?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
    editStrategy: builder.query<any, { name: string; strategyId: string; description: string }>({
      query: ({ name, strategyId, description }) => ({
        url: `/vibe-trading/edit_strategy`,
        method: 'PUT',
        body: {
          strategy_id: strategyId,
          name,
          description,
        },
      }),
    }),
    generateStrategyCode: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/vibe-trading/strategy-generator/generate-code`,
        method: 'POST',
        body: {
          strategy_id: strategyId,
        },
      }),
    }),
    getStrategyCode: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/vibe-trading/signal?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
  }),
})

// 导出 strategy hooks
export const {
  useGetStrategyChatContentQuery,
  useLazyGetStrategyChatContentQuery,
  useGetMyStrategiesQuery,
  useLazyGetMyStrategiesQuery,
  useGetStrategyDetailQuery,
  useLazyGetStrategyDetailQuery,
  useGenerateStrategyCodeQuery,
  useLazyGenerateStrategyCodeQuery,
  useGetStrategyCodeQuery,
  useLazyGetStrategyCodeQuery,
  useEditStrategyQuery,
  useLazyEditStrategyQuery,
} = strategyApi
