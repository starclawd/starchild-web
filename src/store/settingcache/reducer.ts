import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingCacheState {
  isShowRecommand: boolean;
}

const initialState: SettingCacheState = {
  isShowRecommand: true,
};

export const settingCacheSlice = createSlice({
  name: 'settingcache',
  initialState,
  reducers: {
    updateIsShowRecommand: (state, action: PayloadAction<boolean>) => {
      state.isShowRecommand = action.payload;
    },
  },
});

export const {
  updateIsShowRecommand,
} = settingCacheSlice.actions;

export default settingCacheSlice.reducer; 