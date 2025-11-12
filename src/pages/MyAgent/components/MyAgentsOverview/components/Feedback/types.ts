import { RefObject } from 'react'

export interface AgentFeedbackConfig {
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

// 加载状态类型
export interface LoadingStates {
  like: boolean
  dislike: boolean
  refresh: boolean
}

// 重构后的组件props接口 - 只传递UI状态，不传递业务数据
export interface AgentFeedbackProps {
  responseContentRef?: RefObject<HTMLDivElement>
  config?: AgentFeedbackConfig
  loadingStates?: LoadingStates
  // UI状态
  isLiked?: boolean
  isDisliked?: boolean
  dislikeReason?: string
  // 回调函数 - 无需传递参数，父组件已经知道上下文
  onLike?: () => Promise<void>
  onDislike?: (reason: string) => Promise<void>
  onRefresh?: () => Promise<void>
}

// 子组件基础props类型
export interface AgentFeedbackComponentProps {
  responseContentRef?: RefObject<HTMLDivElement>
}

// Like组件props
export interface LikeProps extends AgentFeedbackComponentProps {
  isLiked?: boolean
  isDisabled?: boolean
  onLoadingChange?: (isLoading: boolean) => void
  onLike?: () => Promise<void>
}

// Dislike组件props
export interface DislikeProps extends AgentFeedbackComponentProps {
  isDisliked?: boolean
  dislikeReason?: string
  isDisabled?: boolean
  onLoadingChange?: (isLoading: boolean) => void
  onDislike?: (reason: string) => Promise<void>
}

// Refresh组件props
export interface RefreshProps extends AgentFeedbackComponentProps {
  isDisabled?: boolean
  onLoadingChange?: (isLoading: boolean) => void
  onRefresh?: () => Promise<void>
}

// DislikeModal组件props
export interface DislikeModalProps {
  isShowDislikeModal: boolean
  setIsShowDislikeModal: (isShowDislikeModal: boolean) => void
  onLoadingChange?: (isLoading: boolean) => void
  onDislike?: (reason: string) => Promise<void>
}
