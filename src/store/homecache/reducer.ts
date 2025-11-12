import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface HomeCacheState {
  hasSkipped: boolean
}

const initialState: HomeCacheState = {
  hasSkipped: false,
}

export const homecacheSlice = createSlice({
  name: 'homecache',
  initialState,
  reducers: {
    setHasSkipped: (state, action: PayloadAction<boolean>) => {
      state.hasSkipped = action.payload
    },
  },
})

export const { setHasSkipped } = homecacheSlice.actions

export default homecacheSlice.reducer
