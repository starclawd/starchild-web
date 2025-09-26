import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PreferenceDataType } from './perference'

interface PerferenceState {
  perferenceData: PreferenceDataType
}

const initialState: PerferenceState = {
  perferenceData: {
    timezone: '',
    tradingExperience: '',
    aiExperience: '',
    watchlist: '',
    personalProfile: '',
    addresses: [],
  },
}

const perferenceSlice = createSlice({
  name: 'perference',
  initialState,
  reducers: {
    updatePreferenceData: (state, action: PayloadAction<any>) => {
      state.perferenceData = action.payload
    },
  },
})

export const { updatePreferenceData } = perferenceSlice.actions

export default perferenceSlice.reducer
