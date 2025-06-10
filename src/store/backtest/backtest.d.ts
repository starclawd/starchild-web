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

export interface TaskDetailType {
  task_id: string;
  user_id: string;
  task_type: string;
  description: string;
  code: string;
  trigger_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  interval: number;
  last_checked_at: string;
  trigger_type: string;
  subscription_user_count: number;
  user_name: string;
  condition_mode: string;
  trigger_history: string;
  tokens: string;
}