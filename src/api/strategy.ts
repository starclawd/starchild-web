import { chatApi } from './baseChat'
import { VaultPosition, VaultOpenOrder } from './vaults'
import {
  calculateVaultPosition,
  processVaultOpenOrder,
  processStrategyOrderHistoryItem,
} from '../store/vaultsdetail/dataTransforms'
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

// Strategy Order History 相关接口
export interface StrategyOrderHistoryItem {
  id: string
  strategy_id: string
  deployment_id: string | null
  mode: string
  symbol: string
  side: 'BUY' | 'SELL'
  status: string
  price: number
  quantity: number
  orderly_order_id: string
  created_at: number
  updated_at: number
  displaySymbol?: string
  token?: string
  logoUrl?: string
  average_executed_price?: number
  executed_quantity?: number
  order_data?: any
}

export interface StrategyOrderHistoryResponse {
  total: number
  page: number
  page_size: number
  items: StrategyOrderHistoryItem[]
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

export enum SIGNAL_TYPE {
  COMBINED_SIGNAL = 'combined_signal',
  LOG = 'log',
}

export interface StrategySignalType {
  direction: string
  price: number
  symbol: string
  timestamp: number
  trading_price: number
  confidence: number
  crossover_type: string
  proximity: number
  signal_type: string
  trading_symbol: string
  triggered_level: string
  description: string
  name: string
  trigger_condition: string
  leverage: string
  position_sizing: string
  signal_price: number
  signal_symbol: string
  action: string
  indicators: {
    ema9_above_ema21: boolean
    ema21: number
    ema9: number
  }
}

export interface StrategyThoughtType {
  reasoning: string
  summary: string
}

export interface StrategyDecisionType {
  action: string
  confidence: number
  description: string
  orders: Array<{
    id: string
    order_data: {
      api_response: {
        data: {
          orderId: number
          success: boolean
          walletAddress: string
          accountId: string
          clientOrderId: string | null
          data: {
            order_type: string
            client_order_id: string | null
            order_amount: number | null
            order_id: number
            order_price: number | null
            order_quantity: number
          }
          marketDataSource: string
        }
        success: boolean
      }
      order_price: number
      paper_trading: boolean
      reduce_only: boolean
      side: string
      fill_price: number
      fill_quantity: number
      order_quantity: number
      order_type: string
      symbol: string
    }
    side: string
    status: string
    symbol: string
  }>
  symbol: string
}

export type CombinedSignalType = {
  signal_event_id: string
  strategy_id: string
  thought: StrategyThoughtType
  decision: StrategyDecisionType
  signal: StrategySignalType
  mode: string
  timestamp: number
  type: typeof SIGNAL_TYPE.COMBINED_SIGNAL
  decision_id: string
  deployment_id: string
}

export interface LogType {
  type: typeof SIGNAL_TYPE.LOG
  decision_id: string
  strategy_id: string
  mode: string
  timestamp: number
  content: {
    log: string
  }
}

export type StrategySignalDataType = CombinedSignalType | LogType

// All Strategies Overview 相关接口
export type StrategiesOverviewDataType = {
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
  vibe: string | null
  vibe_title: string | null
  s24h: { t: number; b: number }[]
  followers: number
  tvf: number
  ai_summary: string
  roe: number | null
  user_info: {
    user_avatar: string
    user_info_id: number
    user_name: string
  }
}

export interface StrategiesOverviewResponse {
  total: number
  limit: number
  offset: number
  sort_by: string
  strategies: StrategiesOverviewDataType[]
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

export const strategyApi = chatApi.injectEndpoints({
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
          url: `/api/v1/strategy/positions`,
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
      StrategiesOverviewDataType,
      {
        strategy_id: string
        period: string
      }
    >({
      query: ({ strategy_id, period }) => {
        const params: Record<string, string> = { strategy_id, period }

        return {
          url: `/api/v1/strategy/overview`,
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
          url: `/api/v1/strategy/orders`,
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

    // 获取策略历史订单
    getStrategyOrderHistory: builder.query<
      StrategyOrderHistoryResponse,
      {
        strategy_id: string
        page?: number
        page_size?: number
        status?: string
      }
    >({
      query: ({ strategy_id, page = 1, page_size = 50, status = 'COMPLETED' }) => {
        const params: Record<string, string | number> = { strategy_id, page, page_size, status }

        return {
          url: `/api/v1/strategy/order-history`,
          params,
          method: 'GET',
        }
      },
      transformResponse: (response: StrategyOrderHistoryResponse) => {
        return {
          ...response,
          items: response.items.map((rawOrder) => processStrategyOrderHistoryItem(rawOrder)),
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
          url: `/api/v1/strategy/balance-history`,
          method: 'GET',
          params,
        }
      },
    }),

    // 获取余额历史排行榜
    getBalanceHistoryLeaderboard: builder.query<BalanceHistoryLeaderboardResponse, void>({
      query: () => ({
        url: '/api/v1/strategy/balance/history/all?limit=10&history_limit=720',
        method: 'GET',
      }),
    }),

    // 获取所有策略概览
    getAllStrategiesOverview: builder.query<StrategiesOverviewResponse, void>({
      query: () => ({
        url: '/api/v1/strategy/overview/all?period=all',
        method: 'GET',
      }),
    }),
    // 获取所有策略概览
    getAllFollowedStrategiesOverview: builder.query<StrategiesOverviewResponse, void>({
      query: () => ({
        url: '/api/v1/strategy/following?period=all',
        method: 'GET',
      }),
    }),
    // 获取所有策略概览
    getVaultsTotalUserData: builder.query<TotalUserData, { walletAddress: string }>({
      query: ({ walletAddress }) => ({
        url: `/api/v1/strategy/address/overall?wallet_address=${walletAddress}`,
        method: 'GET',
      }),
    }),
    getStrategySignal: builder.query<
      any,
      {
        strategyId: string
        page: number
        size: number
      }
    >({
      query: ({ strategyId, page = 1, size = 20 }) => {
        const params = new URLSearchParams()
        params.append('strategy_id', strategyId)
        params.append('page', page.toString())
        params.append('size', size.toString())
        return {
          url: `/api/v1/strategy/signals?${params.toString()}`,
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
          url: `/api/v1/strategy/deposit-address/record`,
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
        url: '/api/v1/strategy/strategies?period=all',
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
          url: `/api/v1/strategy/user/balance/history`,
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
  useGetStrategyOrderHistoryQuery,
  useLazyGetStrategyOrderHistoryQuery,
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
  useGetAllFollowedStrategiesOverviewQuery,
  useLazyGetAllFollowedStrategiesOverviewQuery,
} = strategyApi
