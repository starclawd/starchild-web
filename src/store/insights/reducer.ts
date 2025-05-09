import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InsightsDataType, InsightsListDataType, KlineSubDataType } from './insights.d';

export interface InsightsState {
  allInsightsList: InsightsDataType[];
  klineSubData: KlineSubDataType | null;
  currentShowId: string;
  markerScrollPoint: number | null;
}

const initialState: InsightsState = {
  klineSubData: null,
  allInsightsList: [],
  currentShowId: '',
  markerScrollPoint: null,
};

export const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    updateAllInsightsDataWithReplace: (state, action: PayloadAction<InsightsDataType[]>) => {
      state.allInsightsList = [...action.payload]
    },
    updateAllInsightsData: (state, action: PayloadAction<InsightsDataType>) => {
      state.allInsightsList = [...state.allInsightsList, action.payload]
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

export const { updateAllInsightsData, updateKlineSubData, updateCurrentShowId, updateMarkerScrollPoint, updateAllInsightsDataWithReplace } = insightsSlice.actions;

export default insightsSlice.reducer; 