import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LOGIN_STATUS } from './login.d';

export interface LoginState {
  loginStatus: LOGIN_STATUS;
}

const initialState: LoginState = {
  loginStatus: LOGIN_STATUS.LOGINING,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateLoginStatus: (state, action: PayloadAction<LOGIN_STATUS>) => {
      state.loginStatus = action.payload;
    },
  },
});

export const { updateLoginStatus } = loginSlice.actions;

export default loginSlice.reducer; 