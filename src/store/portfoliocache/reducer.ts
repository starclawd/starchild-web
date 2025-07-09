import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PortfoliocacheState {
  showRecentTransactions: boolean
}

const initialState: PortfoliocacheState = {
  showRecentTransactions: false,
}

export const portfoliocacheSlice = createSlice({
  name: 'portfoliocache',
  initialState,
  reducers: {
    updateShowRecentTransactions: (state, action: PayloadAction<boolean>) => {
      state.showRecentTransactions = action.payload
    },
  },
})

export const { updateShowRecentTransactions } = portfoliocacheSlice.actions

export default portfoliocacheSlice.reducer
