import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KlineSubDataType } from 'store/insights/insights.d';
import { BacktestData, TaskDetailType } from './backtest';

export interface BackTestState {
  isShowPrice: boolean;
  klineSubData: KlineSubDataType | null;
  backtestData: BacktestData | null;
  taskDetail: TaskDetailType | null;
}

const initialState: BackTestState = {
  isShowPrice: true,
  klineSubData: null,
  backtestData: null,
  taskDetail: null,
};

export const backTestSlice = createSlice({
  name: 'backTest',
  initialState,
  reducers: {
    updateIsShowPrice: (state, action: PayloadAction<boolean>) => {
      state.isShowPrice = action.payload;
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

export const { updateIsShowPrice, updateKlineSubData, updateBacktestData, updateTaskDetail } = backTestSlice.actions;

export default backTestSlice.reducer; 