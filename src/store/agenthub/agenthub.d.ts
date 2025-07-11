export interface AgentCategory {
  id: string
  titleKey: string
  descriptionKey: string
  hasCustomComponent: boolean
  icon: string
  maxDisplayCountOnMarketPlace?: number
}

export interface AgentThreadInfo {
  threadId: string
  title: string
  description: string
  creator: string
  subscriberCount: number
  avatar?: string
  subscribed: boolean
  type: string
  threadImageUrl?: string
  stats?: StrategyStats
}

export interface AgentThreadInfoListResponse {
  data: AgentThreadInfo[]
  total: number
  page: number
  pageSize: number
}

export interface AgentThreadInfoListParams {
  page?: number
  pageSize?: number
  filterString?: string
  filterType?: string
}

export interface AgentHubState {
  agentThreadInfoListAgents: AgentThreadInfo[]
  agentThreadInfoListTotal: number
  agentThreadInfoListPage: number
  agentThreadInfoListPageSize: number
  isLoading: boolean
  isLoadMoreLoading: boolean
}

export interface StrategyStats {
  wins?: number
  apr?: string
  tokens?: string[]
}

// Agent card props interface
export interface AgentCardProps {
  threadId: string
  description: string
  title: string
  creator: string
  subscriberCount: number
  avatar?: string
  subscribed: boolean
  threadImageUrl?: string
  stats?: StrategyStats
}
