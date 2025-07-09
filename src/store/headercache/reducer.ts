import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface HeadercacheState {
  isFixMenu: boolean
}

const initialState: HeadercacheState = {
  isFixMenu: false,
}

export const headercacheSlice = createSlice({
  name: 'headercache',
  initialState,
  reducers: {
    updateIsFixMenu: (state, action: PayloadAction<boolean>) => {
      state.isFixMenu = action.payload
    },
  },
})

export const { updateIsFixMenu } = headercacheSlice.actions

export default headercacheSlice.reducer
