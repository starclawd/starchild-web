// VaultDetail 相关的类型定义
import type { VaultInfo, VaultLpInfo, VaultTransactionHistory } from 'api/vaults'
import type { StrategyDetailDataType, PaperTradingCurrentDataType } from 'store/createstrategy/createstrategy.d'
import type { StrategyPerformance, StrategySignalDataType } from 'api/strategy'

export enum DETAIL_TYPE {
  STRATEGY = 'strategy',
  VAULT = 'vault',
}

export enum CHART_TYPE {
  TVL = 'TVL',
  INDEX = 'Index',
  PNL = 'PNL',
  EQUITY = 'EQUITY',
}

export enum CHAT_TIME_RANGE {
  DAILY = '24h',
  WEEKLY = '7d',
  MONTHLY = '30d',
  ALL_TIME = 'all_time',
}

export interface ClaimData {
  [chainId: string]: {
    claimableAmount: number
  }
}

export interface VaultDetailState {
  // Tab状态管理
  activeTab: DETAIL_TYPE

  // 当前查看的strategy信息
  currentStrategyId: string | null

  // VaultInfo 数据
  vaultInfo: VaultInfo | null

  // StrategyInfo 数据
  strategyInfo: StrategyPerformance | null

  // 图表相关状态
  chartType: CHART_TYPE
  claimData: ClaimData
  latestTransactionHistory: VaultTransactionHistory[]
  isLoadingLatestTransactionHistory: boolean

  // Paper Trading 公开数据
  paperTradingPublicData: PaperTradingCurrentDataType | null
  isLoadingPaperTradingPublic: boolean

  // 加载状态
  isLoadingChart: boolean
  isLoadingVaultInfo: boolean
  isLoadingStrategyInfo: boolean
  depositAndWithdrawTabIndex: number
  signalList: StrategySignalDataType[]
  isLoadingSignalList: boolean
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
  chartType: CHART_TYPE
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
