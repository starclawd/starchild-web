import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StrategiesOverviewStrategy } from 'api/strategy'

export interface MyStrategyState {
  myStrategies: StrategiesOverviewStrategy[]
  isLoadingMyStrategies: boolean
}

const initialState: MyStrategyState = {
  myStrategies: [],
  isLoadingMyStrategies: false,
}

export const myStrategySlice = createSlice({
  name: 'mystrategy',
  initialState,
  reducers: {
    updateMyStrategies: (state, action: PayloadAction<StrategiesOverviewStrategy[]>) => {
      state.myStrategies = action.payload
    },
    setLoadingMyStrategies: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMyStrategies = action.payload
    },
    resetMyStrategy: (state) => {
      return { ...initialState }
    },
  },
})

export const { updateMyStrategies, setLoadingMyStrategies, resetMyStrategy } = myStrategySlice.actions

export default myStrategySlice.reducer
