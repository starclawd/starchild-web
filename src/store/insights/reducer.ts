import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InsightsDataType, InsightsListDataType, KlineSubDataType } from './insights.d';

export interface InsightsState {
  allInsightsData: InsightsDataType[];
  klineSubData: KlineSubDataType | null;
  currentShowId: string;
  markerScrollPoint: number | null;
}

const initialState: InsightsState = {
  klineSubData: null,
  allInsightsData: [],
  currentShowId: '',
  markerScrollPoint: null,
};

export const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    updateAllInsightsData: (state, action: PayloadAction<InsightsDataType>) => {
      state.allInsightsData = [...state.allInsightsData, action.payload]
    },
    updateKlineSubData: (state, action: PayloadAction<KlineSubDataType>) => {
      state.klineSubData = action.payload
    },
    updateCurrentShowId: (state, action: PayloadAction<string>) => {
      state.currentShowId = action.payload
    },
    updateMarkerScrollPoint: (state, action: PayloadAction<number | null>) => {
      state.markerScrollPoint = action.payload
    },
  },
});

export const { updateAllInsightsData, updateKlineSubData, updateCurrentShowId, updateMarkerScrollPoint } = insightsSlice.actions;

export default insightsSlice.reducer; 