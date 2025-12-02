import { liveTradingApi } from './base'
import { VaultPosition } from './vaults'
import { calculateVaultPosition } from '../store/vaultsdetail/dataTransforms'

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
  strategy_id: string
  positions: StrategyPosition[]
  count: number
  timestamp: number
}

// Strategy Performance 相关接口
export interface StrategyPerformance {
  strategy_id: string
  period: string
  pnl: number
  pnl_percentage: number
  apr: number
  max_drawdown: number
  sharpe_ratio: number
  start_balance: number
  end_balance: number
  data_points: number
}

// Strategy API (使用 liveTradingApi)
export const strategyApi = liveTradingApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取策略持仓信息
    getStrategyPositions: builder.query<
      VaultPosition[],
      {
        strategy_id: string
      }
    >({
      query: ({ strategy_id }) => ({
        url: `/strategy/${strategy_id}/positions`,
        method: 'GET',
      }),
      transformResponse: (response: StrategyPositionsResponse) => {
        return response.positions
          .filter((rawPosition: StrategyPosition) => rawPosition.position_qty !== 0)
          .map((rawPosition: StrategyPosition) => calculateVaultPosition(rawPosition))
          .sort((a, b) => b.value - a.value)
      },
    }),

    // 获取策略性能信息
    getStrategyPerformance: builder.query<
      StrategyPerformance,
      {
        strategy_id: string
        period: string
      }
    >({
      query: ({ strategy_id, period }) => ({
        url: `/strategy/${strategy_id}/overview`,
        method: 'GET',
        params: { period },
      }),
    }),
  }),
})

// 导出 strategy hooks
export const {
  useGetStrategyPositionsQuery,
  useLazyGetStrategyPositionsQuery,
  useGetStrategyPerformanceQuery,
  useLazyGetStrategyPerformanceQuery,
} = strategyApi
