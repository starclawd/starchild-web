import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KlineSubDataType } from 'store/insights/insights.d';
import { BacktestData, MOBILE_BACKTEST_TYPE, TaskDetailType } from './backtest';

export interface BackTestState {
  mobileBacktestType: MOBILE_BACKTEST_TYPE;
  klineSubData: KlineSubDataType | null;
  backtestData: BacktestData | null;
  taskDetail: TaskDetailType | null;
}

const initialState: BackTestState = {
  mobileBacktestType: MOBILE_BACKTEST_TYPE.PRICE,
  klineSubData: null,
  backtestData: null,
  taskDetail: null,
};

export const backTestSlice = createSlice({
  name: 'backTest',
  initialState,
  reducers: {
    updateMobileBacktestType: (state, action: PayloadAction<MOBILE_BACKTEST_TYPE>) => {
      state.mobileBacktestType = action.payload;
    },
    updateKlineSubData: (state, action: PayloadAction<KlineSubDataType | null>) => {
      state.klineSubData = action.payload
    },
    updateBacktestData: (state, action: PayloadAction<BacktestData | null>) => {
      state.backtestData = action.payload
    },
    updateTaskDetail: (state, action: PayloadAction<TaskDetailType | null>) => {
      state.taskDetail = action.payload
    },
  },
});

export const { updateMobileBacktestType, updateKlineSubData, updateBacktestData, updateTaskDetail } = backTestSlice.actions;

export default backTestSlice.reducer; 