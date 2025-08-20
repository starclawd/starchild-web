import { AGENT_HUB_TYPE } from 'constants/agentHub'

export interface AgentCategory {
  id: string
  titleKey: MessageDescriptor
  descriptionKey: MessageDescriptor
  icon: string
  maxDisplayCountOnMarketPlace?: number
}

export interface AgentInfo {
  id: string
  agentId: number
  title: string
  description: string
  creator: string
  subscriberCount: number
  avatar?: string
  types: AGENT_HUB_TYPE[]
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
  agentMarketplaceListViewInfoList: AgentInfo[]
  searchedAgentMarketplaceInfoList: AgentInfo[]
  searchedAgentMarketplaceListViewInfoList: AgentInfo[]
  isLoadingMarketplace: boolean

  // subscribed agents
  subscribedAgentIds: number[]

  // current selected info
  currentKolInfo: KolInfo | null
  currentTokenInfo: TokenInfo | null

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
  price?: number
  pricePerChange?: number
  logoUrl?: string
}

export interface KolInfo {
  id: string
  name: string
  avatar?: string
  description?: string
}

export interface TokenCardProps {
  tokenInfo?: TokenInfo
  enableClick: boolean
}

// Agent card props interface
export interface AgentCardProps {
  id: string
  agentId: number
  title: string
  description: string
  creator: string
  subscriberCount: number
  avatar?: string
  types: AGENT_HUB_TYPE[]
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
