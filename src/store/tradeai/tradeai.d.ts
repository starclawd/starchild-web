import { nanoid } from '@reduxjs/toolkit'
export interface AiSteamDataType {
  id: string
  type: STREAM_DATA_TYPE
  content: string
  threadId: string
}

export enum STREAM_DATA_TYPE {
  FINAL_ANSWER = 'finalAnswer',
  FINAL_ANSWER_CHUNK = 'finalAnswerChunk',
  TRADE_COMMAND = 'tradeCommand',
  AGENT_THOUGHT = 'thought',
  AGENT_OBSERVATION = 'observation',
  DONE = 'done',
  ERROR = 'error',
}

export enum ROLE_TYPE {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
}

export interface TempAiContentDataType {
  id: string
  role: ROLE_TYPE
  content: string
  feedback: 'good' | 'bad' | null
  observationContent: string
  thoughtContent: string
  tradeDetail?: string
  extraData?: {
    done: boolean
  }
}


// deposoit to perp
// deposoit to 1000x
// deposoit to Collateral
// deposoit to flexible earn
// withdraw from perp
// withdraw from 1000x
// withdraw from flexible earn
// withdraw from Collateral
// transfer from perp to 1000X
// transfer from 1000X to perp
// transfer from account to account
// transfer wallet asset to other account
// borrow
// repay jusd by usdc on wallet
// place a limit order
// place a market order
// place a stop limit order
// place a 1000x order
// place a grid order
// 添加流动性
export enum AI_COMMAND {
  JOJOPLACE = 'JOJOPLACE',
  JOJODEPOSIT = 'JOJODEPOSIT',
  JOJOWITHDRAW = 'JOJOWITHDRAW',
  JOJOTRANSFER = 'JOJOTRANSFER',
  JOJOBORROW = 'JOJOBORROW',
  JOJOREPAY = 'JOJOREPAY',
  JOJODOWNLOAD = 'JOJODOWNLOAD',
  JOJOSTAKE = 'JOJOSTAKE',
  JOJOCLAIM = 'JOJOCLAIM',
}

export const aiCommandList = [
  AI_COMMAND.JOJODEPOSIT,
  AI_COMMAND.JOJOWITHDRAW,
  AI_COMMAND.JOJOTRANSFER,
  AI_COMMAND.JOJOPLACE,
  AI_COMMAND.JOJOBORROW,
  AI_COMMAND.JOJOSTAKE,
  AI_COMMAND.JOJOREPAY,
  AI_COMMAND.JOJODOWNLOAD,
  AI_COMMAND.JOJOCLAIM,
]

export enum DEPOSIT_ACCOUNT_TYPE {
  "PERP" = 'perp',
  "1000X" = '1000x',
  "EARN" = 'earn',
  "COLLATERAL" = 'collateral',
}

export enum DEPOSIT_CHAIN_TYPE {
  BASE = 'base',
  ARBITRUM = 'arbitrum',
  ZKSYNC = 'zksync',
  POLYGON = 'polygon',
  LINEA = 'linea',
  BNB = 'bnb',
  ETHEREUM = 'ethereum',
  OPTIMISM = 'optimism',
  BASESEPOLIA = 'base_sepolia',
}

export enum DOWNLOAD_PAGE_TYPE {
  ASSET = 'asset',
  ORDER = 'order',
  TRADE = 'trade',
  REALTIMEFUNDINGRATE = 'realtime_funding_rate',
  FUNDINGRATEHISTORY = 'funding_rate_history',
  INSURANCE = 'insurance',
  COLLATERAL = 'collateral',
}


export enum REPAY_ACCOUNT_TYPE {
  "PERP" = 'perp',
  "WALLET" = 'wallet',
  "COLLATERAL" = 'collateral',
}

export const repayAccountKeyMap = {
  [REPAY_ACCOUNT_TYPE.PERP]: 'jojo',
  [REPAY_ACCOUNT_TYPE.COLLATERAL]: 'collateral',
  [REPAY_ACCOUNT_TYPE.WALLET]: 'wallet',
}

export interface ThreadData {
  threadId: string
  createdAt: number
  title: string
}

export interface StyleData {
  section: string
  subElement: string
  style: string
  value: string
}

export enum PAGE_SECTION {
  PERPPETUAL_MARKET_INFO_WRAPPER = 'PERPPETUAL_MARKET_INFO_WRAPPER',
  PERPPETUAL_MARKET_INFO = 'PERPPETUAL_MARKET_INFO',
  PERPPETUAL_ORDER_BOOK = 'PERPPETUAL_ORDER_BOOK',
  PERPPETUAL_MIN_ORDER_BOOK = 'PERPPETUAL_MIN_ORDER_BOOK',
  PERPPETUAL_KLINE = 'PERPPETUAL_KLINE',
  PERPPETUAL_ACCOUNT = 'PERPPETUAL_ACCOUNT',
  PERPPETUAL_ORDER_BOARD = 'PERPPETUAL_ORDER_BOARD',
  PERPPETUAL_TRADE_INFO = 'PERPPETUAL_TRADE_INFO',
  PERPPETUAL_HEADER_NAV = 'PERPPETUAL_HEADER_NAV',
  PERPPETUAL_FOOTER_NAV = 'PERPPETUAL_FOOTER_NAV',
}

export const pageSectionClassNameMap = {
  [PAGE_SECTION.PERPPETUAL_MARKET_INFO_WRAPPER]: 'perpetual-market-info-wrapper',
  [PAGE_SECTION.PERPPETUAL_MARKET_INFO]: 'perpetual-market-info',
  [PAGE_SECTION.PERPPETUAL_ORDER_BOOK]: 'perpetual-order-book',
  [PAGE_SECTION.PERPPETUAL_MIN_ORDER_BOOK]: 'perpetual-min-order-book',
  [PAGE_SECTION.PERPPETUAL_KLINE]: 'perpetual-kline',
  [PAGE_SECTION.PERPPETUAL_ACCOUNT]: 'perpetual-account',
  [PAGE_SECTION.PERPPETUAL_ORDER_BOARD]: 'perpetual-order-board',
  [PAGE_SECTION.PERPPETUAL_TRADE_INFO]: 'perpetual-trade-info',
  [PAGE_SECTION.PERPPETUAL_HEADER_NAV]: 'perpetual-header-nav',
  [PAGE_SECTION.PERPPETUAL_FOOTER_NAV]: 'perpetual-footer-nav',
}

export enum CURRENT_MODEL {
  "TRADE_SAGE" = 'general',
  "FLEX_CRAFT" = 'tradeLayout',
}

export const localAccount = `anonymous-${nanoid()}`

export interface NewsDataType {
  id: string
  title: string
  content: string
}

export interface NewsListDataType {
  list: NewsDataType[]
  totalSize: number
}

export enum TRADE_AI_TYPE {
  CHAT_TYPE = 'CHAT_TYPE',
  ORDER_TYPE = 'ORDER_TYPE',
  PAGE_TYPE = 'PAGE_TYPE',
}

export enum LOADING_STATUS {
  LOADING = 0,
  SUCCESS = 1,
}

export interface AnalyzeContentDataType {
  content: string
  loadingStatus: LOADING_STATUS
}

export interface RecommandContentDataType {
  content: string
}
