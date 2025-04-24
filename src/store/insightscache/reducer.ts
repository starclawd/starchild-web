import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InsightsCacheState {
  currentInsightToken: string;
}

const initialState: InsightsCacheState = {
  currentInsightToken: '',
};

export const insightsCacheSlice = createSlice({
  name: 'insightsCache',
  initialState,
  reducers: {
    updateCurrentInsightToken: (state, action: PayloadAction<string>) => {
      state.currentInsightToken = action.payload;
    },
  },
});

export const { updateCurrentInsightToken } = insightsCacheSlice.actions;

export default insightsCacheSlice.reducer; 