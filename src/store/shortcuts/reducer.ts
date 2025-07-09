import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AI_STYLE_TYPE, ShortcutDataType } from './shortcuts.d'

export interface ShortcutsState {
  shortcuts: ShortcutDataType[]
  aiStyleType: AI_STYLE_TYPE
}

const initialState: ShortcutsState = {
  shortcuts: [],
  aiStyleType: AI_STYLE_TYPE.EXPLANATORY,
}

export const shortcutsSlice = createSlice({
  name: 'shortcuts',
  initialState,
  reducers: {
    updateShortcuts: (state, action: PayloadAction<ShortcutDataType[]>) => {
      state.shortcuts = action.payload
    },
    changeAiStyleType: (state, action: PayloadAction<AI_STYLE_TYPE>) => {
      state.aiStyleType = action.payload
    },
  },
})

export const { updateShortcuts, changeAiStyleType } = shortcutsSlice.actions

export default shortcutsSlice.reducer
