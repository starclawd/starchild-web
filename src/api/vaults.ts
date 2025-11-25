import { chatApi } from './baseChat'
import { vaultDomain } from 'utils/url'

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

// Vaults API endpoints
export const vaultsApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取所有金库的整体统计数据
    getVaultLibraryStats: builder.query<VaultOverallStats, { broker_ids?: string }>({
      query: ({ broker_ids } = {}) => {
        const params = new URLSearchParams()
        if (broker_ids) {
          params.append('broker_ids', broker_ids)
        }
        return {
          url: `${vaultDomain.restfulDomain}/v1/public/strategy_vault/vault/overall_info${params.toString() ? `?${params.toString()}` : ''}`,
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
        url: `${vaultDomain.restfulDomain}/v1/public/strategy_vault/user/overall_info?wallet_address=${wallet_address}`,
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
          url: `${vaultDomain.restfulDomain}/v1/public/strategy_vault/vault/info${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultInfo>) => {
        return response.data.rows
      },
    }),

    // 获取协议金库 (类型为 protocol 的金库)
    getProtocolVaults: builder.query<VaultInfo[], { broker_ids?: string }>({
      query: ({ broker_ids } = {}) => {
        const params = new URLSearchParams()
        params.append('status', 'live')
        if (broker_ids) params.append('broker_ids', broker_ids)
        return {
          url: `${vaultDomain.restfulDomain}/v1/public/strategy_vault/vault/info?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultInfo>) => {
        // 筛选出协议类型的金库
        return response.data.rows.filter((vault) => vault.vault_type === 'protocol')
      },
    }),

    // 获取社区金库 (类型不是 protocol 的金库)
    getCommunityVaults: builder.query<
      VaultInfo[],
      {
        filter?: string
        sortBy?: string
        hideZeroBalances?: boolean
        broker_ids?: string
      }
    >({
      query: ({ broker_ids } = {}) => {
        const params = new URLSearchParams()
        params.append('status', 'live')
        if (broker_ids) params.append('broker_ids', broker_ids)
        return {
          url: `${vaultDomain.restfulDomain}/v1/public/strategy_vault/vault/info?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultInfo>) => {
        // 筛选出非协议类型的金库
        return response.data.rows.filter((vault) => vault.vault_type !== 'protocol')
      },
    }),

    // 获取金库表现数据
    getVaultPerformance: builder.query<VaultPerformance[], { vault_id: string }>({
      query: ({ vault_id }) => ({
        url: `${vaultDomain.restfulDomain}/v1/public/strategy_vault/vault/performance?vault_id=${vault_id}`,
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
        type: 'PNL' | 'TVL'
        time_range: '24h' | '7d' | '30d' | 'all_time'
      }
    >({
      query: ({ vault_id, type, time_range }) => {
        const params = new URLSearchParams()
        params.append('vault_id', vault_id)
        params.append('type', type)
        params.append('time_range', time_range)
        return {
          url: `${vaultDomain.restfulDomain}/v1/public/strategy_vault/vault/performance_chart?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: VaultApiResponse<VaultPerformanceChart>) => {
        return response.data.rows
      },
    }),
  }),
})

// 导出hooks
export const {
  useGetVaultLibraryStatsQuery,
  useGetMyVaultStatsQuery,
  useGetVaultInfoQuery,
  useGetProtocolVaultsQuery,
  useGetCommunityVaultsQuery,
  useGetVaultPerformanceQuery,
  useGetVaultPerformanceChartQuery,
  useLazyGetVaultLibraryStatsQuery,
  useLazyGetMyVaultStatsQuery,
  useLazyGetVaultInfoQuery,
  useLazyGetProtocolVaultsQuery,
  useLazyGetCommunityVaultsQuery,
  useLazyGetVaultPerformanceQuery,
  useLazyGetVaultPerformanceChartQuery,
} = vaultsApi
