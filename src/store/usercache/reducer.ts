import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserCacheState {
  authToken: string;
  tempStorageToken: boolean;
}

const initialState: UserCacheState = {
  authToken: '',
  tempStorageToken: false,
};

export const userCacheSlice = createSlice({
  name: 'userCache',
  initialState,
  reducers: {
    updateAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    updateTempStorageToken: (state, action: PayloadAction<boolean>) => {
      state.tempStorageToken = action.payload;
    },
  },
});

export const { updateAuthToken, updateTempStorageToken } = userCacheSlice.actions;

export default userCacheSlice.reducer; 