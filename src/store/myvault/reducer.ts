import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TotalUserData } from 'api/strategy'
import { VaultLpInfo, VaultTransactionHistory } from 'api/vaults'
import { VaultChartTimeRange, VaultChartType } from 'store/vaultsdetail/vaultsdetail'

export interface MyVaultState {
  vaultLpInfoList: VaultLpInfo[]
  isLoadingVaultLpInfoList: boolean
  transactionHistoryList: VaultTransactionHistory[]
  isLoadingTransactionHistoryList: boolean
  chartVaultId: string | null
  chartType: VaultChartType
  vaultLpInfo: VaultLpInfo | null
  isLoadingVaultLpInfo: boolean
  totalUserData: TotalUserData | null
  isLoadingTotalUserData: boolean
}

const initialState: MyVaultState = {
  vaultLpInfoList: [],
  isLoadingVaultLpInfoList: false,
  transactionHistoryList: [],
  isLoadingTransactionHistoryList: false,
  chartVaultId: null,
  chartType: 'TVL',
  vaultLpInfo: null,
  isLoadingVaultLpInfo: false,
  totalUserData: null,
  isLoadingTotalUserData: false,
}

export const myVaultSlice = createSlice({
  name: 'myvault',
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
    resetMyVault: (state) => {
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
  updateVaultLpInfo,
  setLoadingVaultLpInfo,
  updateTotalUserData,
  setLoadingTotalUserData,
  resetMyVault,
} = myVaultSlice.actions

export default myVaultSlice.reducer
