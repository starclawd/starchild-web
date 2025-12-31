import { liveTradingApi } from './baseLiveTrading'
import { VaultPosition, VaultOpenOrder } from './vaults'
import { calculateVaultPosition, processVaultOpenOrder } from '../store/vaultsdetail/dataTransforms'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'

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
  initial_balance: number
  start_balance: number
  end_balance: number
  data_points: number
  all_time_apr: number
  age_days: number
  strategy_name: string
  strategy_type: string
  description: string
  status: STRATEGY_STATUS
  is_public: boolean
  user_info: {
    user_name: string
    user_avatar: string
  }
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
  user_info?: {
    user_name?: string
    user_avatar?: string
  }
}

export interface BalanceHistoryLeaderboardResponse {
  limit: number
  sort_by: string
  strategies: BalanceHistoryLeaderboardStrategy[]
}

export interface StrategySignalType {
  strategy_id: string
  signal_event_id: string
  signal_id: string
  decision_id: string
  type: 'signal'
  mode: 'paper_trading' | 'live'
  content: {
    macd: number
    name: string
    price: number
    symbol: string
    direction: string
    histogram: number
    indicator: string
    timestamp: number
    description: string
    signal_line: number
  }
  timestamp: number
}

export interface StrategyThoughtType {
  strategy_id: string
  signal_event_id: string
  signal_id: string
  decision_id: string
  type: 'thought'
  mode: 'paper_trading' | 'live'
  content: {
    reasoning: string
  }
  timestamp: number
}

export interface StrategyDecisionType {
  type: 'decision'
  decision_id: string
  strategy_id: string
  signal_event_id: string
  signal_id: string
  mode: 'paper_trading' | 'live'
  timestamp: number
  content: {
    symbol: string
    action: string
    description: string
  }
}

export type StrategySignalDataType = StrategySignalType | StrategyThoughtType | StrategyDecisionType

// All Strategies Overview 相关接口
export type StrategiesOverviewStrategy = {
  strategy_id: string
  strategy_name: string
  strategy_type: string
  vault_id: string
  period: string
  pnl: number
  pnl_percentage: number
  apr: number
  all_time_apr: number
  age_days: number
  max_drawdown: number
  sharpe_ratio: number
  start_balance: number
  initial_balance: number
  end_balance: number
  data_points: number
  created_time: number
  status: STRATEGY_STATUS
  mode: string
  user_info: {
    user_avatar: string
    user_name: string
  }
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

// User Balance History 相关接口
export interface UserBalanceHistoryItem {
  timestamp: number
  available_balance: number
  holding: number
  unsettled_pnl: number
  total_collateral_value: number
}

export interface UserBalanceHistoryStrategy {
  strategy_id: string
  strategy_name: string
  strategy_type: string
  vault_id: string
  latest_available_balance: number
  latest_holding: number
  latest_unsettled_pnl: number
  latest_timestamp: number
  data: UserBalanceHistoryItem[]
  data_points: number
  user_info?: {
    user_name?: string
    user_avatar?: string
  }
}

export interface UserBalanceHistoryResponse {
  limit: number
  sort_by: string
  strategies: UserBalanceHistoryStrategy[]
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
      query: ({ strategy_id }) => {
        const params: Record<string, string> = { strategy_id }

        return {
          url: `/strategy/positions`,
          params,
          method: 'GET',
        }
      },
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
      query: ({ strategy_id, period }) => {
        const params: Record<string, string> = { strategy_id, period }

        return {
          url: `/strategy/overview`,
          params,
          method: 'GET',
        }
      },
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
      query: ({ strategy_id, page = 1, page_size = 50 }) => {
        const params: Record<string, string | number> = { strategy_id, page, page_size }

        return {
          url: `/strategy/orders`,
          params,
          method: 'GET',
        }
      },
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
        params.strategy_id = strategy_id

        return {
          url: `/strategy/balance-history`,
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
    getStrategySignal: builder.query<
      any,
      {
        strategyId: string
        page: number
        size: number
        mode: 'paper_trading' | 'live'
      }
    >({
      query: ({ strategyId, page = 1, size = 20, mode }) => {
        const params = new URLSearchParams()
        params.append('strategy_id', strategyId)
        params.append('page', page.toString())
        params.append('size', size.toString())
        params.append('mode', mode)
        return {
          url: `/strategy/signals?${params.toString()}`,
          method: 'GET',
        }
      },
    }),

    // 获取金库交易历史数据
    recordDepositAddress: builder.query<
      any,
      {
        walletAddress: string
        userId: string
      }
    >({
      query: ({ walletAddress, userId }) => {
        return {
          url: `/strategy/deposit-address/record`,
          method: 'POST',
          body: {
            user_id: userId,
            wallet_address: walletAddress,
          },
        }
      },
    }),
    // 获取所有策略概览
    getMyStrategies: builder.query<StrategiesOverviewResponse, void>({
      query: () => ({
        url: '/strategy/strategies',
        method: 'GET',
      }),
    }),

    // 获取用户余额历史
    getUserBalanceHistory: builder.query<
      UserBalanceHistoryResponse,
      {
        history_limit?: number
        start_ts?: number
      }
    >({
      query: ({ history_limit = 1000, start_ts }) => {
        const params: Record<string, string | number> = { history_limit }
        if (start_ts) params.start_ts = start_ts

        return {
          url: `/strategy/user/balance/history`,
          method: 'GET',
          params,
        }
      },
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
  useGetStrategySignalQuery,
  useLazyGetStrategySignalQuery,
  useRecordDepositAddressQuery,
  useLazyRecordDepositAddressQuery,
  useGetMyStrategiesQuery,
  useLazyGetMyStrategiesQuery,
  useGetUserBalanceHistoryQuery,
  useLazyGetUserBalanceHistoryQuery,
} = strategyApi
