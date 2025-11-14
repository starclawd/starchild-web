import { RefObject } from 'react'
import { LoadingStates as FeedbackLoadingStatesType } from './components/Feedback/types'

export interface AgentTriggerItemActionsConfig {
  copy?: boolean
  like?: boolean
  dislike?: boolean
  refresh?: boolean
}

// 反馈信息类型
export interface FeedbackInfo {
  feedback_type: string
  feedback_id: string
  created_at: string
  extra_data: {
    dislike_reason: string
  }
}

// 使用 Feedback 组件的加载状态类型
export type FeedbackLoadingStates = FeedbackLoadingStatesType

// Refresh组件的加载状态类型
export interface RefreshLoadingState {
  refresh: boolean
}

// AgentTriggerItemActions组件props接口 - 包含所有操作功能
export interface AgentTriggerItemActionsProps {
  responseContentRef?: RefObject<HTMLDivElement>
  config?: AgentTriggerItemActionsConfig
  // 拆分的加载状态
  feedbackLoadingStates?: FeedbackLoadingStates
  refreshLoadingState?: RefreshLoadingState
  // UI状态
  isLiked?: boolean
  isDisliked?: boolean
  dislikeReason?: string
  // 计数
  likeCount?: number
  dislikeCount?: number
  // 回调函数 - 无需传递参数，父组件已经知道上下文
  onLike?: () => Promise<void>
  onDislike?: (reason: string) => Promise<void>
  onRefresh?: () => Promise<void>
}

// Copy组件props
export interface CopyProps {
  responseContentRef?: RefObject<HTMLDivElement>
}

// Refresh组件props
export interface RefreshProps {
  isDisabled?: boolean
  onLoadingChange?: (isLoading: boolean) => void
  onRefresh?: () => Promise<void>
}
