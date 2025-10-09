import { memo, useCallback, useEffect, useState } from 'react'
import AgentActions from 'components/AgentActions'
import { ActionType } from 'components/AgentActions/types'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import {
  useGetSubscribedAgents,
  useIsAgentSubscribed,
  useSubscribeAgent,
  useUnsubscribeAgent,
} from 'store/agenthub/hooks'
import { useUserInfo } from 'store/login/hooks'
import useSubErrorInfo from 'hooks/useSubErrorInfo'
import { isPro } from 'utils/url'
import {
  useCreateAgentModalToggle,
  useDeleteMyAgentModalToggle,
  useIsMobile,
  useIsShowMobileMenu,
} from 'store/application/hooks'
import { useCurrentEditAgentData } from 'store/myagent/hooks'

function AgentDetailOperator({ agentDetailData }: { agentDetailData: AgentDetailDataType }) {
  const [{ telegramUserId }] = useUserInfo()
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
  const subErrorInfo = useSubErrorInfo()
  const triggerSubscribeAgent = useSubscribeAgent()
  const triggerUnsubscribeAgent = useUnsubscribeAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const [, setCurrentEditAgentData] = useCurrentEditAgentData()
  const toggleDeleteMyAgentModal = useDeleteMyAgentModalToggle()
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const isMobile = useIsMobile()
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const { id } = agentDetailData
  const isSubscribed = useIsAgentSubscribed(id)

  const handleSubscribe = useCallback(async () => {
    setIsSubscribeLoading(true)
    try {
      if (subErrorInfo()) {
        setIsSubscribeLoading(false)
        return
      }
      const res = await (isSubscribed ? triggerUnsubscribeAgent : triggerSubscribeAgent)(id)
      if (res) {
        await triggerGetSubscribedAgents()
      }
      setIsSubscribeLoading(false)
    } catch (error) {
      setIsSubscribeLoading(false)
    }
  }, [id, triggerGetSubscribedAgents, triggerSubscribeAgent, triggerUnsubscribeAgent, isSubscribed, subErrorInfo])

  const handlePause = useCallback(() => {
    // TODO: 停止或启动agent
    console.log('stopOrStartAgent')
  }, [])

  const handleEdit = useCallback(() => {
    setCurrentEditAgentData(agentDetailData)
    toggleCreateAgentModal()
  }, [agentDetailData, toggleCreateAgentModal, setCurrentEditAgentData])

  const handleDelete = useCallback(async () => {
    setCurrentEditAgentData(agentDetailData)
    toggleDeleteMyAgentModal()
    if (isMobile) {
      setIsShowMobileMenu(false)
    }
  }, [agentDetailData, isMobile, setIsShowMobileMenu, toggleDeleteMyAgentModal, setCurrentEditAgentData])

  useEffect(() => {
    if (telegramUserId) {
      triggerGetSubscribedAgents()
    }
  }, [triggerGetSubscribedAgents, telegramUserId])

  return (
    <AgentActions
      data={agentDetailData}
      mode='toolbar'
      actions={
        isPro
          ? [ActionType.SHARE, ActionType.EDIT, ActionType.DELETE, ActionType.SUBSCRIBE]
          : [ActionType.SHARE, ActionType.EDIT, ActionType.DELETE, ActionType.SUBSCRIBE]
      }
      onPause={handlePause}
      onDelete={handleDelete}
      onSubscribe={handleSubscribe}
      onEdit={handleEdit}
    />
  )
}

export default memo(AgentDetailOperator)
