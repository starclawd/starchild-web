import { msg } from '@lingui/core/macro'
import { AGENT_HUB_TYPE } from 'store/agenthub/agenthub.d'

export interface AgentCategory {
  id: string
  titleKey: MessageDescriptor
  descriptionKey: MessageDescriptor
  icon: string
  maxDisplayCountOnMarketPlace?: number
  routeHash: string
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
  createdTime?: number
  updatedTime?: number
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

export interface AgentMarketplaceListViewParams {
  page?: number
  pageSize?: number
  searchStr?: string
  category?: string
  sortingColumn?: ListViewSortingColumn
  sortingOrder?: ListViewSortingOrder
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
  subscribedAgentIds: number[]

  // current selected info
  currentKolInfo: KolInfo | null
  currentTokenInfo: TokenInfo | null

  marketplaceSearchString: string
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

export enum ListViewSortingColumn {
  UPDATED_TIME = 'updated',
  CREATED_TIME = 'created',
  SUBSCRIPTIONS = 'subscription',
}

export enum ListViewSortingOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum AGENT_HUB_TYPE {
  INDICATOR = 'Indicator Hub',
  STRATEGY = 'Strategy Lab',
  SIGNAL_SCANNER = 'Signal Scanner',
  KOL_RADAR = 'KOL Radar',
  AUTO_BRIEFING = 'Auto Briefing',
  MARKET_PULSE = 'Market Pulse',
  TOKEN_DEEP_DIVE = 'Token Deep Dive',
  OTHERS = 'Others',
}

export const DISCOVER_AGENTS: AgentCategory = {
  id: 'discover-agents',
  titleKey: msg`Discover Agents`,
  descriptionKey: '',
  icon: 'icon-discover-agents',
  maxDisplayCountOnMarketPlace: 6,
  routeHash: '',
}

export const INDICATOR_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.INDICATOR,
  titleKey: msg`Indicator Hub`,
  descriptionKey: msg`Track key metrics. Stay ahead of the trend`,
  icon: 'icon-candlestick',
  maxDisplayCountOnMarketPlace: 6,
  routeHash: 'indicator-hub',
}

export const STRATEGY_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.STRATEGY,
  titleKey: msg`Strategy Lab`,
  descriptionKey: msg`Build, test, and refine your trading edge`,
  icon: 'icon-backtest',
  maxDisplayCountOnMarketPlace: 6,
  routeHash: 'strategy-hub',
}

export const SIGNAL_SCANNER: AgentCategory = {
  id: AGENT_HUB_TYPE.SIGNAL_SCANNER,
  titleKey: msg`Signal Scanner`,
  descriptionKey: msg`Scan the market. Spot real-time opportunities`,
  icon: 'icon-signal-scanner',
  maxDisplayCountOnMarketPlace: 6,
  routeHash: 'signal-scanner',
}

export const KOL_RADAR: AgentCategory = {
  id: AGENT_HUB_TYPE.KOL_RADAR,
  titleKey: msg`KOL Radar`,
  descriptionKey: msg`Follow top voices. Act on expert insights`,
  icon: 'icon-kol-radar',
  maxDisplayCountOnMarketPlace: 6,
  routeHash: 'kol-radar',
}

export const AUTO_BRIEFING: AgentCategory = {
  id: AGENT_HUB_TYPE.AUTO_BRIEFING,
  titleKey: msg`Auto Briefing`,
  descriptionKey: msg`Your daily market intel. Fully automated`,
  icon: 'icon-auto-briefing',
  maxDisplayCountOnMarketPlace: 6,
  routeHash: 'auto-briefing',
}

export const MARKET_PULSE: AgentCategory = {
  id: AGENT_HUB_TYPE.MARKET_PULSE,
  titleKey: msg`Market Pulse`,
  descriptionKey: msg`Live sentiment. Real-time momentum`,
  icon: 'icon-market-pulse',
  maxDisplayCountOnMarketPlace: 6,
  routeHash: 'market-pulse',
}

export const TOKEN_DEEP_DIVE: AgentCategory = {
  id: AGENT_HUB_TYPE.TOKEN_DEEP_DIVE,
  titleKey: msg`Token Deep Dive`,
  descriptionKey: msg`Uncover the fundamentals behind the tokens`,
  icon: 'icon-token-deep-dive',
  maxDisplayCountOnMarketPlace: 6,
  routeHash: 'token-deep-dive',
}

export const AGENT_CATEGORIES: AgentCategory[] = [
  INDICATOR_HUB,
  STRATEGY_HUB,
  SIGNAL_SCANNER,
  KOL_RADAR,
  AUTO_BRIEFING,
  MARKET_PULSE,
  TOKEN_DEEP_DIVE,
]
