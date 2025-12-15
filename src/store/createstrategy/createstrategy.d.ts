import { SourceListDetailsDataType, ThoughtContentDataType } from 'store/chat/chat'

export interface ChatContentDataType {
  id: string
  content: string
  role: string
  timestamp: number
}

export interface ChatSteamDataType {
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
}

export interface ChatResponseContentDataType {
  id: string
  role: ROLE_TYPE
  content: string
  timestamp: number
  thoughtContentList: ThoughtContentDataType[]
  sourceListDetails: SourceListDetailsDataType[]
}

// 部署模态框状态
export type DeployModalStatus = 'form' | 'deploying'

// 部署步骤状态类型
export type DeployStepStatusType = 'not_started' | 'can_start' | 'in_progress' | 'completed' | 'failed'

// 部署步骤状态
export interface DeployStepStatus {
  stepNumber: number
  status: DeployStepStatusType
  message?: string
}

export enum STRATEGY_STATUS {
  DRAFT = 'draft', // 已创建，但未生成可部署代码
  DRAFT_READY = 'draft_ready', //代码已生成，可发起部署
  DEPLOYING = 'deploying', //部署流程进行中（包含等待充值、失败待重试等）
  DEPLOYED = 'deployed', // 部署完成，可运行
  PAUSED = 'paused', // 暂停（可恢复）
  DELISTED = 'delisted', // 下架（通常不可恢复，或仅允许管理员恢复）
  ARCHIVED = 'archived', // 归档（终态）
}

// 部署状态枚举
export enum DEPLOYING_STATUS {
  NONE = 'none',
  STEP1_IN_PROGRESS = 'step1_inProgress',
  STEP1_SUCCESS = 'step1_success',
  STEP1_FAILED = 'step1_failed',
  STEP2_IN_PROGRESS = 'step2_inProgress',
  STEP2_SUCCESS = 'step2_success',
  STEP2_FAILED = 'step2_failed',
  STEP3_IN_PROGRESS = 'step3_inProgress',
  STEP3_SUCCESS = 'step3_success',
  STEP3_FAILED = 'step3_failed',
}

export interface StrategyDetailDataType {
  id: string
  user_id: number
  name: string
  description: string
  status: STRATEGY_STATUS
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
  deploy_time: string
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
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
    symbols: string[]
    end_date: string
    leverage: number
    timeframe: string
    start_date: string
    position_size: number
    initial_capital: number
  }
  result: {
    rule: string
    period: string
    details: {
      side: 'long' | 'short'
      price: string
      profit: string
      symbol: string
      datetime: string
      quantity: string
    }[]
    metrics: {
      win_rate: number
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
    symbols: Array<SymbolDataType>
    timestamp: string
    backtest_id: string
    final_value: string
    sharpe_ratio: string
    total_return: string
    funding_trends: Array<{
      funding: string
      datetime: string
    }>
    maximum_drawdown: string
  }
  backtest_id: string
  created_at: string
  updated_at: string
  status: string
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
  status: string
  deployment_number: number
  deploy_time: string
  running_duration_seconds: number
  performance_metrics: {
    total_return: number
    win_rate: number
    total_trades: number
  }
}
