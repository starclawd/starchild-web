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
