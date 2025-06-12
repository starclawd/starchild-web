export interface BacktestData {
  code: string;
  rule: string;
  period: string;
  symbol: string;
  win_rates: string;
  details: {
    side: string;
    price: string;
    profile: string;
    datetime: string;
    quantity: string;
    timestamp: string;
  }[];
  final_value: string;
  requirement: string;
  sharpe_ratio: string;
  total_return: string;
  funding_trends: {
    funding: string;
    datetime: string;
    timestamp: number;
  }[];
  maximum_drawdown: string;
}

export enum TASK_STATUS {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum TASK_TYPE {
  AI_TASK = "ai_task",
  CODE_TASK = "code_task",
  DATETIME_TASK = "datetime_task",
  BACKTEST_TASK = "backtest_task"
}

export interface TaskDetailType {
  task_id: string;
  user_id: string;
  task_type: string;
  description: string;
  code: string;
  trigger_time: number;
  status: string;
  created_at: number;
  updated_at: number;
  interval: number;
  last_checked_at: number;
  trigger_type: string;
  subscription_user_count: number;
  user_name: string;
  condition_mode: string;
  trigger_history: {
    error: string;
    message: string;
    trigger_time: number;
  }[];
  tokens: string;
}