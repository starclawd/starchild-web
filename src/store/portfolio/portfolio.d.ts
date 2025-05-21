import { Chain } from "constants/chainInfo";

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

export interface EvmWalletOriginalHistoryDataType {
  block_hash: string;
  block_number: string;
  block_timestamp: string;
  category: string;
  erc20_transfers: {
    address: string;
    direction: string;
    from_address: string;
    from_address_entity: string | null;
    from_address_entity_logo: string | null;
    from_address_label: string | null;
    log_index: number;
    possible_spam: boolean;
    security_score: string | null;
    to_address: string;
    to_address_entity: string | null;
    to_address_entity_logo: string | null;
    to_address_label: string | null;
    token_decimals: string;
    token_logo: string | null;
    token_name: string;
    token_symbol: string;
    value: string;
    value_formatted: string;
    verified_contract: boolean;
  }[];
  from_address: string;
  from_address_entity: string | null;
  from_address_entity_logo: string | null;
  from_address_label: string | null;
  gas: string;
  gas_price: string;
  hash: string;
  method_label: string;
  native_transfers: {
    from_address_entity: string;
    from_address_entity_logo: string;
    from_address: string;
    from_address_label: string;
    to_address_entity: string;
    to_address_entity_logo: string;
    to_address: string;
    to_address_label: string;
    value: string;
    value_formatted: string;
    direction: string;
    internal_transaction: string;
    token_symbol: string;
    token_logo: string;
  }[];
  nft_transfers: {
    amount: string;
    contract_type: string;
    direction: string;
    from_address: string;
    from_address_entity: string;
    from_address_entity_logo: string;
    from_address_label: string;
    log_index: number;
    operator: string | null;
    possible_spam: boolean;
    to_address: string;
    to_address_entity: string | null;
    to_address_entity_logo: string | null;
    to_address_label: string | null;
    token_address: string;
    token_id: string;
    transaction_type: string;
    value: string;
    verified_collection: boolean;
  }[];
  nonce: string;
  possible_spam: boolean;
  receipt_contract_address: string | null;
  receipt_cumulative_gas_used: string;
  receipt_gas_used: string;
  receipt_status: string;
  summary: string;
  to_address: string;
  to_address_entity: string | null;
  to_address_entity_logo: string | null;
  to_address_label: string | null;
  transaction_fee: string;
  transaction_index: string;
  value: string;
}

export interface WalletHistoryDataType {
  chain: Chain;
  blockTimestamp: number;
  originalResult: EvmWalletOriginalHistoryDataType
}

export interface SolanaWalletOriginalHistoryDataType {
  block_time: number;
  fee: number;
  parsed_instructions: {
    program: string;
    program_id: string;
    type: string;
  }[];
  program_ids: string[];
  signer: string[];
  slot: number;
  status: string;
  time: string;
  tx_hash: string;
  transactionType?: string;
  subCategory?: string;
  bought?: {
    symbol?: string;
    amount?: string;
  };
  sold?: {
    symbol?: string;
    amount?: string;
  };
}
export interface SolanaWalletHistoryDataType {
  chain: Chain;
  blockTimestamp: number;
  originalResult: SolanaWalletOriginalHistoryDataType
}

export interface SolanaWalletTransactionDetailDataType {
  success: boolean;
  data: {
    block_id: number;
    fee: number;
    reward: any[];
    sol_bal_change: {
      address: string;
      pre_balance: string;
      post_balance: string;
      change_amount: string;
    }[];
    token_bal_change: {
      address: string;
      change_type: string;
      decimals: number;
      change_amount: string;
      post_balance: string;
      pre_balance: number | string;
      token_address: string;
      owner: string;
      event_type?: string;
      post_owner: string;
      pre_owner: string;
    }[];
    tokens_involved: string[];
    parsed_instructions: {
      ins_index: number;
      parsed_type: string;
      type: string;
      program_id: string;
      program: string;
      outer_program_id: string | null;
      outer_ins_index: number;
      data_raw: any;
      accounts: string[];
      activities: {
        name: string;
        activity_type: string;
        program_id: string;
        data: any;
        ins_index: number;
        outer_ins_index: number;
        outer_program_id: string | null;
        program_invoke_level: number;
        inst_type: string;
      }[];
      transfers: {
        source_owner: string;
        source: string;
        destination: string;
        destination_owner: string;
        transfer_type: string;
        token_address: string;
        decimals: number;
        amount_str: string;
        amount: number | string;
        program_id: string;
        outer_program_id: string | null;
        ins_index: number;
        outer_ins_index: number;
        event: string;
        fee: any;
        base_value?: {
          token_address: string;
          decimals: number;
          amount: number;
          amount_str: string;
        };
      }[];
      inner_instructions?: {
        ins_index: number;
        parsed_type: string;
        type: string;
        program_id: string;
        program: string;
        outer_program_id: string;
        outer_ins_index: number;
        data_raw: any;
        accounts: any[];
        activities: any[];
        transfers: any[];
        program_invoke_level: number;
      }[];
      program_invoke_level: number;
      idl_data?: {
        input_args: any;
        docs?: string[];
      };
      tags?: string[];
    }[];
    programs_involved: string[];
    signer: string[];
    list_signer: string[];
    status: number;
    account_keys: {
      pubkey: string;
      writable: boolean;
      signer: boolean;
      source: string;
    }[];
    compute_units_consumed: number;
    confirmations: null;
    version: number;
    priority_fee: number;
    tx_hash: string;
    block_time: number;
    address_table_lookup: {
      accountKey: string;
      writableIndexes: number[];
      readonlyIndexes: number[];
    }[];
    log_message: string[];
    recent_block_hash: string;
    tx_status: string;
  };
  metadata: {
    tokens: {
      [key: string]: {
        token_address: string;
        token_name: string;
        token_symbol: string;
        token_icon: string;
      };
    };
  };
}

export interface NetWorthDataType {
  chain: Chain;
  native_balance: string;
  native_balance_formatted: string;
  native_balance_usd: string;
  networth_usd: string;
  token_balance_usd: string;
}

export interface AllEvmWalletTokensDataType {
  chain: Chain;
  balance: string;
  balance_formatted: string;
  decimals: number;
  logo: string;
  name: string;
  native_token: boolean;
  percentage_relative_to_total_supply: string | null;
  portfolio_percentage: string;
  possible_spam: boolean;
  security_score: number;
  symbol: string;
  thumbnail: string;
  token_address: string;
  total_supply: string | null;
  total_supply_formatted: string | null;
  usd_price: string;
  usd_price_24hr_percent_change: string;
  usd_price_24hr_usd_change: string;
  usd_value: string;
  usd_value_24hr_usd_change: string;
  verified_contract: boolean;
}

export interface AllSolanaWalletTokensDataType {
  chain: Chain;
  amount: string;
  amountRaw: string;
  associatedTokenAddress: string;
  decimals: number;
  isVerifiedContract: boolean;
  logo: string;
  mint: string;
  name: string;
  possibleSpam: boolean;
  symbol: string;
  tokenDetail: {
    exchangeAddress: string;
    exchangeName: string;
    isVerifiedContract: boolean;
    logo: string;
    name: string;
    nativePrice: {
      decimals: number;
      name: string;
      symbol: string;
      value: string;
    };
    pairAddress: string;
    symbol: string;
    tokenAddress: string;
    usdPrice: number;
    usdPrice24h: number | null;
    usdPrice24hrPercentChange: number | null;
    usdPrice24hrUsdChange: number | null;
  }
}