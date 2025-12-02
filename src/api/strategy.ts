import { liveTradingApi } from './base'

// Strategy Position 相关接口
export interface StrategyPosition {
  symbol: string
  position_qty: number
  average_open_price: number
  mark_price: number
  unsettled_pnl: number
  imr: number
  mmr: number
  leverage: number
  cost_position: number
  est_liq_price: number
  pnl_24_h: number
  fee_24_h: number
  timestamp: number
}

export interface StrategyPositionsResponse {
  success: boolean
  timestamp: number
  data: {
    strategy_id: string
    positions: StrategyPosition[]
    count: number
    timestamp: number
  }
}

// Strategy API (使用 liveTradingApi)
export const strategyApi = liveTradingApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取策略持仓信息
    getStrategyPositions: builder.query<
      StrategyPosition[],
      {
        strategy_id: string
      }
    >({
      query: ({ strategy_id }) => ({
        url: `/positions?strategy_id=${strategy_id}`,
        method: 'GET',
      }),
      transformResponse: (response: StrategyPositionsResponse) => {
        return response.data.positions
      },
    }),
  }),
})

// 导出 strategy hooks
export const { useGetStrategyPositionsQuery, useLazyGetStrategyPositionsQuery } = strategyApi
