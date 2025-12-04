import { orderlyApi } from './base'
import { calculateVaultPosition, processVaultOpenOrder } from 'store/vaultsdetail/dataTransforms'
import { VaultChartType, VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'

// TypeScript 接口定义
export interface VaultInfo {
  vault_id: string
  vault_address: string
  vault_type: string
  vault_name: string
  description: string
  sp_address: string
  sp_name: string | null
  asset: string
  vault_age: number
  status: 'live' | 'pre_launch' | 'closing' | 'closed'
  vault_start_time: number
  performance_fee_rate: number
  supported_chains: Array<{
    chain_id: string
    chain_name: string
  }>
  tvl: number
  valid_hpr: number
  '30d_apy': number
  recovery_30d_apy: number
  vault_lifetime_net_pnl: number
  lp_counts: number
  total_main_shares: number
  lifetime_apy: number
  lock_duration: number
  min_deposit_amount: number
  min_withdrawal_amount: number
  gate_threshold_pct: number
  gate_triggered: boolean
  broker_id: string
  est_main_share_price: number
}

export interface VaultOverallStats {
  strategy_vaults_tvl: number
  strategy_vaults_lifetime_net_pnl: number
  strategy_vaults_count: number
  strategy_vaults_lp_count: number
}

export interface UserOverallStats {
  total_vaults_tvl: number
  vaults_lp_tvl: number
  vaults_sp_tvl: number
  total_vaults_lifetime_net_pnl: number
  vaults_lp_lifetime_net_pnl: number
  vaults_sp_lifetime_net_pnl: number
  total_involved_vaults_count: number
  involved_lp_vaults_count: number
  involved_sp_vaults_count: number
}

export interface VaultPerformance {
  time_range: string
  incremental_net_pnl: number
  max_drawdown: number
  pnl_max_drawdown: number
  fees: number
  volume: number
}

export interface VaultPerformanceChart {
  timestamp: number
  value: number
}

export interface VaultApiResponse<T> {
  success: boolean
  timestamp: number
  data: {
    rows: T[]
  }
}

// Vault Position 相关接口
export interface VaultPosition {
  symbol: string
  displaySymbol: string // 格式化后的显示文本，如 "SOL-USDC"
  token: string // base token，如 "SOL"
  logoUrl: string // logo URL
  position_qty: number
  value: number
  average_open_price: number
  mark_price: number
  pnl: number
  roe: number
  position_side: 'long' | 'short'
}

export interface VaultPositionPaginatedResponse {
  success: boolean
  timestamp: number
  data: {
    rows: VaultPosition[]
    total: number
    has_next: boolean
  }
}

// Vault Open Orders 相关接口
export interface VaultOpenOrder {
  exchange: string
  order_id: number
  created_time: number
  updated_time: number
  type: string
  symbol: string
  side: 'BUY' | 'SELL'
  quantity: number
  price: number
  amount: number
  executed_quantity: number
  total_executed_quantity: number
  average_executed_price: number
  status: string
  is_triggered: string // "true" | "false"
  child_orders: any[]
}

export interface VaultOpenOrdersPaginatedResponse {
  success: boolean
  timestamp: number
  data: {
    rows: VaultOpenOrder[]
    meta: {
      total: number
      records_per_page: number
      current_page: number
    }
  }
}

export interface VaultTransactionHistory {
  created_time: number
  period_number: number
  type: 'deposit' | 'withdrawal'
  source: string
  status: string
  est_assign_period_time: number | null
  unlock_time: number | null
  est_claim_time: number | null
  chain_id: string
  txn_hash: string
  txn_hash_claim: string | null
  shares_change: number
  amount_change: number
  transaction_nonce: number | null
}

export interface VaultLpInfo {
  vault_id: string
  lp_nav: number
  lp_tvl: number
  total_main_shares: number
  available_main_shares: number
  potential_pnl: number
  total_performance_fees: number
}

export interface ClaimInfo {
  claimable_amount: number
}

// Vaults API endpoints
export const vaultsApi = orderlyApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取所有金库的整体统计数据
    getVaultLibraryStats: builder.query<VaultOverallStats, { broker_ids?: string }>({
      query: ({ broker_ids } = {}) => {
        const params = new URLSearchParams()
        if (broker_ids) {
          params.append('broker_ids', broker_ids)
        }
        return {
          url: `/v1/public/strategy_vault/vault/overall_info${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (response: any) => {
        return response.data
      },
    }),

    // 获取用户在所有金库中的统计数据
    getMyVaultStats: builder.query<UserOverallStats, { wallet_address: string }>({
      query: ({ wallet_address }) => ({
        url: `/v1/public/strategy_vault/user/overall_info?wallet_address=${wallet_address}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return response.data
      },
    }),

    // 获取金库信息列表
    getVaultInfo: builder.query<
      VaultInfo[],
      {
        vault_id?: string
        status?: string
        broker_ids?: string
      }
    >({
      query: ({ vault_id, status, broker_ids } = {}) => {
        const params = new URLSearchParams()
        if (vault_id) params.append('vault_id', vault_id)
        if (status) params.append('status', status)
        if (broker_ids) params.append('broker_ids', broker_ids)
        return {
          url: `/v1/public/strategy_vault/vault/info${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultInfo>) => {
        return response.data.rows
      },
    }),

    // 获取Live状态的金库列表
    getVaults: builder.query<VaultInfo[], { broker_ids?: string }>({
      query: ({ broker_ids } = {}) => {
        const params = new URLSearchParams()
        params.append('status', 'live')
        if (broker_ids) params.append('broker_ids', broker_ids)
        return {
          url: `/v1/public/strategy_vault/vault/info?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultInfo>) => {
        return response.data.rows
      },
    }),

    // 获取金库表现数据
    getVaultPerformance: builder.query<VaultPerformance[], { vault_id: string }>({
      query: ({ vault_id }) => ({
        url: `/v1/public/strategy_vault/vault/performance?vault_id=${vault_id}`,
        method: 'GET',
      }),
      transformResponse: (response: VaultApiResponse<VaultPerformance>) => {
        return response.data.rows
      },
    }),

    // 获取金库历史表现图表数据
    getVaultPerformanceChart: builder.query<
      VaultPerformanceChart[],
      {
        vault_id: string
        type: VaultChartType
        time_range: VaultChartTimeRange
      }
    >({
      query: ({ vault_id, type, time_range }) => {
        const params = new URLSearchParams()
        params.append('vault_id', vault_id)
        params.append('type', type)
        params.append('time_range', time_range)
        return {
          url: `/v1/public/strategy_vault/vault/performance_chart?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultPerformanceChart>) => {
        return response.data.rows
      },
    }),

    // 获取用户在特定金库的表现图表数据
    getMyPerformanceChart: builder.query<
      VaultPerformanceChart[],
      {
        vault_id: string
        wallet_address: string
        type: VaultChartType
        time_range: VaultChartTimeRange
      }
    >({
      query: ({ vault_id, wallet_address, type, time_range }) => {
        const params = new URLSearchParams()
        params.append('vault_id', vault_id)
        params.append('wallet_address', wallet_address)
        params.append('type', type)
        params.append('time_range', time_range)
        return {
          url: `/v1/public/strategy_vault/lp/performance_chart?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultPerformanceChart>) => {
        return response.data.rows
      },
    }),

    // 获取金库持仓信息 (不分页，返回所有数据)
    getVaultPositions: builder.query<
      VaultPosition[],
      {
        vault_id: string
      }
    >({
      query: ({ vault_id }) => {
        const params = new URLSearchParams()
        params.append('vault_id', vault_id)
        return {
          url: `/v1/public/strategy_vault/vault/positions?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<any>) => {
        return response.data.rows
          .filter((rawPosition: any) => rawPosition.position_qty !== 0)
          .map((rawPosition: any) => calculateVaultPosition(rawPosition))
          .sort((a, b) => b.value - a.value)
      },
    }),

    // 获取金库未成交订单信息 (分页)
    getVaultOpenOrders: builder.query<
      VaultOpenOrdersPaginatedResponse,
      {
        vault_id: string
        page?: number
        size?: number
        symbol?: string
        side?: 'buy' | 'sell'
      }
    >({
      query: ({ vault_id, page = 1, size = 10, symbol, side }) => {
        const params = new URLSearchParams()
        params.append('vault_id', vault_id)
        params.append('page', page.toString())
        params.append('size', size.toString())
        if (symbol) params.append('symbol', symbol)
        if (side) params.append('side', side)
        return {
          url: `/v1/public/strategy_vault/vault/open_orders?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultOpenOrdersPaginatedResponse) => {
        return {
          ...response,
          rows: response.data.rows.map((rawOrder) => processVaultOpenOrder(rawOrder)),
          meta: response.data.meta,
        }
      },
    }),

    // 获取金库交易历史数据
    getVaultLatestTransactionHistory: builder.query<
      VaultTransactionHistory[],
      {
        vaultId: string
        walletAddress: string
        type: 'deposit' | 'withdrawal'
        page?: number
        size?: number
      }
    >({
      query: ({ vaultId, walletAddress, type, page = 1, size = 1 }) => {
        const params = new URLSearchParams()
        params.append('vault_id', vaultId)
        params.append('wallet_address', walletAddress)
        params.append('type', type)
        params.append('page', page.toString())
        params.append('size', size.toString())
        return {
          url: `/v1/public/strategy_vault/lp/transaction_history?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultTransactionHistory>) => {
        return response.data.rows
      },
    }),
    // 获取vault 个人数据
    getVaultLpInfo: builder.query<
      VaultLpInfo[],
      {
        walletAddress: string
        vaultId?: string
      }
    >({
      query: ({ walletAddress, vaultId = '' }) => {
        const params = new URLSearchParams()
        params.append('wallet_address', walletAddress)
        if (vaultId) params.append('vault_id', vaultId)
        return {
          url: `/v1/public/strategy_vault/lp/info?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultLpInfo>) => {
        return response.data.rows
      },
    }),
    // 获取vault 可领取金额数据
    getClaimInfo: builder.query<
      ClaimInfo,
      {
        walletAddress: string
        vaultId: string
        chainId: string
      }
    >({
      query: ({ walletAddress, vaultId, chainId }) => {
        const params = new URLSearchParams()
        params.append('wallet_address', walletAddress)
        params.append('vault_id', vaultId)
        params.append('chain_id', chainId)
        return {
          url: `/v1/public/strategy_vault/lp/claim_info?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: any) => {
        return response.data
      },
    }),

    // 获取金库交易历史数据
    getTransactionHistoryList: builder.query<
      VaultTransactionHistory[],
      {
        walletAddress: string
        page?: number
        size?: number
      }
    >({
      query: ({ walletAddress, page = 1, size = 10 }) => {
        const params = new URLSearchParams()
        params.append('vault_id', '0xa3426a1cef4052c056fced18099be899d93f1427d13b9a1df1806b91fad3d0c2')
        params.append('wallet_address', walletAddress)
        params.append('page', page.toString())
        params.append('size', size.toString())
        return {
          url: `/v1/public/strategy_vault/lp/transaction_history?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultTransactionHistory>) => {
        return response.data.rows
      },
    }),
  }),
})

// 导出 vaults hooks
export const {
  useGetVaultLibraryStatsQuery,
  useGetMyVaultStatsQuery,
  useGetVaultInfoQuery,
  useGetVaultsQuery,
  useGetVaultPerformanceQuery,
  useGetVaultPerformanceChartQuery,
  useGetMyPerformanceChartQuery,
  useGetVaultPositionsQuery,
  useGetVaultOpenOrdersQuery,
  useGetVaultLatestTransactionHistoryQuery,
  useGetVaultLpInfoQuery,
  useGetClaimInfoQuery,
  useGetTransactionHistoryListQuery,
  useLazyGetVaultLibraryStatsQuery,
  useLazyGetMyVaultStatsQuery,
  useLazyGetVaultInfoQuery,
  useLazyGetVaultsQuery,
  useLazyGetVaultPerformanceQuery,
  useLazyGetVaultPerformanceChartQuery,
  useLazyGetMyPerformanceChartQuery,
  useLazyGetVaultPositionsQuery,
  useLazyGetVaultOpenOrdersQuery,
  useLazyGetVaultLatestTransactionHistoryQuery,
  useLazyGetVaultLpInfoQuery,
  useLazyGetClaimInfoQuery,
  useLazyGetTransactionHistoryListQuery,
} = vaultsApi
