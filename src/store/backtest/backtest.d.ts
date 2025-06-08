export interface BacktestData {
  code: string;
  rule: string;
  period: string;
  symbol: string;
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