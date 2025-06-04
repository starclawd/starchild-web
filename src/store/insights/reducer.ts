import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BinanceSymbolsDataType, CoingeckoCoinIdMapDataType, InsightsDataType, InsightsListDataType, KlineSubDataType } from './insights.d';

export interface InsightsState {
  insightsList: InsightsDataType[];
  klineSubData: KlineSubDataType | null;
  currentShowId: string;
  markerScrollPoint: number | null;
  markedReadList: string[];
  isLoadingInsights: boolean;
  coingeckoCoinIdMap: CoingeckoCoinIdMapDataType[];
  binanceSymbols: BinanceSymbolsDataType[];
  isShowInsightsDetail: boolean;
  currentInsightDetailData: InsightsDataType | null;
}

const initialState: InsightsState = {
  klineSubData: null,
  insightsList: [],
  currentShowId: '',
  markerScrollPoint: null,
  markedReadList: [],
  isLoadingInsights: true,
  coingeckoCoinIdMap: [],
  binanceSymbols: [],
  isShowInsightsDetail: false,
  currentInsightDetailData: null,
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
    updateKlineSubData: (state, action: PayloadAction<KlineSubDataType | null>) => {
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
    updateCoingeckoCoinIdMap: (state, action: PayloadAction<CoingeckoCoinIdMapDataType[]>) => {
      state.coingeckoCoinIdMap = action.payload
    },
    updateBinanceSymbols: (state, action: PayloadAction<BinanceSymbolsDataType[]>) => {
      state.binanceSymbols = action.payload
    },
    updateIsShowInsightsDetail: (state, action: PayloadAction<boolean>) => {
      state.isShowInsightsDetail = action.payload
    },
    updateCurrentInsightDetailData: (state, action: PayloadAction<InsightsDataType>) => {
      state.currentInsightDetailData = action.payload
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
  updateIsLoadingInsights,
  updateCoingeckoCoinIdMap,
  updateBinanceSymbols,
  updateIsShowInsightsDetail,
  updateCurrentInsightDetailData,
} = insightsSlice.actions;

export default insightsSlice.reducer; 