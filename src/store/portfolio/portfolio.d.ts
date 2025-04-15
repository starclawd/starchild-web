export interface EvmTokenBalanceDataType {
  token_address: string;
  symbol: string;
  name: string;
  logo: string;
  thumbnail: string;
  decimals: string;
  balance: string;
  possible_spam: string;
  verified_contract: boolean;
  balance_formatted: string;
  usd_price: number;
  usd_price_24hr_percent_change: number;
  usd_price_24hr_usd_change: number;
  usd_value: number;
  usd_value_24hr_usd_change: number;
  native_token: boolean;
  portfolio_percentage: number;
}

export interface EvmNetWorthDataType {
  total_networth_usd: string;
  chains: {
    chain: string;
    native_balance: string;
    native_balance_formatted: string;
    native_balance_usd: string;
    token_balance_usd: string;
    networth_usd: string;
  }[];  
}

export interface EvmProfitabilitySummaryDataType {
  total_count_of_trades: number;
  total_trade_volume: string;
  total_realized_profit_usd: string;
  total_realized_profit_percentage: number;
  total_buys: number;
  total_sells: number;
  total_sold_volume_usd: string;
  total_bought_volume_usd: string;
}

export interface EvmDefiPositionsSummaryDataType {
  protocol_name: string;
  protocol_id: string;
  protocol_url: string;
  protocol_logo: string;
  total_unclaimed_usd_value: string;
  positions: {
    label: string;
    tokens: {
      token_type: string;
      name: string;
      symbol: string;
      contract_address: string;
      decimals: number;
      logo: string;
      thumbnail: string;
      balance: string;
      balance_formatted: string;
      usd_price: number;
      usd_value: number;
      balance_usd: number;
      address: string;
      balance_usd: number;
      total_unclaimed_usd_value: number;
      position_details: {
        fee_tier: number;
        range_tnd: number;
        reserves: string[];
        current_price: number;
        is_in_range: boolean;
        price_upper: number;
        price_lower: number;
        price_label: string;
        liquidity: number;
        range_start: number;
        pool_address: string;
        position_key: string;
        asset_standard: string;
        apy: number;
      }[];
      is_debt: boolean;
      is_variable_debt: boolean;
      is_stable_debt: boolean;
      shares: string;
      reserve0: string;
      reserve1: string;
      factory: string;
      pair: string;
      share_of_pool: number;
    }[];
  }[];
} 

export enum EvmChain {
  ETHEREUM = 'eth',
  BSC = 'bsc',
  BASE = 'base',
  ARBITRUM = 'arbitrum',
}

export interface SolTokenBalanceDataType {
  associatedTokenAddress: string;
  mint: string;
  amountRaw: string;
  amount: string;
  decimals: number;
  name: string;
  symbol: string;
  logo: string;
}