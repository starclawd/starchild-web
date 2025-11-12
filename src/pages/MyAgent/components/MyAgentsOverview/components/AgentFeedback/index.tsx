import { memo, RefObject } from 'react'
import { AgentOverviewDetailDataType } from 'store/myagent/myagent'
import { LoadingStates } from '../Feedback/types'
import Feedback from '../Feedback'
import { useAgentTriggerHistoryFeedback } from '../../../../../../store/myagent/hooks/useAgentTriggerHistoryFeedbackHooks'

interface AgentFeedbackProps {
  data: AgentOverviewDetailDataType
  responseContentRef?: RefObject<HTMLDivElement>
}

const AgentFeedback = memo(function AgentFeedback({ data, responseContentRef }: AgentFeedbackProps) {
  // 使用专门的agent反馈hooks
  const {
    loadingStates: feedbackLoadingStates,
    onLike,
    onDislike,
  } = useAgentTriggerHistoryFeedback({
    agentId: data.task_id,
    triggerHistoryId: String(data.id),
  })

  // 将feedbackLoadingStates转换为组件需要的LoadingStates格式
  const loadingStates: LoadingStates = {
    like: feedbackLoadingStates.like,
    dislike: feedbackLoadingStates.dislike,
    refresh: false,
  }

  return (
    <Feedback
      responseContentRef={responseContentRef}
      config={{
        copy: true,
        like: true,
        dislike: true,
        refresh: false,
      }}
      loadingStates={loadingStates}
      onLike={onLike}
      onDislike={onDislike}
    />
  )
})

export default AgentFeedback
