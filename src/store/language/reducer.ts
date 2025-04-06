import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_TEXT } from 'constants/locales';

interface LanguageState {
  userLocale: LOCAL_TEXT | null;
}

const initialState: LanguageState = {
  userLocale: LOCAL_TEXT.EN,
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    updateUserLocale: (state, action: PayloadAction<LOCAL_TEXT>) => {
      state.userLocale = action.payload;
    },
  },
});

export const { updateUserLocale } = languageSlice.actions;

export default languageSlice.reducer; 