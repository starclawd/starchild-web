import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TotalUserData } from 'api/strategy'
import { VaultLpInfo, VaultTransactionHistory } from 'api/vaults'

export type VaultChartType = 'TVL' | 'Index' | 'PNL' | 'EQUITY'
export type VaultChartTimeRange = '24h' | '7d' | '30d' | 'all_time'

export interface PortfolioState {
  vaultLpInfoList: VaultLpInfo[]
  isLoadingVaultLpInfoList: boolean
  transactionHistoryList: VaultTransactionHistory[]
  isLoadingTransactionHistoryList: boolean
  chartVaultId: string | null
  chartType: VaultChartType
  chartTimeRange: VaultChartTimeRange
  vaultLpInfo: VaultLpInfo | null
  isLoadingVaultLpInfo: boolean
  totalUserData: TotalUserData | null
  isLoadingTotalUserData: boolean
}

const initialState: PortfolioState = {
  vaultLpInfoList: [],
  isLoadingVaultLpInfoList: false,
  transactionHistoryList: [],
  isLoadingTransactionHistoryList: false,
  chartVaultId: null,
  chartType: 'TVL',
  chartTimeRange: '30d',
  vaultLpInfo: null,
  isLoadingVaultLpInfo: false,
  totalUserData: null,
  isLoadingTotalUserData: false,
}

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateVaultLpInfoList: (state, action: PayloadAction<VaultLpInfo[]>) => {
      state.vaultLpInfoList = action.payload
    },
    setLoadingVaultLpInfoList: (state, action: PayloadAction<boolean>) => {
      state.isLoadingVaultLpInfoList = action.payload
    },
    updateTransactionHistoryList: (state, action: PayloadAction<VaultTransactionHistory[]>) => {
      state.transactionHistoryList = action.payload
    },
    setLoadingTransactionHistoryList: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTransactionHistoryList = action.payload
    },
    setChartVaultId: (state, action: PayloadAction<string | null>) => {
      state.chartVaultId = action.payload
    },
    setChartType: (state, action: PayloadAction<VaultChartType>) => {
      state.chartType = action.payload
    },
    setChartTimeRange: (state, action: PayloadAction<VaultChartTimeRange>) => {
      state.chartTimeRange = action.payload
    },
    updateVaultLpInfo: (state, action: PayloadAction<VaultLpInfo | null>) => {
      state.vaultLpInfo = action.payload
    },
    setLoadingVaultLpInfo: (state, action: PayloadAction<boolean>) => {
      state.isLoadingVaultLpInfo = action.payload
    },
    updateTotalUserData: (state, action: PayloadAction<TotalUserData | null>) => {
      state.totalUserData = action.payload
    },
    setLoadingTotalUserData: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTotalUserData = action.payload
    },
    resetPortfolio: (state) => {
      return { ...initialState }
    },
  },
})

export const {
  updateVaultLpInfoList,
  setLoadingVaultLpInfoList,
  updateTransactionHistoryList,
  setLoadingTransactionHistoryList,
  setChartVaultId,
  setChartType,
  setChartTimeRange,
  updateVaultLpInfo,
  setLoadingVaultLpInfo,
  updateTotalUserData,
  setLoadingTotalUserData,
} = portfolioSlice.actions

export default portfolioSlice.reducer
