import { memo, RefObject } from 'react'
import { AgentOverviewDetailDataType } from 'store/myagent/myagent'
import { useAgentTriggerHistoryFeedback } from '../../../../../../store/myagent/hooks/useAgentTriggerHistoryFeedbackHooks'
import ItemActions from '../ItemActions'

interface AgentTriggerItemActionsProps {
  data: AgentOverviewDetailDataType
  responseContentRef?: RefObject<HTMLDivElement>
}

const AgentTriggerItemActions = memo(function AgentTriggerItemActions({
  data,
  responseContentRef,
}: AgentTriggerItemActionsProps) {
  // 从服务端数据构建初始状态
  const initialFeedbackState = {
    isLiked: data.trigger_history[0]?.user_feedback?.feedback_type === 'like',
    isDisliked: data.trigger_history[0]?.user_feedback?.feedback_type === 'dislike',
    likeCount: data.trigger_history[0]?.like_count || 0,
    dislikeCount: data.trigger_history[0]?.dislike_count || 0,
    dislikeReason: data.trigger_history[0]?.user_feedback?.dislike_reason,
  }

  // 使用专门的agent反馈hooks
  const { loadingStates, onLike, onDislike, feedbackState } = useAgentTriggerHistoryFeedback({
    triggerHistoryId: data.trigger_history[0]?.id || '',
    initialFeedbackState,
  })

  return (
    <ItemActions
      responseContentRef={responseContentRef}
      config={{
        like: true,
        dislike: true,
      }}
      isLiked={feedbackState.isLiked}
      isDisliked={feedbackState.isDisliked}
      dislikeReason={feedbackState.dislikeReason}
      likeCount={feedbackState.likeCount}
      dislikeCount={feedbackState.dislikeCount}
      feedbackLoadingStates={loadingStates}
      onLike={onLike}
      onDislike={onDislike}
    />
  )
})

export default AgentTriggerItemActions
