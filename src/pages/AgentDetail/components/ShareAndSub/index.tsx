import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import AgentShare, { useCopyImgAndText } from 'components/AgentShare'
import { vm } from 'pages/helper'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useGetSubscribedAgents,
  useIsAgentSubscribed,
  useSubscribeAgent,
  useUnsubscribeAgent,
} from 'store/agenthub/hooks'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { getTgLoginUrl } from 'store/login/utils'
import styled, { css } from 'styled-components'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useCurrentRouter } from 'store/application/hooks'

const ShareAndSubOperator = styled.div`
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

const ButtonShare = styled(ButtonBorder)<{ $isSubscribed: boolean }>`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 6px;
  min-width: 86px;
  height: 40px;
  padding: 0 12px;
  border-radius: 32px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-share {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 50%;
      height: ${vm(40)};
      gap: ${vm(6)};
      .icon-chat-share {
        font-size: 0.18rem;
      }
      .pending-wrapper {
        .icon-loading {
          font-size: 0.18rem !important;
        }
      }
    `}
`

const ButtonSub = styled(ButtonCommon)<{ $isSubscribed: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  min-width: 112px;
  height: 40px;
  padding: 0 12px;
  border-radius: 32px;
  .icon-subscription,
  .icon-chat-noti-enable {
    font-size: 18px;
  }
  color: ${({ theme, $isSubscribed }) => ($isSubscribed ? theme.textL2 : theme.textL1)};
  background: ${({ theme, $isSubscribed }) => ($isSubscribed ? theme.bgT30 : theme.blue200)};
  .pending-wrapper {
    .icon-loading {
      color: ${({ theme }) => theme.textL1};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 50%;
      height: ${vm(40)};
      gap: ${vm(6)};
      .icon-subscription,
      .icon-chat-noti-enable {
        font-size: 0.18rem;
        color: ${({ theme }) => theme.textL1};
      }
    `}
`

export default function ShareAndSub({ agentDetailData }: { agentDetailData: AgentDetailDataType }) {
  const isLogin = useIsLogin()
  const [{ telegramUserId }] = useUserInfo()
  const shareDomRef = useRef<HTMLDivElement>(null)
  const copyImgAndText = useCopyImgAndText()
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
  const [currentRouter] = useCurrentRouter()
  const triggerSubscribeAgent = useSubscribeAgent()
  const triggerUnsubscribeAgent = useUnsubscribeAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const { task_id, id } = agentDetailData
  const isSubscribed = useIsAgentSubscribed(task_id)
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/agentdetail?agentId=${id}`
  }, [id])

  const shareImg = useCallback(() => {
    copyImgAndText({
      shareUrl,
      shareDomRef: shareDomRef as RefObject<HTMLDivElement>,
      setIsCopyLoading,
    })
  }, [shareUrl, shareDomRef, copyImgAndText, setIsCopyLoading])

  const subscribeAgent = useCallback(async () => {
    if (!isLogin) {
      window.location.href = getTgLoginUrl(currentRouter)
      return
    }
    setIsSubscribeLoading(true)
    try {
      const res = await (isSubscribed ? triggerUnsubscribeAgent : triggerSubscribeAgent)(task_id)
      if (res) {
        console.log('res', res)
        await triggerGetSubscribedAgents()
      }
      setIsSubscribeLoading(false)
    } catch (error) {
      setIsSubscribeLoading(false)
    }
  }, [
    isLogin,
    task_id,
    currentRouter,
    triggerGetSubscribedAgents,
    triggerSubscribeAgent,
    triggerUnsubscribeAgent,
    isSubscribed,
  ])

  useEffect(() => {
    if (telegramUserId) {
      triggerGetSubscribedAgents()
    }
  }, [triggerGetSubscribedAgents, telegramUserId])

  return (
    <ShareAndSubOperator>
      <ButtonShare $isSubscribed={isSubscribed} onClick={shareImg}>
        {isCopyLoading ? (
          <Pending />
        ) : (
          <>
            <IconBase className='icon-chat-share' />
            <Trans>Share</Trans>
          </>
        )}
      </ButtonShare>

      <ButtonSub $isSubscribed={isSubscribed} onClick={subscribeAgent}>
        {isSubscribeLoading ? (
          <Pending />
        ) : (
          <>
            <IconBase className={isSubscribed ? 'icon-chat-noti-enable' : 'icon-subscription'} />
            <Trans>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</Trans>
          </>
        )}
      </ButtonSub>

      <AgentShare shareUrl={shareUrl} ref={shareDomRef} agentDetailData={agentDetailData} />
    </ShareAndSubOperator>
  )
}
