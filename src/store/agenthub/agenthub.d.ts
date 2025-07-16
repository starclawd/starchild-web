export interface AgentCategory {
  id: string
  titleKey: string
  descriptionKey: string
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
  type: string
  threadImageUrl?: string
  stats?: StrategyStats
  tags?: string[]
  recentChats?: RecentChat[]
  tokenInfo?: TokenInfo
  kolInfo?: KolInfo
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
  // agents by category
  agentThreadInfoList: AgentThreadInfo[]
  agentThreadInfoListTotal: number
  agentThreadInfoListPage: number
  agentThreadInfoListPageSize: number
  isLoading: boolean
  isLoadMoreLoading: boolean

  // agent marketplace
  agentMarketplaceThreadInfoList: AgentThreadInfo[]
  isLoadingMarketplace: boolean

  // subscribed agents
  subscribedAgentIds: string[]

  searchString: string
}

export interface StrategyStats {
  wins?: number
  apr?: string
  tokens?: string[]
}

export interface RecentChat {
  error?: string
  message?: string
  triggerTime?: number
}

export interface TokenInfo {
  symbol: string
  fullName: string
  description?: string
  price?: string
  pricePerChange?: string
  logoUrl?: string
}

export interface KolInfo {
  name: string
  avatar?: string
  description?: string
}

// Agent card props interface
export interface AgentCardProps {
  threadId: string
  title: string
  description: string
  creator: string
  subscriberCount: number
  avatar?: string
  type: string
  threadImageUrl?: string
  stats?: StrategyStats
  tags?: string[]
  recentChats?: RecentChat[]
  tokenInfo?: TokenInfo
  kolInfo?: KolInfo
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
