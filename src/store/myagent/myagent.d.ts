import { AGENT_HUB_TYPE } from 'constants'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'

export interface SubscribedAgentDataType extends AgentDetailDataType {
  category: AGENT_HUB_TYPE
}

export interface AgentOverviewDetailDataType extends AgentDetailDataType {
  backtest_result?: {
    result: BacktestDataType
  }
}

// New trigger 数据类型(from websocket)
export interface NewTriggerDataType {
  alertOptions: {
    id: number
  }
  createdAt?: number
}
