export interface AgentCategory {
  id: string
  titleKey: string
  descriptionKey: string
  icon: string
  maxDisplayCountOnMarketPlace?: number
  hasCustomComponent: boolean
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
  tags?: string[]
  recentChats?: RecentChat[]
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
  agentThreadInfoList: AgentThreadInfo[]
  agentThreadInfoListTotal: number
  agentThreadInfoListPage: number
  agentThreadInfoListPageSize: number
  isLoading: boolean
  isLoadMoreLoading: boolean
  searchString: string
}

export interface StrategyStats {
  wins?: number
  apr?: string
  tokens?: string[]
}

export interface RecentChat {
  message?: string
  triggerTime?: number
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
  tags?: string[]
  recentChats?: RecentChat[]
}

export interface AgentHubSectionProps {
  category: AgentCategory
  showViewMore?: boolean
  isLoading: boolean
  maxAgents?: number
  customAgents?: AgentThreadInfo[]
  onLoadMore?: () => void
  isLoadMoreLoading?: boolean
  hasLoadMore?: boolean
}
