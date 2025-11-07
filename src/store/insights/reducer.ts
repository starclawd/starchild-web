import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BinanceSymbolsDataType, CoingeckoCoinIdMapDataType, KlineSubDataType } from './insights.d'

export interface InsightsState {
  klineSubData: KlineSubDataType | null
  coingeckoCoinIdMap: CoingeckoCoinIdMapDataType[]
  binanceSymbols: BinanceSymbolsDataType[]
}

const initialState: InsightsState = {
  klineSubData: null,
  coingeckoCoinIdMap: [],
  binanceSymbols: [],
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
  },
})

export const { updateKlineSubData, updateCoingeckoCoinIdMap, updateBinanceSymbols } = insightsSlice.actions

export default insightsSlice.reducer
