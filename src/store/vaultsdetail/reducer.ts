import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  VaultDetailState,
  VaultDetailTabType,
  VaultPositionsOrdersSubTabType,
  VaultChartType,
  ClaimData,
} from './vaultsdetail.d'
import type { VaultInfo, VaultLpInfo, VaultTransactionHistory } from 'api/vaults'
import type { StrategySignalDataType, StrategyPerformance } from 'api/strategy'
import type { StrategyDetailDataType } from 'store/createstrategy/createstrategy.d'
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
  currentStrategyId: null,
  vaultInfo: null,
  strategyInfo: null,
  chartType: 'TVL',
  isLoadingChart: false,
  isLoadingVaultInfo: false,
  isLoadingStrategyInfo: false,
  latestTransactionHistory: [],
  isLoadingLatestTransactionHistory: false,
  positionsOrdersActiveSubTab: 'positions',
  depositAndWithdrawTabIndex: 0,
  claimData: initialClaimData,
  signalList: [],
  isLoadingSignalList: false,
}

const vaultsdetailSlice = createSlice({
  name: 'vaultsdetail',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<VaultDetailTabType>) => {
      state.activeTab = action.payload
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

    updateStrategyInfo: (state, action: PayloadAction<StrategyPerformance | null>) => {
      state.strategyInfo = action.payload
    },

    setLoadingStrategyInfo: (state, action: PayloadAction<boolean>) => {
      state.isLoadingStrategyInfo = action.payload
    },

    setChartType: (state, action: PayloadAction<VaultChartType>) => {
      state.chartType = action.payload
    },

    setIsLoadingChart: (state, action: PayloadAction<boolean>) => {
      state.isLoadingChart = action.payload
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
    updateSignalList: (state, action: PayloadAction<StrategySignalDataType[]>) => {
      state.signalList = [...action.payload, ...state.signalList]
    },
    setLoadingSignalList: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSignalList = action.payload
    },
    resetSignalList: (state) => {
      state.signalList = []
    },
    resetVaultDetail: (state) => {
      state.activeTab = 'strategy'
      state.currentStrategyId = null
      state.vaultInfo = null
      state.strategyInfo = null
      state.chartType = 'EQUITY'
      state.isLoadingChart = false
      state.isLoadingVaultInfo = false
      state.isLoadingStrategyInfo = false
      state.positionsOrdersActiveSubTab = 'positions'
      state.claimData = initialClaimData
    },
  },
})

export const {
  setActiveTab,
  setCurrentStrategyId,
  updateVaultInfo,
  setLoadingVaultInfo,
  updateStrategyInfo,
  setLoadingStrategyInfo,
  setChartType,
  setIsLoadingChart,
  setPositionsOrdersActiveSubTab,
  setDepositAndWithdrawTabIndex,
  updateClaimData,
  updateLatestTransactionHistory,
  setLoadingLatestTransactionHistory,
  resetVaultDetail,
  updateSignalList,
  resetSignalList,
  setLoadingSignalList,
} = vaultsdetailSlice.actions

export default vaultsdetailSlice.reducer
