export interface SignalScannerAgent {
  id: string
  title: string
  description: string
  creator: string
  usageCount: number
  avatar: string
}

export interface SignalScannerListResponse {
  data: SignalScannerAgent[]
  total: number
  page: number
  pageSize: number
}

export interface SignalScannerListParams {
  page?: number
  pageSize?: number
}

export interface AgentHubState {
  signalScannerAgents: SignalScannerAgent[]
  signalScannerTotal: number
  signalScannerPage: number
  signalScannerPageSize: number
  isLoading: boolean
} 