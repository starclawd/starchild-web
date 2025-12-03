import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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
}

const initialState: PortfolioState = {
  vaultLpInfoList: [],
  isLoadingVaultLpInfoList: false,
  transactionHistoryList: [],
  isLoadingTransactionHistoryList: false,
  chartVaultId: null,
  chartType: 'TVL',
  chartTimeRange: '30d',
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
} = portfolioSlice.actions

export default portfolioSlice.reducer
