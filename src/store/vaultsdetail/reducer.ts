import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VaultDetailState, DETAIL_TYPE, CHART_TYPE, ClaimData } from './vaultsdetail.d'
import type { VaultInfo, VaultTransactionHistory } from 'api/vaults'
import type { StrategySignalDataType, StrategyPerformance } from 'api/strategy'
import { CHAIN_ID } from 'constants/chainInfo'
import { PaperTradingCurrentDataType } from 'store/createstrategy/createstrategy'

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
  activeTab: DETAIL_TYPE.STRATEGY,
  vaultInfo: null,
  strategyInfo: null,
  chartType: CHART_TYPE.TVL,
  isLoadingChart: false,
  isLoadingVaultInfo: false,
  isLoadingStrategyInfo: false,
  latestTransactionHistory: [],
  isLoadingLatestTransactionHistory: false,
  paperTradingPublicData: null,
  isLoadingPaperTradingPublic: false,
  depositAndWithdrawTabIndex: 0,
  claimData: initialClaimData,
  signalList: [],
  isLoadingSignalList: false,
}

const vaultsdetailSlice = createSlice({
  name: 'vaultsdetail',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<DETAIL_TYPE>) => {
      state.activeTab = action.payload
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

    setChartType: (state, action: PayloadAction<CHART_TYPE>) => {
      state.chartType = action.payload
    },

    setIsLoadingChart: (state, action: PayloadAction<boolean>) => {
      state.isLoadingChart = action.payload
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
    updatePaperTradingPublicData: (state, action: PayloadAction<PaperTradingCurrentDataType | null>) => {
      state.paperTradingPublicData = action.payload
    },
    setLoadingPaperTradingPublic: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPaperTradingPublic = action.payload
    },
    resetVaultDetail: (state) => {
      state.activeTab = DETAIL_TYPE.STRATEGY
      state.vaultInfo = null
      state.strategyInfo = null
      state.chartType = CHART_TYPE.EQUITY
      state.isLoadingChart = false
      state.isLoadingVaultInfo = false
      state.isLoadingStrategyInfo = false
      state.paperTradingPublicData = null
      state.isLoadingPaperTradingPublic = false
      state.claimData = initialClaimData
    },
  },
})

export const {
  setActiveTab,
  updateVaultInfo,
  setLoadingVaultInfo,
  updateStrategyInfo,
  setLoadingStrategyInfo,
  setChartType,
  setIsLoadingChart,
  setDepositAndWithdrawTabIndex,
  updateClaimData,
  updateLatestTransactionHistory,
  setLoadingLatestTransactionHistory,
  updatePaperTradingPublicData,
  setLoadingPaperTradingPublic,
  resetVaultDetail,
  updateSignalList,
  resetSignalList,
  setLoadingSignalList,
} = vaultsdetailSlice.actions

export default vaultsdetailSlice.reducer
