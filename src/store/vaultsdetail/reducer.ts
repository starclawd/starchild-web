import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VaultDetailState, VaultDetailTabType } from './vaultsdetail.d'

const initialState: VaultDetailState = {
  activeTab: 'strategy',
  currentVaultId: null,
  chartTimeRange: 'all_time',
  isLoadingChart: false,
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
    
    setChartTimeRange: (state, action: PayloadAction<'24h' | '7d' | '30d' | 'all_time'>) => {
      state.chartTimeRange = action.payload
    },
    
    setIsLoadingChart: (state, action: PayloadAction<boolean>) => {
      state.isLoadingChart = action.payload
    },
    
    resetVaultDetail: (state) => {
      state.activeTab = 'strategy'
      state.currentVaultId = null
      state.chartTimeRange = 'all_time'
      state.isLoadingChart = false
    },
  },
})

export const {
  setActiveTab,
  setCurrentVaultId,
  setChartTimeRange,
  setIsLoadingChart,
  resetVaultDetail,
} = vaultsdetailSlice.actions

export default vaultsdetailSlice.reducer
