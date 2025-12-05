import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VaultsState, VaultLibraryStats, MyVaultStats, AllStrategiesOverview } from './vaults'
import { VaultInfo, VaultTransactionHistory } from 'api/vaults'

const initialState: VaultsState = {
  // 总览数据
  vaultLibraryStats: null,
  myVaultStats: null,

  allVaults: [],

  // 所有策略概览数据
  allStrategies: [],

  vaultsTabIndex: 0,

  currentDepositAndWithdrawVault: null,

  // 加载状态
  isLoadingLibraryStats: false,
  isLoadingMyStats: false,
  isLoadingVaults: false,
  isLoadingAllStrategies: false,
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
    updateAllStrategies: (state, action: PayloadAction<AllStrategiesOverview[]>) => {
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

    updateVaultsTabIndex: (state, action: PayloadAction<number>) => {
      state.vaultsTabIndex = action.payload
    },

    updateCurrentDepositAndWithdrawVault: (state, action: PayloadAction<VaultInfo | null>) => {
      state.currentDepositAndWithdrawVault = action.payload
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
  updateVaultsTabIndex,
  updateCurrentDepositAndWithdrawVault,
  resetVaultsState,
} = vaultsSlice.actions

export default vaultsSlice.reducer
