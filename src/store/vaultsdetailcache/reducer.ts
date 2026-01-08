import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocalApproveWalletType } from './vaultdetailcache'

interface VaultDetailCacheState {
  localApproveWalletData: LocalApproveWalletType | null
  isShowStrategyMarket: boolean
}

const initialState: VaultDetailCacheState = {
  localApproveWalletData: null,
  isShowStrategyMarket: false,
}

const vaultDetailCacheSlice = createSlice({
  name: 'vaultdetailcache',
  initialState,
  reducers: {
    setLocalApproveWalletData: (state, action: PayloadAction<LocalApproveWalletType | null>) => {
      state.localApproveWalletData = action.payload
    },
    setIsShowStrategyMarket: (state, action: PayloadAction<boolean>) => {
      state.isShowStrategyMarket = action.payload
    },
  },
})

export const { setLocalApproveWalletData, setIsShowStrategyMarket } = vaultDetailCacheSlice.actions

export default vaultDetailCacheSlice.reducer
