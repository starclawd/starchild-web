// Vault相关的类型定义
import { VaultInfo, VaultOverallStats, UserOverallStats } from 'api/vaults'

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

export interface ProtocolVault {
  id: string
  name: string
  description: string
  tvl: string
  allTimeApy: string
  depositors: number
  // 原始API数据
  raw?: VaultInfo
}

export interface CommunityVault {
  id: string
  name: string
  builder: string
  strategyProvider: string
  networks: NetworkInfo[]
  additionalNetworks: number
  tvl: string
  vaultAge: string
  allTimeApy: string
  allTimePnL: number | null
  yourBalance: string
  // 原始API数据
  raw?: VaultInfo
}

export interface VaultsState {
  // 总览数据
  vaultLibraryStats: VaultLibraryStats | null
  myVaultStats: MyVaultStats | null
  
  // Protocol vaults
  protocolVaults: ProtocolVault[]
  
  // Community vaults
  communityVaults: CommunityVault[]
  communityVaultsFilter: CommunityVaultFilter
  
  // 加载状态
  isLoadingLibraryStats: boolean
  isLoadingMyStats: boolean
  isLoadingProtocolVaults: boolean
  isLoadingCommunityVaults: boolean
}

export interface CommunityVaultFilter {
  timeFilter: 'all_time' | '30d'
  statusFilter: 'all' | 'live' | 'launching_soon' | 'closed'
  hideZeroBalances: boolean
  sortBy: 'tvl' | 'apy' | 'pnl' | 'age'
  sortOrder: 'asc' | 'desc'
}

export interface CommunityVaultsParams {
  filter?: string
  sortBy?: string 
  hideZeroBalances?: boolean
}
