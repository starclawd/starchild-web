// VaultDetail 相关的类型定义

export type VaultDetailTabType = 'strategy' | 'vaults'

export type VaultPositionsOrdersSubTabType = 'positions' | 'orders'

export interface VaultDetailState {
  // Tab状态管理
  activeTab: VaultDetailTabType

  // 当前查看的vault信息
  currentVaultId: string | null

  // 图表相关状态
  chartTimeRange: '24h' | '7d' | '30d' | 'all_time'

  // 加载状态
  isLoadingChart: boolean

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
