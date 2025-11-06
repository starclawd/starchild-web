import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInfoData, AUTH_TOKEN_SESSION, LOGIN_STATUS } from './login.d'

export interface LoginState {
  loginStatus: LOGIN_STATUS
  authTokenSession: string
  userInfo: UserInfoData
  isGetAuthToken: boolean
}

const authTokenSession = window.sessionStorage.getItem(AUTH_TOKEN_SESSION)
const initialState: LoginState = {
  loginStatus: LOGIN_STATUS.LOGINING,
  authTokenSession: authTokenSession || '',
  isGetAuthToken: false,
  userInfo: {
    userInfoId: '',
    aiChatKey: '',
    evmAddress: '',
    solanaAddress: '',
    telegramUserId: '',
    telegramUsername: '',
    telegramAvatar: '',
    telegramFirstName: '',
    telegramLastName: '',
    language: '',
    inWhitelist: false,
    burnAt: '',
    email: '',
    hasBindOrderly: false,
    hasOrderlyPrivateKey: false,
    hasVerifiedOrderly: false,
    primaryLoginType: '',
    walletType: '',
    walletAddress: '',
    secondaryWalletAddress: '',
    secondaryWalletType: '',
    userName: '',
    userAvatar: '',
    googleUserAvatar: '',
    googleUserName: '',
  },
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateLoginStatus: (state, action: PayloadAction<LOGIN_STATUS>) => {
      state.loginStatus = action.payload
    },
    updateAuthTokenSession: (state, action: PayloadAction<string>) => {
      window.sessionStorage.setItem(AUTH_TOKEN_SESSION, action.payload)
      state.authTokenSession = action.payload
    },
    updateUserInfo: (state, action: PayloadAction<UserInfoData>) => {
      state.userInfo = action.payload
    },
    updateIsGetAuthToken: (state, action: PayloadAction<boolean>) => {
      state.isGetAuthToken = action.payload
    },
  },
})

export const { updateLoginStatus, updateAuthTokenSession, updateUserInfo, updateIsGetAuthToken } = loginSlice.actions

export default loginSlice.reducer
