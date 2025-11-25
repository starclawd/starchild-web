import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  VaultsState,
  VaultLibraryStats,
  MyVaultStats,
  ProtocolVault,
  CommunityVault,
  CommunityVaultFilter,
} from './vaults'

const initialState: VaultsState = {
  // 总览数据
  vaultLibraryStats: null,
  myVaultStats: null,

  // Protocol vaults
  protocolVaults: [],

  // Community vaults
  communityVaults: [],
  communityVaultsFilter: {
    timeFilter: 'all_time',
    statusFilter: 'all',
    hideZeroBalances: false,
    sortBy: 'tvl',
    sortOrder: 'desc',
  },

  // 加载状态
  isLoadingLibraryStats: false,
  isLoadingMyStats: false,
  isLoadingProtocolVaults: false,
  isLoadingCommunityVaults: false,
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

    // Protocol vaults相关
    updateProtocolVaults: (state, action: PayloadAction<ProtocolVault[]>) => {
      state.protocolVaults = action.payload
    },

    // Community vaults相关
    updateCommunityVaults: (state, action: PayloadAction<CommunityVault[]>) => {
      state.communityVaults = action.payload
    },

    updateCommunityVaultsFilter: (state, action: PayloadAction<Partial<CommunityVaultFilter>>) => {
      state.communityVaultsFilter = {
        ...state.communityVaultsFilter,
        ...action.payload,
      }
    },

    // 加载状态相关
    setLoadingLibraryStats: (state, action: PayloadAction<boolean>) => {
      state.isLoadingLibraryStats = action.payload
    },

    setLoadingMyStats: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMyStats = action.payload
    },

    setLoadingProtocolVaults: (state, action: PayloadAction<boolean>) => {
      state.isLoadingProtocolVaults = action.payload
    },

    setLoadingCommunityVaults: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCommunityVaults = action.payload
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
  updateProtocolVaults,
  updateCommunityVaults,
  updateCommunityVaultsFilter,
  setLoadingLibraryStats,
  setLoadingMyStats,
  setLoadingProtocolVaults,
  setLoadingCommunityVaults,
  resetVaultsState,
} = vaultsSlice.actions

export default vaultsSlice.reducer
