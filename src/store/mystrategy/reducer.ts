import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StrategiesOverviewStrategy } from 'api/strategy'

export interface MyStrategyState {
  myStrategies: StrategiesOverviewStrategy[]
  isLoadingMyStrategies: boolean
  chartStrategyId: string | null
}

const initialState: MyStrategyState = {
  myStrategies: [],
  isLoadingMyStrategies: false,
  chartStrategyId: null,
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
    setChartStrategyId: (state, action: PayloadAction<string | null>) => {
      state.chartStrategyId = action.payload
    },
    resetMyStrategy: (state) => {
      return { ...initialState }
    },
  },
})

export const { updateMyStrategies, setLoadingMyStrategies, setChartStrategyId, resetMyStrategy } =
  myStrategySlice.actions

export default myStrategySlice.reducer
