export interface AgentCategory {
  id: string
  titleKey: string
  descriptionKey: string
  hasCustomComponent: boolean
  icon: string
}

export interface AgentThreadInfo {
  id: string
  title: string
  description: string
  creator: string
  subscriberCount: number
  avatar?: string
  subscribed: boolean
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
  signalScannerAgents: AgentThreadInfo[]
  signalScannerTotal: number
  signalScannerPage: number
  signalScannerPageSize: number
  isLoading: boolean
  isLoadMoreLoading: boolean
}

// Base agent card props interface
export interface AgentCardProps {
  id: string
  description: string
  title: string
  creator: string
  subscriberCount: number
  avatar?: string
  subscribed: boolean
}

// Indicator card props interface that extends AgentCardProps
export interface IndicatorCardProps extends AgentCardProps {
  wins: number
  apr: string
  tokens?: string[]
}
