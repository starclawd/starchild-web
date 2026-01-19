import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VaultDetailState, DETAIL_TYPE, CHART_TYPE, ClaimData, OnchainBalanceData } from './vaultsdetail.d'
import type { VaultInfo, VaultTransactionHistory } from 'api/vaults'
import type { StrategySignalDataType, StrategiesOverviewDataType } from 'api/strategy'
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
  isFollowing: false,
  isLoadingFollowing: false,
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
  currentShareStrategyData: null,
  onchainBalance: null,
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

    updateStrategyInfo: (state, action: PayloadAction<StrategiesOverviewDataType | null>) => {
      state.strategyInfo = action.payload
    },

    setLoadingStrategyInfo: (state, action: PayloadAction<boolean>) => {
      state.isLoadingStrategyInfo = action.payload
    },

    setIsFollowing: (state, action: PayloadAction<boolean>) => {
      state.isFollowing = action.payload
    },

    setLoadingFollowing: (state, action: PayloadAction<boolean>) => {
      state.isLoadingFollowing = action.payload
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
    updateCurrentShareStrategyData: (state, action: PayloadAction<StrategiesOverviewDataType | null>) => {
      state.currentShareStrategyData = action.payload
    },
    updateOnchainBalance: (state, action: PayloadAction<OnchainBalanceData | null>) => {
      state.onchainBalance = action.payload
    },
    resetVaultDetail: (state) => {
      return { ...initialState }
    },
  },
})

export const {
  setActiveTab,
  updateVaultInfo,
  setLoadingVaultInfo,
  updateStrategyInfo,
  setLoadingStrategyInfo,
  setIsFollowing,
  setLoadingFollowing,
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
  updateCurrentShareStrategyData,
  updateOnchainBalance,
} = vaultsdetailSlice.actions

export default vaultsdetailSlice.reducer
