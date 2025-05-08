import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InsightsListDataType, KlineSubDataType } from './insights.d';

export interface InsightsState {
  allInsightsData: InsightsListDataType;
  klineSubData: KlineSubDataType | null;
  currentShowId: string;
  markerScrollPoint: number | null;
}

const initialState: InsightsState = {
  klineSubData: null,
  allInsightsData: {
    list: [],
    totalSize: 0,
  },
  currentShowId: '',
  markerScrollPoint: null,
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