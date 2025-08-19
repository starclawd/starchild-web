import { memo, useCallback, useEffect, useState } from 'react'
import AgentActions, { ActionType } from 'components/AgentActions'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import {
  useGetSubscribedAgents,
  useIsAgentSubscribed,
  useSubscribeAgent,
  useUnsubscribeAgent,
} from 'store/agenthub/hooks'
import { useUserInfo } from 'store/login/hooks'
import useSubErrorInfo from 'hooks/useSubErrorInfo'

function AgentDetailOperator({ agentDetailData }: { agentDetailData: AgentDetailDataType }) {
  const [{ telegramUserId }] = useUserInfo()
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
  const subErrorInfo = useSubErrorInfo()
  const triggerSubscribeAgent = useSubscribeAgent()
  const triggerUnsubscribeAgent = useUnsubscribeAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const { task_id } = agentDetailData
  const isSubscribed = useIsAgentSubscribed(task_id)

  const handleSubscribe = useCallback(async () => {
    setIsSubscribeLoading(true)
    try {
      if (subErrorInfo()) {
        setIsSubscribeLoading(false)
        return
      }
      const res = await (isSubscribed ? triggerUnsubscribeAgent : triggerSubscribeAgent)(task_id)
      if (res) {
        await triggerGetSubscribedAgents()
      }
      setIsSubscribeLoading(false)
    } catch (error) {
      setIsSubscribeLoading(false)
    }
  }, [task_id, triggerGetSubscribedAgents, triggerSubscribeAgent, triggerUnsubscribeAgent, isSubscribed, subErrorInfo])

  const handlePause = useCallback(() => {
    // TODO: 停止或启动agent
    console.log('stopOrStartAgent')
  }, [])

  const handleDelete = useCallback(() => {
    // TODO: 删除agent
    console.log('deleteAgent')
  }, [])

  useEffect(() => {
    if (telegramUserId) {
      triggerGetSubscribedAgents()
    }
  }, [triggerGetSubscribedAgents, telegramUserId])

  return (
    <AgentActions
      data={agentDetailData}
      mode='toolbar'
      actions={[ActionType.SHARE, ActionType.SUBSCRIBE]}
      onPause={handlePause}
      onDelete={handleDelete}
      onSubscribe={handleSubscribe}
    />
  )
}

export default memo(AgentDetailOperator)
