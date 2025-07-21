export enum BACKTEST_STATUS {
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface BacktestData {
  code: string
  rule: string
  period: string
  run_up: string
  symbol: string
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
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface AgentDetailDataType {
  task_id: string
  user_id: string
  task_type: AGENT_TYPE
  description: string
  code: string
  trigger_time: number
  status: string
  created_at: number
  updated_at: number
  interval: number
  last_checked_at: number
  trigger_type: string
  subscription_user_count: number
  user_name: string
  condition_mode: string
  trigger_history: any[]
  tokens: string
  title: string
  id: number
  tags: string
  category: string
  display_user_name: string
  display_user_avatar: string
  code_description: string
  generation_msg: string
  generation_status: GENERATION_STATUS
  user_avatar: string
  workflow: string
}
