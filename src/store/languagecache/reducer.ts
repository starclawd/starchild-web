import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_TEXT } from 'constants/locales';

export interface LanguagecacheState {
  userLocale: LOCAL_TEXT | null;
}

const initialState: LanguagecacheState = {
  userLocale: LOCAL_TEXT.EN,
};

export const languagecacheSlice = createSlice({
  name: 'languagecache',
  initialState,
  reducers: {
    updateUserLocale: (state, action: PayloadAction<LOCAL_TEXT>) => {
      state.userLocale = action.payload;
    },
  },
});

export const { updateUserLocale } = languagecacheSlice.actions;

export default languagecacheSlice.reducer; 