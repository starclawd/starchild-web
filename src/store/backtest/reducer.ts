import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { KlineSubDataType } from 'store/insights/insights.d'
import { BacktestData, MOBILE_BACKTEST_TYPE, TaskDetailType } from './backtest'

export interface BackTestState {
  mobileBacktestType: MOBILE_BACKTEST_TYPE
  backtestData: BacktestData | null
  taskDetail: TaskDetailType | null
  tabIndex: number
}

const initialState: BackTestState = {
  mobileBacktestType: MOBILE_BACKTEST_TYPE.PRICE,
  backtestData: null,
  taskDetail: null,
  tabIndex: 0,
}

export const backTestSlice = createSlice({
  name: 'backTest',
  initialState,
  reducers: {
    updateMobileBacktestType: (state, action: PayloadAction<MOBILE_BACKTEST_TYPE>) => {
      state.mobileBacktestType = action.payload
    },
    updateBacktestData: (state, action: PayloadAction<BacktestData | null>) => {
      state.backtestData = action.payload
    },
    updateTaskDetail: (state, action: PayloadAction<TaskDetailType | null>) => {
      state.taskDetail = action.payload
    },
    updateTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload
    },
  },
})

export const { updateMobileBacktestType, updateBacktestData, updateTaskDetail, updateTabIndex } = backTestSlice.actions

export default backTestSlice.reducer
