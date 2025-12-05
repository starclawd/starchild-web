import { liveTradingApi } from './base'
import { VaultPosition, VaultOpenOrder } from './vaults'
import { calculateVaultPosition, processVaultOpenOrder } from '../store/vaultsdetail/dataTransforms'

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
  vault_id: string
  period: string
  pnl: number
  pnl_percentage: number
  apr: number
  max_drawdown: number
  sharpe_ratio: number
  start_balance: number
  end_balance: number
  data_points: number
  all_time_apr: number
  age_days: number
}

// Strategy Open Orders 相关接口
export interface StrategyOpenOrdersResponse {
  strategy_id: string
  orders: VaultOpenOrder[]
  count: number
  total: number
  page: number
  page_size: number
  timestamp: number
}

// Strategy Balance History 相关接口
export interface StrategyBalanceHistoryItem {
  timestamp: number
  available_balance: number
  holding: number
  unsettled_pnl: number
}

export interface StrategyBalanceHistoryResponse {
  strategy_id: string
  data: StrategyBalanceHistoryItem[]
  count: number
}

// Balance History Leaderboard 相关接口
export interface BalanceHistoryLeaderboardStrategy {
  strategy_id: string
  vault_id: string
  latest_available_balance: number
  latest_holding: number
  latest_unsettled_pnl: number
  latest_timestamp: number
  data_points: number
  data: StrategyBalanceHistoryItem[]
  strategy_name: string
  strategy_type: string
  userInfo: {
    userName: string
    userAvatar: string
  }
}

export interface BalanceHistoryLeaderboardResponse {
  limit: number
  sort_by: string
  strategies: BalanceHistoryLeaderboardStrategy[]
}

// All Strategies Overview 相关接口
export interface StrategiesOverviewStrategy {
  strategy_id: string
  vault_id: string
  period: string
  pnl: number
  pnl_percentage: number
  apr: number
  all_time_apr: number
  max_drawdown: number
  sharpe_ratio: number
  start_balance: number
  end_balance: number
  data_points: number
  age_days: number
  strategy_name: string
  strategy_type: string
  userInfo: any
}

export interface StrategiesOverviewResponse {
  total: number
  limit: number
  offset: number
  sort_by: string
  strategies: StrategiesOverviewStrategy[]
}

export interface TotalUserData {
  roi: string
  apr: number
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

    // 获取策略未成交订单
    getStrategyOpenOrders: builder.query<
      StrategyOpenOrdersResponse,
      {
        strategy_id: string
        page?: number
        page_size?: number
      }
    >({
      query: ({ strategy_id, page = 1, page_size = 50 }) => ({
        url: `/strategy/${strategy_id}/orders`,
        method: 'GET',
        params: { page, page_size },
      }),
      transformResponse: (response: StrategyOpenOrdersResponse) => {
        return {
          ...response,
          orders: response.orders.map((rawOrder) => processVaultOpenOrder(rawOrder)),
        }
      },
    }),

    // 获取策略余额历史
    getStrategyBalanceHistory: builder.query<
      StrategyBalanceHistoryResponse,
      {
        strategy_id: string
        start_ts?: number
        end_ts?: number
        limit?: number
      }
    >({
      query: ({ strategy_id, start_ts, end_ts, limit = 1000 }) => {
        const params: Record<string, string | number> = { limit }
        if (start_ts) params.start_ts = start_ts
        if (end_ts) params.end_ts = end_ts

        return {
          url: `/strategy/${strategy_id}/balance/history`,
          method: 'GET',
          params,
        }
      },
    }),

    // 获取余额历史排行榜
    getBalanceHistoryLeaderboard: builder.query<BalanceHistoryLeaderboardResponse, void>({
      query: () => ({
        url: '/strategy/balance/history/all?limit=10&history_limit=720',
        method: 'GET',
      }),
    }),

    // 获取所有策略概览
    getAllStrategiesOverview: builder.query<StrategiesOverviewResponse, void>({
      query: () => ({
        url: '/strategy/overview/all',
        method: 'GET',
      }),
    }),
    // 获取所有策略概览
    getVaultsTotalUserData: builder.query<TotalUserData, { walletAddress: string }>({
      query: ({ walletAddress }) => ({
        url: `/strategy/address/overall?wallet_address=${walletAddress}`,
        method: 'GET',
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
  useGetStrategyOpenOrdersQuery,
  useLazyGetStrategyOpenOrdersQuery,
  useGetStrategyBalanceHistoryQuery,
  useLazyGetStrategyBalanceHistoryQuery,
  useGetBalanceHistoryLeaderboardQuery,
  useLazyGetBalanceHistoryLeaderboardQuery,
  useGetAllStrategiesOverviewQuery,
  useLazyGetAllStrategiesOverviewQuery,
  useGetVaultsTotalUserDataQuery,
  useLazyGetVaultsTotalUserDataQuery,
} = strategyApi
