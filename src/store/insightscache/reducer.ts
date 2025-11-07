import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InsightTokenDataType, PERIOD_OPTIONS } from './insightscache'

export interface insightscacheState {
  currentInsightTokenData: InsightTokenDataType
  selectedPeriod: PERIOD_OPTIONS
}

const initialState: insightscacheState = {
  currentInsightTokenData: {
    symbol: '',
    isBinanceSupport: false,
  },
  selectedPeriod: '1d',
}

export const insightscacheSlice = createSlice({
  name: 'insightscache',
  initialState,
  reducers: {
    updateCurrentInsightToken: (state, action: PayloadAction<InsightTokenDataType>) => {
      state.currentInsightTokenData = action.payload
    },
    updateSelectedPeriod: (state, action: PayloadAction<PERIOD_OPTIONS>) => {
      state.selectedPeriod = action.payload
    },
  },
})

export const { updateCurrentInsightToken, updateSelectedPeriod } = insightscacheSlice.actions

export default insightscacheSlice.reducer
