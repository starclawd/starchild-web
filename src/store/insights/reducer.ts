import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BinanceSymbolsDataType, CoingeckoCoinIdMapDataType, KlineSubDataType } from './insights.d'
import { AgentOverviewDetailDataType } from 'store/myagent/myagent'

export interface InsightsState {
  klineSubData: KlineSubDataType | null
  coingeckoCoinIdMap: CoingeckoCoinIdMapDataType[]
  binanceSymbols: BinanceSymbolsDataType[]
  systemSignalOverviewList: AgentOverviewDetailDataType[]
  isLoadingSystemSignalOverview: boolean
  systemSignalList: AgentOverviewDetailDataType[]
}

const initialState: InsightsState = {
  klineSubData: null,
  coingeckoCoinIdMap: [],
  binanceSymbols: [],
  systemSignalOverviewList: [],
  isLoadingSystemSignalOverview: false,
  systemSignalList: [],
}

export const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    updateKlineSubData: (state, action: PayloadAction<KlineSubDataType | null>) => {
      state.klineSubData = action.payload
    },
    updateCoingeckoCoinIdMap: (state, action: PayloadAction<CoingeckoCoinIdMapDataType[]>) => {
      state.coingeckoCoinIdMap = action.payload
    },
    updateBinanceSymbols: (state, action: PayloadAction<BinanceSymbolsDataType[]>) => {
      state.binanceSymbols = action.payload
    },
    updateSystemSignalOverviewList: (state, action: PayloadAction<AgentOverviewDetailDataType[]>) => {
      state.systemSignalOverviewList = action.payload
    },
    updateIsLoadingSystemSignalOverview: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSystemSignalOverview = action.payload
    },
    updateSystemSignalList: (state, action: PayloadAction<AgentOverviewDetailDataType[]>) => {
      state.systemSignalList = action.payload
    },
  },
})

export const {
  updateKlineSubData,
  updateCoingeckoCoinIdMap,
  updateBinanceSymbols,
  updateSystemSignalOverviewList,
  updateIsLoadingSystemSignalOverview,
  updateSystemSignalList,
} = insightsSlice.actions

export default insightsSlice.reducer
