// Vault相关的类型定义
import { VaultInfo, VaultOverallStats, UserOverallStats, VaultTransactionHistory } from 'api/vaults'
import { StrategiesOverviewStrategy } from 'api/strategy'

// 用于UI显示的格式化数据类型
export interface VaultLibraryStats {
  tvl: string
  allTimePnL: string
  vaultCount: number
  // 原始API数据
  raw?: VaultOverallStats
}

export interface MyVaultStats {
  vaultCount: string | number
  myTvl: string
  myAllTimePnL: string
  // 原始API数据
  raw?: UserOverallStats
}

export interface NetworkInfo {
  id: string
  name: string
  icon: string
}

export interface AllStrategiesOverview {
  strategyId: string
  vaultId: string
  period: string
  pnl: number
  pnlPercentage: number
  apr: number
  allTimeApr: number
  maxDrawdown: number
  sharpeRatio: number
  initialBalance: number
  endBalance: number
  dataPoints: number
  ageDays: number
  strategyName: string
  strategyType: string
  userInfo: any
  // 原始API数据
  raw?: StrategiesOverviewStrategy
}

// Leaderboard Balance WebSocket数据类型
export interface LeaderboardBalanceData {
  strategy_id: string
  available_balance: number
  timestamp: number
}

// Leaderboard实时余额更新数据
export interface LeaderboardBalanceUpdate {
  [strategy_id: string]: {
    available_balance: number
    timestamp: number
  }
}

export interface VaultsState {
  // 总览数据
  vaultLibraryStats: VaultLibraryStats | null
  myVaultStats: MyVaultStats | null

  allVaults: VaultInfo[]

  // 所有策略概览数据
  allStrategies: AllStrategiesOverview[]

  // 当前选中的tab类型
  vaultsTabIndex: number

  currentDepositAndWithdrawVault: VaultInfo | null

  // Leaderboard实时余额数据
  leaderboardBalanceUpdates: LeaderboardBalanceUpdate

  // 加载状态
  isLoadingLibraryStats: boolean
  isLoadingMyStats: boolean
  isLoadingVaults: boolean
  isLoadingAllStrategies: boolean
}
