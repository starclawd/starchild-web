import { AGENT_HUB_TYPE } from 'constants/agentHub'

export enum BACKTEST_STATUS {
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface BacktestDataType {
  code: string
  rule: string
  period: string
  run_up: string
  symbol: string
  coingecko_id: string
  details: {
    side: string
    price: string
    profile: string
    datetime: string
    quantity: string
    timestamp: number
  }[]
  win_rates: string
  final_value: string
  requirement: string
  sharpe_ratio: string
  initial_value: string
  profit_factor: string
  run_up_rates: string
  funding_trends: {
    funding: string
    datetime: string
    timestamp: number
  }[]
  trades_per_day: string
  avg_losing_trade: string
  avg_winning_trade: string
  total_return_rates: string
  maximum_drawdown_rates: string
  maximum_drawdown_value: string
  annualized_return_rates: string
  status: BACKTEST_STATUS
  error_msg: string
}

export enum AGENT_STATUS {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum AGENT_TYPE {
  AI_TASK = 'ai_task',
  CODE_TASK = 'code_task',
  DATETIME_TASK = 'datetime_task',
  BACKTEST_TASK = 'backtest_task',
}

export enum GENERATION_STATUS {
  PENDING = 'pending',
  GENERATING = 'generating',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface TriggerHistoryDataType {
  id?: string
  message: string
  error?: string
  trigger_time: number
  like_count?: number
  dislike_count?: number
  user_feedback?: {
    feedback_type: string
    feedback_id: string
    created_at: string
    dislike_reason: string
  }
}

export interface AgentDetailDataType {
  task_id: string
  user_id: string
  task_type: AGENT_TYPE
  check_log: {
    check_time: number
    triggered: boolean
    details: string
    status: string
  }[]
  description: string
  code: string
  trigger_time: number
  status: AGENT_STATUS
  created_at: number
  updated_at: number
  interval: number
  last_checked_at: number
  trigger_type: string
  subscription_user_count: number
  user_name: string
  condition_mode: string
  trigger_history: TriggerHistoryDataType[]
  tokens: string
  title: string
  id: number
  tags: string
  categories: AGENT_HUB_TYPE[]
  kol_name: string
  kol_avatar: string
  code_description: string
  generation_msg: string
  generation_status: GENERATION_STATUS
  user_avatar: string
  workflow: string
  image_url: string
  triggered_at?: string
}

export const DEFAULT_AGENT_DETAIL_DATA: AgentDetailDataType = {
  task_id: '',
  user_id: '',
  task_type: AGENT_TYPE.AI_TASK,
  description: '',
  code: '',
  trigger_time: 0,
  status: AGENT_STATUS.PENDING,
  created_at: 0,
  updated_at: 0,
  interval: 0,
  last_checked_at: 0,
  trigger_type: '',
  subscription_user_count: 0,
  user_name: '',
  condition_mode: '',
  trigger_history: [],
  tokens: '',
  title: '',
  user_avatar: '',
  id: 0,
  tags: '',
  category: AGENT_HUB_TYPE.INDICATOR,
  display_user_name: '',
  display_user_avatar: '',
  code_description: '',
  generation_msg: '',
  generation_status: GENERATION_STATUS.PENDING,
  workflow: '',
  image_url: '',
}

export const DEFAULT_BACKTEST_DATA: BacktestDataType = {
  code: '',
  rule: '',
  period: '',
  details: [],
  final_value: '',
  requirement: '',
  sharpe_ratio: '',
  total_return_rates: '',
  funding_trends: [],
  maximum_drawdown_rates: '',
  maximum_drawdown_value: '',
  annualized_return_rates: '',
  symbol: '',
  win_rates: '',
  run_up: '',
  initial_value: '',
  profit_factor: '',
  trades_per_day: '',
  avg_losing_trade: '',
  avg_winning_trade: '',
  run_up_rates: '',
  error_msg: '',
  status: BACKTEST_STATUS.RUNNING,
}

export enum WORKFLOW_STATUS {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}
