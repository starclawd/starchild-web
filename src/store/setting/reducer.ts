import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingState {
  watchlist: string[];
}

const initialState: SettingState = {
  watchlist: [],
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    updateWatchlist: (state, action: PayloadAction<string[]>) => {
      state.watchlist = action.payload;
    },
  },
});

export const {
  updateWatchlist,
} = settingSlice.actions;

export default settingSlice.reducer; 