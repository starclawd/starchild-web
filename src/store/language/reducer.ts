import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LOCAL_TEXT } from 'constants/locales'
import { LanguageState } from './language'

const initialState: LanguageState = {
  currentLocale: null,
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setCurrentLocale: (state, action: PayloadAction<LOCAL_TEXT | null>) => {
      state.currentLocale = action.payload
    },
  },
})

export const { setCurrentLocale } = languageSlice.actions

export default languageSlice.reducer
