import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KlineSubDataType } from 'store/insights/insights.d';

export interface BackTestState {
  isShowPrice: boolean;
  klineSubData: KlineSubDataType | null;
}

const initialState: BackTestState = {
  isShowPrice: true,
  klineSubData: null,
};

export const backTestSlice = createSlice({
  name: 'backTest',
  initialState,
  reducers: {
    updateIsShowPrice: (state, action: PayloadAction<boolean>) => {
      state.isShowPrice = action.payload;
    },
    updateKlineSubData: (state, action: PayloadAction<KlineSubDataType | null>) => {
      state.klineSubData = action.payload
    },
  },
});

export const { updateIsShowPrice, updateKlineSubData } = backTestSlice.actions;

export default backTestSlice.reducer; 