import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_TEXT } from 'constants/locales';

interface CounterState {
  userLocale: LOCAL_TEXT | null;
}

const initialState: CounterState = {
  userLocale: LOCAL_TEXT.EN,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    updateUserLocale: (state, action: PayloadAction<LOCAL_TEXT>) => {
      state.userLocale = action.payload;
    },
  },
});

export const { updateUserLocale } = counterSlice.actions;

export default counterSlice.reducer; 