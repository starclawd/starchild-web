import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InsightsCacheState {
  currentInsightToken: string;
  issShowCharts: boolean;
}

const initialState: InsightsCacheState = {
  currentInsightToken: '',
  issShowCharts: true,
};

export const insightsCacheSlice = createSlice({
  name: 'insightsCache',
  initialState,
  reducers: {
    updateCurrentInsightToken: (state, action: PayloadAction<string>) => {
      state.currentInsightToken = action.payload;
    },
    updateIssShowCharts: (state, action: PayloadAction<boolean>) => {
      state.issShowCharts = action.payload;
    },
  },
});

export const { updateCurrentInsightToken, updateIssShowCharts } = insightsCacheSlice.actions;

export default insightsCacheSlice.reducer; 