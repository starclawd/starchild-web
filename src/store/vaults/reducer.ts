import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  VaultsState,
  VaultLibraryStats,
  MyVaultStats,
  ProtocolVault,
  CommunityVault,
  CommunityVaultFilter,
  WalletInfo,
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

  // 钱包信息
  walletInfo: {
    address: null,
    network: null,
    chainId: null,
  },

  vaultsTabIndex: 0,

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

    clearMyVaultStats: (state) => {
      state.myVaultStats = null
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

    // 钱包信息相关
    updateWalletInfo: (state, action: PayloadAction<Partial<WalletInfo>>) => {
      state.walletInfo = {
        ...state.walletInfo,
        ...action.payload,
      }
    },

    setWalletAddress: (state, action: PayloadAction<string | null>) => {
      state.walletInfo.address = action.payload
    },

    setWalletNetwork: (state, action: PayloadAction<{ network: string | null; chainId: number | null }>) => {
      state.walletInfo.network = action.payload.network
      state.walletInfo.chainId = action.payload.chainId
    },

    disconnectWallet: (state) => {
      state.walletInfo = {
        address: null,
        network: null,
        chainId: null,
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

    updateVaultsTabIndex: (state, action: PayloadAction<number>) => {
      state.vaultsTabIndex = action.payload
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
  updateProtocolVaults,
  updateCommunityVaults,
  updateCommunityVaultsFilter,
  updateWalletInfo,
  setWalletAddress,
  setWalletNetwork,
  disconnectWallet,
  setLoadingLibraryStats,
  setLoadingMyStats,
  setLoadingProtocolVaults,
  setLoadingCommunityVaults,
  updateVaultsTabIndex,
  resetVaultsState,
} = vaultsSlice.actions

export default vaultsSlice.reducer
