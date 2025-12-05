import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  VaultDetailState,
  VaultDetailTabType,
  VaultPositionsOrdersSubTabType,
  VaultChartType,
  VaultChartTimeRange,
  ClaimData,
} from './vaultsdetail.d'
import type { VaultInfo, VaultLpInfo, VaultTransactionHistory } from 'api/vaults'
import { CHAIN_ID } from 'constants/chainInfo'

const initialClaimData: ClaimData = {
  [CHAIN_ID.ARBITRUM]: {
    claimableAmount: 0,
  },
  [CHAIN_ID.BASE]: {
    claimableAmount: 0,
  },
  [CHAIN_ID.OPTIMISM]: {
    claimableAmount: 0,
  },
  [CHAIN_ID.SEI]: {
    claimableAmount: 0,
  },
}

const initialState: VaultDetailState = {
  activeTab: 'strategy',
  currentVaultId: null,
  currentStrategyId: null,
  vaultInfo: null,
  vaultLpInfo: null,
  chartTimeRange: '30d',
  chartType: 'TVL',
  isLoadingChart: false,
  isLoadingVaultInfo: false,
  isLoadingVaultLpInfo: false,
  latestTransactionHistory: [],
  isLoadingLatestTransactionHistory: false,
  positionsOrdersActiveSubTab: 'positions',
  depositAndWithdrawTabIndex: 0,
  claimData: initialClaimData,
}

const vaultsdetailSlice = createSlice({
  name: 'vaultsdetail',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<VaultDetailTabType>) => {
      state.activeTab = action.payload
    },

    setCurrentVaultId: (state, action: PayloadAction<string | null>) => {
      state.currentVaultId = action.payload
    },

    setCurrentStrategyId: (state, action: PayloadAction<string | null>) => {
      state.currentStrategyId = action.payload
    },

    updateVaultInfo: (state, action: PayloadAction<VaultInfo | null>) => {
      state.vaultInfo = action.payload
    },

    setLoadingVaultInfo: (state, action: PayloadAction<boolean>) => {
      state.isLoadingVaultInfo = action.payload
    },

    setChartTimeRange: (state, action: PayloadAction<VaultChartTimeRange>) => {
      state.chartTimeRange = action.payload
    },

    setChartType: (state, action: PayloadAction<VaultChartType>) => {
      state.chartType = action.payload
    },

    setIsLoadingChart: (state, action: PayloadAction<boolean>) => {
      state.isLoadingChart = action.payload
    },

    updateVaultLpInfo: (state, action: PayloadAction<VaultLpInfo | null>) => {
      state.vaultLpInfo = action.payload
    },

    setLoadingVaultLpInfo: (state, action: PayloadAction<boolean>) => {
      state.isLoadingVaultLpInfo = action.payload
    },

    setPositionsOrdersActiveSubTab: (state, action: PayloadAction<VaultPositionsOrdersSubTabType>) => {
      state.positionsOrdersActiveSubTab = action.payload
    },

    setDepositAndWithdrawTabIndex: (state, action: PayloadAction<number>) => {
      state.depositAndWithdrawTabIndex = action.payload
    },
    updateClaimData: (state, action: PayloadAction<ClaimData>) => {
      state.claimData = action.payload
    },

    updateLatestTransactionHistory: (state, action: PayloadAction<VaultTransactionHistory[]>) => {
      state.latestTransactionHistory = action.payload
    },
    setLoadingLatestTransactionHistory: (state, action: PayloadAction<boolean>) => {
      state.isLoadingLatestTransactionHistory = action.payload
    },
    resetVaultDetail: (state) => {
      state.activeTab = 'strategy'
      state.currentVaultId = null
      state.currentStrategyId = '6b6f233c-7b6b-4268-82be-b86a691b3c9c'
      state.vaultInfo = null
      state.vaultLpInfo = null
      state.chartTimeRange = '30d'
      state.chartType = 'TVL'
      state.isLoadingChart = false
      state.isLoadingVaultInfo = false
      state.isLoadingVaultLpInfo = false
      state.positionsOrdersActiveSubTab = 'positions'
      state.claimData = initialClaimData
    },
  },
})

export const {
  setActiveTab,
  setCurrentVaultId,
  setCurrentStrategyId,
  updateVaultInfo,
  setLoadingVaultInfo,
  setChartTimeRange,
  setChartType,
  setIsLoadingChart,
  updateVaultLpInfo,
  setLoadingVaultLpInfo,
  setPositionsOrdersActiveSubTab,
  setDepositAndWithdrawTabIndex,
  updateClaimData,
  updateLatestTransactionHistory,
  setLoadingLatestTransactionHistory,
  resetVaultDetail,
} = vaultsdetailSlice.actions

export default vaultsdetailSlice.reducer
