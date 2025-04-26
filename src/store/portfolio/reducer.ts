import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllNetworkWalletTokensDataType, NetWorthDataType, WalletHistoryDataType } from './portfolio';

export interface PortfolioState {
  currentWalletAddress: string;
  walletHistory: WalletHistoryDataType[];
  netWorthList: NetWorthDataType[];
  allNetworkWalletTokens: AllNetworkWalletTokensDataType[];
}

const initialState: PortfolioState = {
  currentWalletAddress: '',
  walletHistory: [],
  netWorthList: [],
  allNetworkWalletTokens: [],
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
    updateAllNetworkWalletToken: (state, action: PayloadAction<AllNetworkWalletTokensDataType[]>) => {
      state.allNetworkWalletTokens = action.payload;
    },
  },
});

export const {
  updateCurrentWalletAddress,
  updateWalletHistory,
  updateNetWorthList,
  updateAllNetworkWalletToken,
} = portfolioSlice.actions;

export default portfolioSlice.reducer; 