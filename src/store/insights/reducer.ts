import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InsightsDataType, InsightsListDataType, KlineSubDataType } from './insights.d';

export interface InsightsState {
  insightsList: InsightsDataType[];
  klineSubData: KlineSubDataType | null;
  currentShowId: string;
  markerScrollPoint: number | null;
  markedReadList: string[];
  isLoadingInsights: boolean;
}

const initialState: InsightsState = {
  klineSubData: null,
  insightsList: [],
  currentShowId: '',
  markerScrollPoint: null,
  markedReadList: [],
  isLoadingInsights: true,
};

export const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    updateAllInsightsDataWithReplace: (state, action: PayloadAction<InsightsDataType[]>) => {
      state.insightsList = [...action.payload].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    updateAllInsightsData: (state, action: PayloadAction<InsightsDataType>) => {
      state.insightsList = [...state.insightsList, action.payload].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
    updateMarkedReadList: (state, action: PayloadAction<string>) => {
      if (!state.markedReadList.includes(action.payload)) {
        state.markedReadList.push(action.payload);
      }
    },
    resetMarkedReadList: (state) => {
      state.markedReadList = [];
    },
    updateIsLoadingInsights: (state, action: PayloadAction<boolean>) => {
      state.isLoadingInsights = action.payload
    },
  },
});

export const { 
  updateAllInsightsData, 
  updateKlineSubData, 
  updateCurrentShowId, 
  updateMarkerScrollPoint, 
  updateAllInsightsDataWithReplace,
  updateMarkedReadList,
  resetMarkedReadList,
  updateIsLoadingInsights
} = insightsSlice.actions;

export default insightsSlice.reducer; 