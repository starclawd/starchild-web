import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BinanceSymbolsDataType, CoingeckoCoinIdMapDataType, KlineSubDataType } from './insights.d'
import { AgentOverviewDetailDataType } from 'store/myagent/myagent'

export interface InsightsState {
  klineSubData: KlineSubDataType | null
  coingeckoCoinIdMap: CoingeckoCoinIdMapDataType[]
  binanceSymbols: BinanceSymbolsDataType[]
  systemSignalList: AgentOverviewDetailDataType[]
  isLoadingSystemSignals: boolean
}

const initialState: InsightsState = {
  klineSubData: null,
  coingeckoCoinIdMap: [],
  binanceSymbols: [],
  systemSignalList: [],
  isLoadingSystemSignals: false,
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
    updateSystemSignalList: (state, action: PayloadAction<AgentOverviewDetailDataType[]>) => {
      state.systemSignalList = action.payload
    },
    updateIsLoadingSystemSignals: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSystemSignals = action.payload
    },
  },
})

export const {
  updateKlineSubData,
  updateCoingeckoCoinIdMap,
  updateBinanceSymbols,
  updateSystemSignalList,
  updateIsLoadingSystemSignals,
} = insightsSlice.actions

export default insightsSlice.reducer
