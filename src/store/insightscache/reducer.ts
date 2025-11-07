import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PERIOD_OPTIONS } from './insightscache'

export interface insightscacheState {
  selectedPeriod: PERIOD_OPTIONS
}

const initialState: insightscacheState = {
  selectedPeriod: '1d',
}

export const insightscacheSlice = createSlice({
  name: 'insightscache',
  initialState,
  reducers: {
    updateSelectedPeriod: (state, action: PayloadAction<PERIOD_OPTIONS>) => {
      state.selectedPeriod = action.payload
    },
  },
})

export const { updateSelectedPeriod } = insightscacheSlice.actions

export default insightscacheSlice.reducer
