import { SourceListDetailsDataType, ThoughtContentDataType } from 'store/chat/chat'

export interface ChatContentDataType {
  id: string
  content: string
  role: string
  timestamp: number
}

export interface ChatSteamDataType {
  id: string
  type: STREAM_DATA_TYPE
  content: string
  threadId: string
  agentId?: string
  triggerHistory?: {
    id?: string
    message: string
    error?: string
    trigger_time: number
  }[]
}

export interface ChatResponseContentDataType {
  id: string
  role: ROLE_TYPE
  content: string
  timestamp: number
  thoughtContentList: ThoughtContentDataType[]
  sourceListDetails: SourceListDetailsDataType[]
  agentId?: string
  threadId?: string
}

// 部署模态框状态
export type DeployModalStatus = 'form' | 'deploying'

// 部署步骤状态
export interface DeployStepStatus {
  stepNumber: number
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  message?: string
}

// 部署状态
export interface DeploymentState {
  deployModalVisible: boolean
  deployModalStatus: DeployModalStatus
  formData: DeployFormData
  steps: DeployStepStatus[]
  currentStep: number
  isLoading: boolean
  error?: string
}

export enum STRATEGY_STATUS {
  DRAFT = 'draft',
  DRAFT_READY = 'draft_ready',
  DEPLOYING = 'deploying',
  DEPLOYED = 'deployed',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export type StrategyDetailDataType = {
  id: string
  user_id: number
  name: string
  description: string
  status: STRATEGY_STATUS
  mode: string
  wallet_id: string
  signal_id: string
  agent_id: string
  thread_id: string
  strategy_config: {
    basic_info: any
    data_layer: any
    risk_layer: any
  }
  version: number
  deploy_time: string
  created_at: string
  updated_at: string
  signal: {
    id: string
    name: string
    description: string
  }
  agent: {
    id: string
    name: string
    description: string
  }
}

export interface StrategyCodeDataType {
  [props: string]: string
}
