// Vault相关的类型定义
import {
  VaultInfo,
  VaultOverallStats,
  UserOverallStats,
  VaultTransactionHistory,
  OrderlyAvailableSymbolsDataType,
} from 'api/vaults'
import { StrategiesOverviewDataType } from 'api/strategy'

// 用于UI显示的格式化数据类型
export interface VaultLibraryStats {
  tvl: string
  allTimePnL: string
  vaultCount: number
  // 原始API数据
  raw?: VaultOverallStats
}

export interface MyVaultStats {
  vaultCount: string
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
  allStrategies: StrategiesOverviewDataType[]

  // Orderly 可用交易对数据
  orderlyAvailableSymbols: OrderlyAvailableSymbolsDataType[]

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
  isLoadingOrderlySymbols: boolean
}

export enum WALLET_CONNECT_MODE {
  SHRINK = 'shrink',
  EXPAND = 'expand',
}
