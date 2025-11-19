import { memo } from 'react'
import { useAgentTriggerHistoryFeedback } from 'store/myagent/hooks/useAgentTriggerHistoryFeedbackHooks'
import Feedback from '../Feedback'
import { TriggerHistoryDataType } from 'store/agentdetail/agentdetail'

interface AgentTriggerItemFeedbackProps {
  triggerHistory: TriggerHistoryDataType
}

const AgentTriggerItemFeedback = memo(function AgentTriggerItemFeedback({
  triggerHistory,
}: AgentTriggerItemFeedbackProps) {
  // 从服务端数据构建初始状态
  const initialFeedbackState = {
    isLiked: triggerHistory.user_feedback?.feedback_type === 'like',
    isDisliked: triggerHistory.user_feedback?.feedback_type === 'dislike',
    likeCount: triggerHistory.like_count || 0,
    dislikeCount: triggerHistory.dislike_count || 0,
    dislikeReason: triggerHistory.user_feedback?.dislike_reason,
  }

  // 使用专门的agent反馈hooks
  const { loadingStates, onLike, onDislike, feedbackState } = useAgentTriggerHistoryFeedback({
    triggerHistoryId: triggerHistory.id || '',
    initialFeedbackState,
  })

  return (
    <Feedback
      loadingStates={loadingStates}
      isLiked={feedbackState.isLiked}
      isDisliked={feedbackState.isDisliked}
      dislikeReason={feedbackState.dislikeReason}
      likeCount={feedbackState.likeCount}
      dislikeCount={feedbackState.dislikeCount}
      onLike={onLike}
      onDislike={onDislike}
    />
  )
})

export default AgentTriggerItemFeedback
