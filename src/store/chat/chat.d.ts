import { nanoid } from '@reduxjs/toolkit'
import { BacktestDataType } from 'store/agentdetail/agentdetail'
export interface AiSteamDataType {
  id: string
  type: STREAM_DATA_TYPE
  content: string
  threadId: string
  agentId?: string
  triggerHistory?: {
    id?: string
    message: string
    error?: string
    trigger_time: number
  }[]
  klineCharts?: {
    url: string
    timestamp: string
    session_id: string
  }
}

export enum STREAM_DATA_TYPE {
  FINAL_ANSWER = 'final_answer',
  TEMP = 'temp',
  END_THINKING = 'end_thinking',
  ERROR = 'error',
  SOURCE_LIST_DETAILS = 'source_list_details',
  TRIGGER_HISTORY = 'trigger_history',
  THINKING_DETAIL = 'thinking_detail',
  TOOL_RESULT_DETAIL = 'tool_result_detail',

  // create strategy
  CONNECTED = 'connected',
  ACTION_CALL = 'action_call',
  THINKING = 'thinking',
  ACTION_COMPLETE = 'action_complete',
  NEXT_ACTION = 'next_action',
}

export enum ROLE_TYPE {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
}

export interface ThoughtContentDataType {
  id?: string
  tool_name: string
  tool_type: string
  tool_description: string
}

export interface SourceListDetailsDataType {
  id: string
  title: string
  status: 'success' | 'error'
  description: string
}

export enum RECOMMENDATION_TYPE {
  // 订阅现有代理
  SUBSCRIBE = 'subscribe',
  // 创建价格提醒
  CREATE_ALERT = 'create_alert',
  // 创建回测任务
  CREATE_BACKTEST = 'create_backtest',
  // ask
  REQUEST_RECOMMEND = 'request_recommend',
}
export interface RecommandContentDataType {
  message: string
  task_id: string
  recommendation_type: RECOMMENDATION_TYPE
  confidence: number
  recommendation_id: number
  source: string
  ts: string
}

export interface TempAiContentDataType {
  id: string
  role: ROLE_TYPE
  content: string
  timestamp: number
  thoughtContentList: ThoughtContentDataType[]
  sourceListDetails: SourceListDetailsDataType[]
  feedback: {
    feedback_type: string
    feedback_id: string
    created_at: string
    extra_data: {
      dislike_reason: string
    }
  } | null
  agentId?: string
  threadId?: string
  agentRecommendationList: RecommandContentDataType[]
  shouldShowKchart?: boolean
  triggerHistory?: {
    id?: string
    message: string
    error?: string
    trigger_time: number
  }[]
  klineCharts?: {
    url: string
    timestamp: string
    session_id: string
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
  'PERP' = 'perp',
  '1000X' = '1000x',
  'EARN' = 'earn',
  'COLLATERAL' = 'collateral',
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
  'PERP' = 'perp',
  'WALLET' = 'wallet',
  'COLLATERAL' = 'collateral',
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
  updatedAt: number
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
  'TRADE_SAGE' = 'general',
  'FLEX_CRAFT' = 'tradeLayout',
}

export const localAccount = `anonymous-${nanoid()}`

export enum LOADING_STATUS {
  LOADING = 0,
  SUCCESS = 1,
}

export interface AnalyzeContentDataType {
  content: string
  loadingStatus: LOADING_STATUS
}

export interface ChatRecommendationDataType {
  id: number
  full_text: string
  display_text: string
  language: string
}

export enum ACTION_TYPE {
  /** 用户点击了推荐链接 */
  CLICKED = 'clicked',
  /** 用户订阅了推荐的代理 */
  SUBSCRIBED = 'subscribed',
  /** 用户创建了价格提醒 */
  CREATED_ALERT = 'created_alert',
  /** 用户创建了回测任务 */
  CREATED_BACKTEST = 'created_backtest',
  /** 用户忽略/关闭了推荐 */
  DISMISSED = 'dismissed',
  /** 用户分享了推荐 */
  SHARED = 'shared',
  /** 用户请求了推荐 */
  ASKED = 'asked',
}
