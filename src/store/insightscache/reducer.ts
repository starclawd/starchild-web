import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InsightTokenDataType, PERIOD_OPTIONS } from './insightscache';

export interface insightscacheState {
  currentInsightTokenData: InsightTokenDataType;
  issShowCharts: boolean;
  selectedPeriod: PERIOD_OPTIONS;
  isNotiEnable: boolean;
}

const initialState: insightscacheState = {
  currentInsightTokenData: {
    symbol: '',
    isBinanceSupport: false
  },
  issShowCharts: true,
  selectedPeriod: '1d',
  isNotiEnable: true,
};

export const insightscacheSlice = createSlice({
  name: 'insightscache',
  initialState,
  reducers: {
    updateCurrentInsightToken: (state, action: PayloadAction<InsightTokenDataType>) => {
      state.currentInsightTokenData = action.payload;
    },
    updateIssShowCharts: (state, action: PayloadAction<boolean>) => {
      state.issShowCharts = action.payload;
    },
    updateSelectedPeriod: (state, action: PayloadAction<PERIOD_OPTIONS>) => {
      state.selectedPeriod = action.payload;
    },
    updateIsNotiEnable: (state, action: PayloadAction<boolean>) => {
      state.isNotiEnable = action.payload;
    },
  },
});

export const { updateCurrentInsightToken, updateIssShowCharts, updateSelectedPeriod, updateIsNotiEnable } = insightscacheSlice.actions;

export default insightscacheSlice.reducer; 