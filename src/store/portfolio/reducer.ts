import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VaultLpInfo, VaultTransactionHistory } from 'api/vaults'

export interface PortfolioState {
  vaultLpInfoList: VaultLpInfo[]
  isLoadingVaultLpInfoList: boolean
  transactionHistoryList: VaultTransactionHistory[]
  isLoadingTransactionHistoryList: boolean
}

const initialState: PortfolioState = {
  vaultLpInfoList: [],
  isLoadingVaultLpInfoList: false,
  transactionHistoryList: [],
  isLoadingTransactionHistoryList: false,
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
} = portfolioSlice.actions

export default portfolioSlice.reducer
