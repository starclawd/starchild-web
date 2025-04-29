import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InsightsListDataType } from './insights.d';

export interface InsightsState {
  allInsightsData: InsightsListDataType;
}

const initialState: InsightsState = {
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
  },
});

export const { updateAllInsightsData } = insightsSlice.actions;

export default insightsSlice.reducer; 