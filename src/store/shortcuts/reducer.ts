import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShortcutDataType } from './shortcuts.d';

export interface ShortcutsState {
  shortcuts: ShortcutDataType[];
}

const initialState: ShortcutsState = {
  shortcuts: [],
};

export const shortcutsSlice = createSlice({
  name: 'shortcuts',
  initialState,
  reducers: {
    updateShortcuts: (state, action: PayloadAction<ShortcutDataType[]>) => {
      state.shortcuts = action.payload;
    },
  },
});

export const {
  updateShortcuts,
} = shortcutsSlice.actions;

export default shortcutsSlice.reducer; 