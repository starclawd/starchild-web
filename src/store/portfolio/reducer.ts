import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EvmDefiPositionsSummaryDataType, EvmNetWorthDataType, EvmProfitabilitySummaryDataType, EvmTokenBalanceDataType, SolTokenBalanceDataType } from './portfolio';

export interface PortfolioState {
  currentWalletAddress: string;
  evmWalletTokenList: EvmTokenBalanceDataType[];
  evmWalletNetWorth: EvmNetWorthDataType;
  evmWalletProfitabilitySummary: EvmProfitabilitySummaryDataType;
  evmDefiPositionsSummary: EvmDefiPositionsSummaryDataType;
  solWalletTokenList: SolTokenBalanceDataType[];
}

const initialState: PortfolioState = {
  currentWalletAddress: '',
  evmWalletTokenList: [],
  evmWalletNetWorth: {
    total_networth_usd: '',
    chains: [],
  },
  evmWalletProfitabilitySummary: {
    total_count_of_trades: 0,
    total_trade_volume: '',
    total_realized_profit_usd: '',
    total_realized_profit_percentage: 0,
    total_buys: 0,
    total_sells: 0,
    total_sold_volume_usd: '',
    total_bought_volume_usd: '',
  },
  evmDefiPositionsSummary: {
    protocol_name: '',
    protocol_id: '',
    protocol_url: '',
    protocol_logo: '',
    total_unclaimed_usd_value: '',
    positions: [],
  },
  solWalletTokenList: [],
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateCurrentWalletAddress: (state, action: PayloadAction<string>) => {
      state.currentWalletAddress = action.payload;
    },
    updateEvmWalletTokenList: (state, action: PayloadAction<EvmTokenBalanceDataType[]>) => {
      state.evmWalletTokenList = action.payload;
    },
    updateEvmWalletNetWorth: (state, action: PayloadAction<EvmNetWorthDataType>) => {
      state.evmWalletNetWorth = action.payload;
    },
    updateEvmWalletProfitabilitySummary: (state, action: PayloadAction<EvmProfitabilitySummaryDataType>) => {
      state.evmWalletProfitabilitySummary = action.payload;
    },
    updateEvmDefiPositionsSummary: (state, action: PayloadAction<EvmDefiPositionsSummaryDataType>) => {
      state.evmDefiPositionsSummary = action.payload;
    },
    updateSolWalletTokenList: (state, action: PayloadAction<SolTokenBalanceDataType[]>) => {
      state.solWalletTokenList = action.payload;
    },
  },
});

export const { updateCurrentWalletAddress, updateEvmWalletTokenList, updateEvmWalletNetWorth, updateEvmWalletProfitabilitySummary, updateEvmDefiPositionsSummary, updateSolWalletTokenList } = portfolioSlice.actions;

export default portfolioSlice.reducer; 