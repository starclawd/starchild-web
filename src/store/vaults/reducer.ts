import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VaultsState, VaultLibraryStats, MyVaultStats, LeaderboardBalanceData } from './vaults'
import { VaultInfo } from 'api/vaults'
import { OrderlyAvailableSymbolsDataType } from 'api/orderly'
import { StrategiesOverviewDataType } from 'api/strategy'

const initialState: VaultsState = {
  // 总览数据
  vaultLibraryStats: null,
  myVaultStats: null,

  allVaults: [],

  // 所有策略概览数据
  allStrategies: [],

  // Orderly 可用交易对数据
  orderlyAvailableSymbols: [],

  vaultsTabIndex: 0,

  currentDepositAndWithdrawVault: null,

  // Leaderboard实时余额数据
  leaderboardBalanceUpdates: {},

  // 加载状态
  isLoadingLibraryStats: false,
  isLoadingMyStats: false,
  isLoadingVaults: false,
  isLoadingAllStrategies: false,
  isLoadingOrderlySymbols: false,
}

export const vaultsSlice = createSlice({
  name: 'vaults',
  initialState,
  reducers: {
    // 总览数据相关
    updateVaultLibraryStats: (state, action: PayloadAction<VaultLibraryStats>) => {
      state.vaultLibraryStats = action.payload
    },

    updateMyVaultStats: (state, action: PayloadAction<MyVaultStats>) => {
      state.myVaultStats = action.payload
    },

    clearMyVaultStats: (state) => {
      state.myVaultStats = null
    },

    updateAllVaults: (state, action: PayloadAction<VaultInfo[]>) => {
      state.allVaults = action.payload
    },

    // 所有策略概览相关
    updateAllStrategies: (state, action: PayloadAction<StrategiesOverviewDataType[]>) => {
      state.allStrategies = action.payload
    },

    // 加载状态相关
    setLoadingLibraryStats: (state, action: PayloadAction<boolean>) => {
      state.isLoadingLibraryStats = action.payload
    },

    setLoadingMyStats: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMyStats = action.payload
    },

    setLoadingVaults: (state, action: PayloadAction<boolean>) => {
      state.isLoadingVaults = action.payload
    },

    setLoadingAllStrategies: (state, action: PayloadAction<boolean>) => {
      state.isLoadingAllStrategies = action.payload
    },

    // Orderly 可用交易对相关
    updateOrderlyAvailableSymbols: (state, action: PayloadAction<OrderlyAvailableSymbolsDataType[]>) => {
      state.orderlyAvailableSymbols = action.payload
    },

    setLoadingOrderlySymbols: (state, action: PayloadAction<boolean>) => {
      state.isLoadingOrderlySymbols = action.payload
    },

    updateVaultsTabIndex: (state, action: PayloadAction<number>) => {
      state.vaultsTabIndex = action.payload
    },

    updateCurrentDepositAndWithdrawVault: (state, action: PayloadAction<VaultInfo | null>) => {
      state.currentDepositAndWithdrawVault = action.payload
    },

    // Leaderboard余额更新相关
    updateLeaderboardBalances: (state, action: PayloadAction<LeaderboardBalanceData[]>) => {
      const updates = action.payload
      updates.forEach((update) => {
        state.leaderboardBalanceUpdates[update.strategy_id] = {
          available_balance: update.available_balance,
          timestamp: update.timestamp,
        }
      })
    },

    clearLeaderboardBalances: (state) => {
      state.leaderboardBalanceUpdates = {}
    },

    // 重置状态
    resetVaultsState: (state) => {
      return { ...initialState }
    },
  },
})

export const {
  updateVaultLibraryStats,
  updateMyVaultStats,
  clearMyVaultStats,
  updateAllVaults,
  updateAllStrategies,
  setLoadingLibraryStats,
  setLoadingMyStats,
  setLoadingVaults,
  setLoadingAllStrategies,
  updateOrderlyAvailableSymbols,
  setLoadingOrderlySymbols,
  updateVaultsTabIndex,
  updateCurrentDepositAndWithdrawVault,
  updateLeaderboardBalances,
  clearLeaderboardBalances,
  resetVaultsState,
} = vaultsSlice.actions

export default vaultsSlice.reducer
