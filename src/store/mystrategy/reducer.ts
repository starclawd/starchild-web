import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StrategiesOverviewDataType } from 'api/strategy'

export interface MyStrategyState {
  myStrategies: StrategiesOverviewDataType[]
  isLoadingMyStrategies: boolean
  chartStrategyId: string | null
  currentStrategyId: string
  // 所有关注的策略概览数据
  allFollowedStrategies: StrategiesOverviewDataType[]
  isLoadingAllFollowedStrategies: boolean
}

const initialState: MyStrategyState = {
  myStrategies: [],
  isLoadingMyStrategies: false,
  chartStrategyId: null,
  currentStrategyId: '',
  allFollowedStrategies: [],
  isLoadingAllFollowedStrategies: false,
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
    // 所有关注的策略概览相关
    updateAllFollowedStrategies: (state, action: PayloadAction<StrategiesOverviewDataType[]>) => {
      state.allFollowedStrategies = action.payload
    },
    setLoadingAllFollowedStrategies: (state, action: PayloadAction<boolean>) => {
      state.isLoadingAllFollowedStrategies = action.payload
    },
    resetMyStrategy: (state) => {
      return { ...initialState }
    },
  },
})

export const {
  updateMyStrategies,
  setLoadingMyStrategies,
  setChartStrategyId,
  setCurrentStrategyId,
  updateAllFollowedStrategies,
  setLoadingAllFollowedStrategies,
  resetMyStrategy,
} = myStrategySlice.actions

export default myStrategySlice.reducer
