import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AUTH_TOKEN_SESSION, LOGIN_STATUS } from './login.d';

export interface LoginState {
  loginStatus: LOGIN_STATUS;
  authTokenSession: string;
}

const authTokenSession = window.sessionStorage.getItem(AUTH_TOKEN_SESSION)
const initialState: LoginState = {
  loginStatus: LOGIN_STATUS.LOGINING,
  authTokenSession: authTokenSession || '',
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateLoginStatus: (state, action: PayloadAction<LOGIN_STATUS>) => {
      state.loginStatus = action.payload;
    },
    updateAuthTokenSession: (state, action: PayloadAction<string>) => {
      window.sessionStorage.setItem(AUTH_TOKEN_SESSION, action.payload)
      state.authTokenSession = action.payload;
    },
  },
});

export const { updateLoginStatus, updateAuthTokenSession } = loginSlice.actions;

export default loginSlice.reducer; 