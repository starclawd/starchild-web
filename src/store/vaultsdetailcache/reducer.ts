import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocalApproveWalletType } from './vaultdetailcache'

interface VaultDetailCacheState {
  localApproveWalletData: LocalApproveWalletType | null
}

const initialState: VaultDetailCacheState = {
  localApproveWalletData: null,
}

const vaultDetailCacheSlice = createSlice({
  name: 'vaultdetailcache',
  initialState,
  reducers: {
    setLocalApproveWalletData: (state, action: PayloadAction<LocalApproveWalletType | null>) => {
      state.localApproveWalletData = action.payload
    },
  },
})

export const { setLocalApproveWalletData } = vaultDetailCacheSlice.actions

export default vaultDetailCacheSlice.reducer
