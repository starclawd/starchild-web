import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InsightsListDataType, KlineSubDataType } from './insights.d';

export interface InsightsState {
  allInsightsData: InsightsListDataType;
  klineSubData: KlineSubDataType | null;
}

const initialState: InsightsState = {
  klineSubData: null,
  allInsightsData: {
    list: [],
    totalSize: 0,
  },
};

export const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    updateAllInsightsData: (state, action: PayloadAction<InsightsListDataType>) => {
      const list = state.allInsightsData.list
      state.allInsightsData.list = [...list, ...action.payload.list]
      state.allInsightsData.totalSize = action.payload.totalSize
    },
    updateKlineSubData: (state, action: PayloadAction<KlineSubDataType>) => {
      state.klineSubData = action.payload
    },
  },
});

export const { updateAllInsightsData, updateKlineSubData } = insightsSlice.actions;

export default insightsSlice.reducer; 