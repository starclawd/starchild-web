import { IconButton } from 'components/Button'
import AgentShare, { useCopyImgAndText } from 'components/AgentShare'
import { vm } from 'pages/helper'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useGetSubscribedAgents,
  useIsAgentSubscribed,
  useIsSelfAgent,
  useSubscribeAgent,
  useUnsubscribeAgent,
} from 'store/agenthub/hooks'
import { useUserInfo } from 'store/login/hooks'
import styled, { css, useTheme } from 'styled-components'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import SubscribeButton from 'pages/AgentHub/components/AgentCardList/components/SubscribeButton'
import useSubErrorInfo from 'hooks/useSubErrorInfo'
import { CommonTooltip } from 'components/Tooltip'
import { Trans } from '@lingui/react/macro'

const AgentDetailOperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      position: sticky;
      bottom: 0;
      z-index: 5;
      justify-content: space-between;
      background-color: ${({ theme }) => theme.bgL0};
      padding: ${vm(8)} ${vm(20)};
      gap: ${vm(8)};
    `}
`

export default function AgentDetailOperator({ agentDetailData }: { agentDetailData: AgentDetailDataType }) {
  const [{ telegramUserId }] = useUserInfo()
  const shareDomRef = useRef<HTMLDivElement>(null)
  const copyImgAndText = useCopyImgAndText()
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
  const subErrorInfo = useSubErrorInfo()
  const triggerSubscribeAgent = useSubscribeAgent()
  const triggerUnsubscribeAgent = useUnsubscribeAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const { task_id, id } = agentDetailData
  const isSubscribed = useIsAgentSubscribed(task_id)
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/agentdetail?agentId=${id}`
  }, [id])
  const isSelfAgent = useIsSelfAgent(task_id)
  const theme = useTheme()

  const shareImg = useCallback(() => {
    copyImgAndText({
      shareUrl,
      shareDomRef: shareDomRef as RefObject<HTMLDivElement>,
      setIsCopyLoading,
    })
  }, [shareUrl, shareDomRef, copyImgAndText, setIsCopyLoading])

  const subscribeAgent = useCallback(async () => {
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

  const stopOrStartAgent = useCallback(() => {
    // TODO: 停止或启动agent
    console.log('stopOrStartAgent')
  }, [])

  const deleteAgent = useCallback(() => {
    // TODO: 删除agent
    console.log('deleteAgent')
  }, [])

  useEffect(() => {
    if (telegramUserId) {
      triggerGetSubscribedAgents()
    }
  }, [triggerGetSubscribedAgents, telegramUserId])

  return (
    <AgentDetailOperatorWrapper>
      {isSelfAgent && (
        <CommonTooltip content={<Trans>Delete</Trans>}>
          <IconButton icon='icon-chat-rubbish' color={theme.ruby50} onClick={deleteAgent} />
        </CommonTooltip>
      )}

      {/* <CommonTooltip content={<Trans>Suspend</Trans>}>
        <IconButton icon='icon-chat-stop-play' onClick={stopOrStartAgent} />
      </CommonTooltip> */}

      <CommonTooltip content={<Trans>Share</Trans>}>
        <IconButton icon='icon-chat-share' onClick={shareImg} pending={isCopyLoading} />
      </CommonTooltip>

      {!isSelfAgent && (
        <SubscribeButton
          isSubscribed={isSubscribed}
          onClick={subscribeAgent}
          size='medium'
          pending={isSubscribeLoading}
          width='fit-content'
        />
      )}

      <AgentShare shareUrl={shareUrl} ref={shareDomRef} agentDetailData={agentDetailData} />
    </AgentDetailOperatorWrapper>
  )
}
