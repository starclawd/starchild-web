import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetWorthDataType, WalletHistoryDataType } from './portfolio';

export interface PortfolioState {
  currentWalletAddress: string;
  walletHistory: WalletHistoryDataType[];
  netWorthList: NetWorthDataType[];
}

const initialState: PortfolioState = {
  currentWalletAddress: '',
  walletHistory: [],
  netWorthList: [],
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateCurrentWalletAddress: (state, action: PayloadAction<string>) => {
      state.currentWalletAddress = action.payload;
    },
    updateWalletHistory: (state, action: PayloadAction<WalletHistoryDataType[]>) => {
      state.walletHistory = action.payload;
    },
    updateNetWorthList: (state, action: PayloadAction<NetWorthDataType[]>) => {
      state.netWorthList = action.payload;
    },
  },
});

export const {
  updateCurrentWalletAddress,
  updateWalletHistory,
  updateNetWorthList,
} = portfolioSlice.actions;

export default portfolioSlice.reducer; 