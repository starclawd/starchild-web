import { SourceListDetailsDataType, ThoughtContentDataType, STREAM_DATA_TYPE, ROLE_TYPE } from 'store/chat/chat'

export interface ChatContentDataType {
  id: string
  content: string
  role: string
  timestamp: number
}

export enum ACTION_TYPE {
  CREATE_STRATEGY = 'create_strategy',
  GENERATE_CODE = 'generate_code',
  START_PAPER_TRADING = 'start_paper_trading',
  STOP_PAPER_TRADING = 'stop_paper_trading',
  DEPLOY_LIVE = 'deploy_live',
}

export interface SuggestedActionsDataType {
  action_type: ACTION_TYPE
  label: string
  description: string
  enabled: boolean
  priority: number
}

export interface ChatSteamDataType {
  id: string
  type: STREAM_DATA_TYPE
  content: string
  threadId: string
  agentId?: string
}

export interface ChatResponseContentDataType {
  id: string
  role: ROLE_TYPE
  content: string
  timestamp: number
  thinkingContent: string
  nextActions: SuggestedActionsDataType[]
}

export enum STRATEGY_STATUS {
  DRAFT = 'draft', // 已创建，但未生成可部署代码
  DRAFT_READY = 'draft_ready', //代码已生成，可发起部署
  PAPER_TRADING = 'papert_rading', // papert_rading 已启动
  DEPLOYING = 'deploying', //部署流程进行中（包含等待充值、失败待重试等）
  DEPLOYED = 'deployed', // 部署完成，可运行
  PAUSED = 'paused', // 暂停（可恢复）
  DELISTED = 'delisted', // 下架（通常不可恢复，或仅允许管理员恢复）
  ARCHIVED = 'archived', // 归档（终态）
}

// 纸上交易状态枚举
export enum PAPER_TRADING_STATUS {
  RUNNING = 'running', // deployment is active AND strategy vault is NOT deployed
  LIVE = 'live', // deployment is active AND strategy vault IS deployed
  PAUSED = 'paused', // deployment is paused AND strategy vault is NOT deployed
  SUSPENDED = 'suspended', // deployment is paused AND strategy vault IS deployed
  TERMINATED = 'terminated', // strategy status is archived OR deployment status is stopped/archived
}

// 部署状态枚举 (对应接口中的 deploy_status 字段)
export enum DEPLOYING_STATUS {
  NONE = '',
  DEPLOYING = 'vault_deploying',
  DEPLOYING_SUCCESS = 'vault_deployed',
  DEPLOYING_FAILED = 'failed_vault_deploying',
}

export enum DEPLOY_MODAL_STATUS {
  UNSTARTED = 'UNSTARTED',
  DEPLOYING = 'DEPLOYING',
  DEPLOYING_SUCCESS = 'DEPLOYING_SUCCESS',
  DEPLOYING_FAILED = 'DEPLOYING_FAILED',
}

export enum PAPER_TRADING_TAB_KEY {
  PERFORMANCE = 'performance',
  SIGNALS = 'signals',
  POSITIONS = 'positions',
  ORDERS = 'orders',
  ORDER_HISTORY = 'orderHistory',
}

export interface StrategyDetailDataType {
  id: string
  user_id: number
  name: string
  description: string
  status: STRATEGY_STATUS
  is_public: boolean
  mode: string
  wallet_id: string
  signal_id: string
  agent_id: string
  thread_id: string
  strategy_config: {
    basic_info: {
      name: string
      description: string
    }
    data_layer: {
      [props: string]: any
    }
    risk_layer: {
      [props: string]: any
    }
    signal_layer: {
      [props: string]: any
    }
    capital_layer: {
      [props: string]: any
    }
    execution_layer: {
      [props: string]: any
    }
  }
  version: number
  deploy_time: number
  created_at: number
  updated_at: number
  vibe: string | null
  signal: {
    id: string
    name: string
    description: string
  }
  agent: {
    id: string
    name: string
    description: string
  }
}

export enum GENERATION_STATUS {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type StrategyCodeDataType = {
  id: string
  strategy_id: string
  name: string
  description: string
  signal_prompt: string
  external_code: string | null
  generation_status: GENERATION_STATUS | null
  workflow:
    | {
        name: string
        content: string
      }[]
    | null
  is_active: boolean
  is_public: boolean
  created_at: number
  updated_at: number
}

export enum BACKTEST_STATUS {
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type StrategyBacktestDataType = {
  steps: Array<
    | {
        data: {
          strategy_id: string
        }
        step: 'start'
        message: string
        progress: number
        timestamp: string
      }
    | {
        data: {
          strategy_name: string
        }
        step: 'strategy_generating' | 'strategy_generated'
        message: string
        progress: number
        timestamp: string
      }
    | {
        step: 'strategy_generating'
        message: string
        progress: number
        timestamp: string
      }
    | {
        data: {
          period: string
          symbols: string[]
          end_date: string
          timeframe: string
          start_date: string
          data_source: string
        }
        step: 'data_loading'
        message: string
        progress: number
        timestamp: string
      }
    | {
        data: {
          data_source: string
          candles_expected: string
        }
        step: 'data_loaded'
        message: string
        progress: number
        timestamp: string
      }
    | {
        data: {
          parameters: {
            fees: {
              maker: string
              taker: string
            }
            symbols: string[]
            leverage: string
            platform: string
            slippage: string
            timeframe: string
            data_source: string
            position_size: string
            initial_capital: string
          }
        }
        step: 'backtest_running'
        message: string
        progress: number
        timestamp: string
      }
    | {
        data: {
          total_trades: number
        }
        step: 'backtest_complete'
        message: string
        progress: number
        timestamp: string
      }
    | {
        step: 'metrics_calculating'
        message: string
        progress: number
        timestamp: string
      }
    | {
        step: 'complete'
        message: string
        progress: number
        timestamp: string
      }
  >
  params: {
    platform: string
    symbols: string[]
    timeframe: string
    start_date: string
    end_date: string
    period: string
    initial_capital: number
    position_size: number
    leverage: number
    max_leverage: number
    taker_fee: number
    maker_fee: number
    slippage: number
    data_source: string
  }
  result: {
    rule: string
    period: string
    details: Array<{
      side: 'short' | 'close_short'
      price: string
      profit: string
      symbol: string
      datetime: string
      quantity: string
    }>
    metrics: {
      win_rate: number
      max_runup: number
      expectancy: number
      average_win: number
      largest_win: number
      average_loss: number
      calmar_ratio: number
      largest_loss: number
      max_drawdown: number
      sharpe_ratio: number
      total_return: number
      average_trade: number
      profit_factor: number
      trades_per_day: number
      annualized_return: number
    }
    success: boolean
    summary: {
      cash: number
      win_rate: number
      total_return: number
      total_trades: number
      losing_trades: number
      current_equity: number
      open_positions: number
      winning_trades: number
      initial_capital: number
      total_fees_paid: number
      closed_positions: number
    }
    symbols: Array<{
      base: string
      name: string
      quote: string
      symbol: string
      market_type: string
      coingecko_id: string
      coingecko_symbol: string
    }>
    timestamp: string
    backtest_id: string
    final_value: string
    sharpe_ratio: string
    total_return: string
    maximum_runup: string
    funding_trends: Array<{
      funding: string
      datetime: string
    }>
    trades_per_day: string
    maximum_drawdown: string
    annualized_return: string
    maximum_runup_value: string
    maximum_drawdown_value: string
  }
  backtest_id: string
  created_at: number
  updated_at: number
  status: BACKTEST_STATUS
  strategy_id: string
  strategy_name: string
}

export interface SymbolDataType {
  base: string
  name: string
  quote: string
  symbol: string
  market_type: string
  coingecko_id: string
  coingecko_symbol: string
}

export interface PaperTradingCurrentDataType {
  deployment_id: string
  strategy_id: string
  mode: string
  status: PAPER_TRADING_STATUS
  deployment_number: number
  deploy_time: number
  running_duration_seconds: number
  performance_metrics: {
    total_return: number
    win_rate: number
    total_trades: number
  }
}

export enum STRATEGY_TAB_INDEX {
  CREATE = 'create',
  CODE = 'code',
  PAPER_TRADING = 'paper_trading',
  LAUNCH = 'launch',
}
