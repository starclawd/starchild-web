import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LOGIN_STATUS } from './login.d';

export interface LoginState {
  loginStatus: LOGIN_STATUS;
  authTokenSession: string;
}

const initialState: LoginState = {
  loginStatus: LOGIN_STATUS.LOGINING,
  authTokenSession: '',
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateLoginStatus: (state, action: PayloadAction<LOGIN_STATUS>) => {
      state.loginStatus = action.payload;
    },
    updateAuthTokenSession: (state, action: PayloadAction<string>) => {
      state.authTokenSession = action.payload;
    },
  },
});

export const { updateLoginStatus, updateAuthTokenSession } = loginSlice.actions;

export default loginSlice.reducer; 