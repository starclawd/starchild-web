import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MyVaultDataType } from './portfolio'

export interface PortfolioState {
  myVaults: MyVaultDataType[]
}

const initialState: PortfolioState = {
  myVaults: [],
}

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateMyVaults: (state, action: PayloadAction<MyVaultDataType[]>) => {
      state.myVaults = action.payload
    },
  },
})

export const { updateMyVaults } = portfolioSlice.actions

export default portfolioSlice.reducer
