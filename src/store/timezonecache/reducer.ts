import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface timezonecacheState {
  timezone: string
}

const initialState: timezonecacheState = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}

export const timezonecacheSlice = createSlice({
  name: 'timezonecache',
  initialState,
  reducers: {
    updateTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload
    },
  },
})

export const { updateTimezone } = timezonecacheSlice.actions

export default timezonecacheSlice.reducer
