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
