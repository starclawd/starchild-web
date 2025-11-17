// 反馈信息类型
export interface FeedbackInfo {
  feedback_type: string
  feedback_id: string
  created_at: string
  extra_data: {
    dislike_reason: string
  }
}

// 加载状态类型 - Feedback组件只需要like和dislike
export interface LoadingStates {
  like: boolean
  dislike: boolean
}

// Feedback组件props接口 - 移除config，永远显示like和dislike
export interface AgentFeedbackProps {
  loadingStates?: LoadingStates
  // UI状态
  isLiked?: boolean
  isDisliked?: boolean
  dislikeReason?: string
  // 计数
  likeCount?: number
  dislikeCount?: number
  // 回调函数 - 只有like和dislike
  onLike?: () => Promise<void>
  onDislike?: (reason: string) => Promise<void>
  // 状态变化回调 - 当使用外部状态时通知父组件
  onLoadingChange?: (type: keyof LoadingStates, isLoading: boolean) => void
}

// Like组件props
export interface LikeProps {
  isLiked?: boolean
  isDisabled?: boolean
  likeCount?: number
  onLoadingChange?: (isLoading: boolean) => void
  onLike?: () => Promise<void>
}

// Dislike组件props
export interface DislikeProps {
  isDisliked?: boolean
  dislikeReason?: string
  dislikeCount?: number
  isDisabled?: boolean
  onLoadingChange?: (isLoading: boolean) => void
  onDislike?: (reason: string) => Promise<void>
}

// DislikeModal组件props
export interface DislikeModalProps {
  isShowDislikeModal: boolean
  setIsShowDislikeModal: (isShowDislikeModal: boolean) => void
  onLoadingChange?: (isLoading: boolean) => void
  onDislike?: (reason: string) => Promise<void>
}
