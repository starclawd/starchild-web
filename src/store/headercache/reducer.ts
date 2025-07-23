import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface HeadercacheState {
  isFixMenu: boolean
  currentActiveNavKey: string
}

const initialState: HeadercacheState = {
  isFixMenu: false,
  currentActiveNavKey: '',
}

export const headercacheSlice = createSlice({
  name: 'headercache',
  initialState,
  reducers: {
    updateIsFixMenu: (state, action: PayloadAction<boolean>) => {
      state.isFixMenu = action.payload
    },
    updateCurrentActiveNavKey: (state, action: PayloadAction<string>) => {
      state.currentActiveNavKey = action.payload
    },
  },
})

export const { updateIsFixMenu, updateCurrentActiveNavKey } = headercacheSlice.actions

export default headercacheSlice.reducer
