import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LogincacheState {
  authToken: string;
  isTempStorageToken: boolean;
}

const initialState: LogincacheState = {
  authToken: '',
  isTempStorageToken: false,
};

export const logincacheSlice = createSlice({
  name: 'logincache',
  initialState,
  reducers: {
    updateAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    updateIsTempStorageToken: (state, action: PayloadAction<boolean>) => {
      state.isTempStorageToken = action.payload;
    },
  },
});

export const { updateAuthToken, updateIsTempStorageToken } = logincacheSlice.actions;

export default logincacheSlice.reducer; 