export interface AgentCategory {
  id: string
  titleKey: string
  descriptionKey: string
  icon: string
  maxDisplayCountOnMarketPlace?: number
}

export interface AgentInfo {
  agentId: string
  title: string
  description: string
  creator: string
  subscriberCount: number
  avatar?: string
  type: string
  agentImageUrl?: string
  stats?: StrategyStats
  tags?: string[]
  recentChats?: RecentChat[]
  tokenInfo?: TokenInfo
  kolInfo?: KolInfo
}

export interface AgentInfoListResponse {
  data: AgentInfo[]
  categoryAgentTags: string[]
  total: number
  page: number
  pageSize: number
}

export interface AgentInfoListParams {
  page?: number
  pageSize?: number
  filterType?: string
  tag?: string
}

export interface AgentHubState {
  // agents by category
  agentInfoList: AgentInfo[]
  agentInfoListTotal: number
  agentInfoListPage: number
  agentInfoListPageSize: number
  searchedAgentInfoList: AgentInfo[]
  isLoading: boolean
  isLoadMoreLoading: boolean
  categoryAgentTags: string[]

  // agent marketplace
  agentMarketplaceInfoList: AgentInfo[]
  searchedAgentMarketplaceInfoList: AgentInfo[]
  isLoadingMarketplace: boolean

  // subscribed agents
  subscribedAgentIds: string[]

  marketplaceSearchString: string
  categorySearchString: string
  categorySearchTag: string
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
  agentId: string
  title: string
  description: string
  creator: string
  subscriberCount: number
  avatar?: string
  type: string
  agentImageUrl?: string
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
  customAgents?: AgentInfo[]
  onLoadMore?: () => void
  isLoadMoreLoading?: boolean
  hasLoadMore?: boolean
}
