import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BackTestState {
  isShowPrice: boolean;
}

const initialState: BackTestState = {
  isShowPrice: true,
};

export const backTestSlice = createSlice({
  name: 'backTest',
  initialState,
  reducers: {
    updateIsShowPrice: (state, action: PayloadAction<boolean>) => {
      state.isShowPrice = action.payload;
    },
  },
});

export const { updateIsShowPrice } = backTestSlice.actions;

export default backTestSlice.reducer; 