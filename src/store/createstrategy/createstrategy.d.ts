export interface ChatContentDataType {
  id: string
  content: string
  role: string
  timestamp: number
}

export interface ChatResponseContentDataType {
  id: string
  role: ROLE_TYPE
  content: string
  timestamp: number
  thoughtContentList: ThoughtContentDataType[]
  sourceListDetails: SourceListDetailsDataType[]
  feedback: {
    feedback_type: string
    feedback_id: string
    created_at: string
    extra_data: {
      dislike_reason: string
    }
  } | null
  agentId?: string
  threadId?: string
  agentRecommendationList: RecommandContentDataType[]
  shouldShowKchart?: boolean
  triggerHistory?: {
    id?: string
    message: string
    error?: string
    trigger_time: number
  }[]
}
