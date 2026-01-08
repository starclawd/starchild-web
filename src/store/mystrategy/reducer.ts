import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StrategiesOverviewDataType } from 'api/strategy'

export interface MyStrategyState {
  myStrategies: StrategiesOverviewDataType[]
  isLoadingMyStrategies: boolean
  chartStrategyId: string | null
  currentStrategyId: string
}

const initialState: MyStrategyState = {
  myStrategies: [],
  isLoadingMyStrategies: false,
  chartStrategyId: null,
  currentStrategyId: '',
}

export const myStrategySlice = createSlice({
  name: 'mystrategy',
  initialState,
  reducers: {
    updateMyStrategies: (state, action: PayloadAction<StrategiesOverviewDataType[]>) => {
      state.myStrategies = action.payload
    },
    setLoadingMyStrategies: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMyStrategies = action.payload
    },
    setChartStrategyId: (state, action: PayloadAction<string | null>) => {
      state.chartStrategyId = action.payload
    },
    setCurrentStrategyId: (state, action: PayloadAction<string>) => {
      state.currentStrategyId = action.payload
    },
    resetMyStrategy: (state) => {
      return { ...initialState }
    },
  },
})

export const { updateMyStrategies, setLoadingMyStrategies, setChartStrategyId, setCurrentStrategyId, resetMyStrategy } =
  myStrategySlice.actions

export default myStrategySlice.reducer
