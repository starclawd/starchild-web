import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GuestUserData } from './logincache.d'

export interface LogincacheState {
  authToken: string
  isTempStorageToken: boolean
  guestUser: GuestUserData | null
}

const initialState: LogincacheState = {
  authToken: '',
  isTempStorageToken: false,
  guestUser: null,
}

export const logincacheSlice = createSlice({
  name: 'logincache',
  initialState,
  reducers: {
    updateAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload
    },
    updateIsTempStorageToken: (state, action: PayloadAction<boolean>) => {
      state.isTempStorageToken = action.payload
    },
    updateGuestUser: (state, action: PayloadAction<GuestUserData | null>) => {
      state.guestUser = action.payload
    },
    clearGuestUser: (state) => {
      state.guestUser = null
    },
  },
})

export const { updateAuthToken, updateIsTempStorageToken, updateGuestUser, clearGuestUser } = logincacheSlice.actions

export default logincacheSlice.reducer
