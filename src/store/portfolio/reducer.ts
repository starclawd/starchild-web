import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllEvmWalletTokensDataType, AllSolanaWalletTokensDataType, NetWorthDataType, SolanaWalletHistoryDataType, WalletHistoryDataType } from './portfolio';

export interface PortfolioState {
  currentWalletAddress: string;
  netWorthList: NetWorthDataType[];
  walletHistory: (WalletHistoryDataType | SolanaWalletHistoryDataType)[];
  allNetworkWalletTokens: (AllEvmWalletTokensDataType | AllSolanaWalletTokensDataType)[];
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
    updateWalletHistory: (state, action: PayloadAction<(WalletHistoryDataType | SolanaWalletHistoryDataType)[]>) => {
      state.walletHistory = action.payload;
    },
    updateNetWorthList: (state, action: PayloadAction<NetWorthDataType[]>) => {
      state.netWorthList = action.payload;
    },
    updateAllNetworkWalletToken: (state, action: PayloadAction<(AllEvmWalletTokensDataType | AllSolanaWalletTokensDataType)[]>) => {
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