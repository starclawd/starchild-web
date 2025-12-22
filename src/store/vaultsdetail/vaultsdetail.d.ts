// VaultDetail 相关的类型定义
import type { VaultInfo, VaultLpInfo, VaultTransactionHistory } from 'api/vaults'

export type VaultDetailTabType = 'strategy' | 'vaults'

export type VaultPositionsOrdersSubTabType = 'positions' | 'orders'

export type VaultChartType = 'TVL' | 'Index' | 'PNL' | 'EQUITY'

export type VaultChartTimeRange = '24h' | '7d' | '30d' | 'all_time'

export type DataModeType = 'live' | 'paper_trading'

export interface ClaimData {
  [chainId: string]: {
    claimableAmount: number
  }
}

export interface VaultDetailState {
  // Tab状态管理
  activeTab: VaultDetailTabType

  // 当前查看的vault信息
  currentVaultId: string | null

  // 当前查看的strategy信息
  currentStrategyId: string | null

  // VaultInfo 数据
  vaultInfo: VaultInfo | null

  // 图表相关状态
  chartType: VaultChartType
  claimData: ClaimData
  latestTransactionHistory: VaultTransactionHistory[]
  isLoadingLatestTransactionHistory: boolean

  // 加载状态
  isLoadingChart: boolean
  isLoadingVaultInfo: boolean
  depositAndWithdrawTabIndex: number
  signalList: StrategySignalDataType[]
  isLoadingSignalList: boolean

  // Positions & Orders 子标签状态
  positionsOrdersActiveSubTab: VaultPositionsOrdersSubTabType
}

export interface VaultDetailChartData {
  data: Array<{ timestamp: number; value: number }>
  isLoading: boolean
  isPositive?: boolean
  hasData: boolean
  totalPnL?: number
  todayPnL?: number
  pnlPercentage?: number
  maxDrawdown?: number
  chartType: VaultChartType
}

export interface VaultDetailChartOptions {
  responsive: boolean
  maintainAspectRatio: boolean
  interaction: {
    mode: 'index'
    intersect: boolean
  }
  plugins: any
  scales: any
  elements: any
}
