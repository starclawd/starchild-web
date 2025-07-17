import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TASK_STATUS } from 'store/backtest/backtest.d'
import { useTaskDetail } from 'store/backtest/hooks'
import { useTheme } from 'store/themecache/hooks'
import { useTimezone } from 'store/timezonecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { IconBase } from 'components/Icons'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import TaskShare, { useCopyImgAndText } from 'components/TaskShare'
import Pending from 'components/Pending'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { getTgLoginUrl } from 'store/login/utils'
import { useGetSubscribedAgents, useIsAgentSubscribed, useSubscribeAgent } from 'store/agenthub/hooks'

const TaskDescriptionWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: fit-content;
  padding: 16px;
  background-color: ${({ theme }) => theme.bgT30};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding: ${vm(16)};
    `}
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.18rem;
      line-height: 0.26rem;
    `}
`

const Status = styled.div<{ $isPending: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: rgba(0, 169, 222, 0.08);
    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.textL4};
    }
  }
  span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  ${({ $isPending }) =>
    $isPending &&
    css`
      span:first-child {
        &::before {
          background-color: ${({ theme }) => theme.blue100};
        }
      }
      span:last-child {
        color: ${({ theme }) => theme.blue100};
      }
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      span:first-child {
        width: ${vm(14)};
        height: ${vm(14)};
        &::before {
          width: ${vm(6)};
          height: ${vm(6)};
        }
      }
      span:last-child {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

const Content = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const Time = styled.div`
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL4};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`

const Operator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      margin-top: ${vm(8)};
    `}
`

const ButtonSub = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 50%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 60px;
  background-color: ${({ theme }) => theme.blue200};
  color: ${({ theme }) => theme.textL1};
  .icon-subscription {
    font-size: 18px;
  }
  .pending-wrapper {
    .icon-loading {
      color: ${({ theme }) => theme.textL1};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      line-height: 0.24rem;
      height: ${vm(44)};
      gap: ${vm(6)};
      .icon-subscription {
        font-size: 0.18rem;
        color: ${({ theme }) => theme.textL1};
      }
    `}
`

const ButtonShare = styled(ButtonBorder)<{ $isSubscribed: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 50%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 60px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-share {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ $isSubscribed }) =>
    $isSubscribed &&
    css`
      width: 100%;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      line-height: 0.24rem;
      height: ${vm(44)};
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

export default function TaskDescription() {
  const theme = useTheme()
  const isLogin = useIsLogin()
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const shareDomRef = useRef<HTMLDivElement>(null)
  const [taskDetail, setTaskDetail] = useTaskDetail()
  const { description, created_at, status, task_id } = taskDetail
  const [timezone] = useTimezone()
  const isSubscribed = useIsAgentSubscribed(task_id)
  const copyImgAndText = useCopyImgAndText()
  const triggerSubscribeAgent = useSubscribeAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const formatTime = dayjs.tz(created_at, timezone).format('YYYY-MM-DD HH:mm:ss')
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/taskdetail?taskId=${task_id}`
  }, [task_id])
  const statusText = useMemo(() => {
    switch (status) {
      case TASK_STATUS.PENDING:
        return <Trans>Pending</Trans>
      case TASK_STATUS.RUNNING:
        return <Trans>Running</Trans>
      case TASK_STATUS.COMPLETED:
        return <Trans>Completed</Trans>
      case TASK_STATUS.FAILED:
        return <Trans>Failed</Trans>
      case TASK_STATUS.CANCELLED:
        return <Trans>Cancelled</Trans>
    }
  }, [status])
  const shareImg = useCallback(() => {
    copyImgAndText({
      shareUrl,
      shareDomRef: shareDomRef as RefObject<HTMLDivElement>,
      setIsCopyLoading,
    })
  }, [shareUrl, shareDomRef, copyImgAndText, setIsCopyLoading])
  const subscribeTask = useCallback(async () => {
    if (!isLogin) {
      window.location.href = getTgLoginUrl()
      return
    }
    setIsSubscribeLoading(true)
    try {
      const res = await triggerSubscribeAgent(task_id)
      if (res) {
        console.log('res', res)
        await triggerGetSubscribedAgents()
      }
      setIsSubscribeLoading(false)
    } catch (error) {
      setIsSubscribeLoading(false)
    }
  }, [isLogin, task_id, triggerGetSubscribedAgents, triggerSubscribeAgent])
  useEffect(() => {
    if (isLogin) {
      triggerGetSubscribedAgents()
    }
  }, [triggerGetSubscribedAgents, isLogin])
  return (
    <TaskDescriptionWrapper $borderColor={theme.lineDark8} $borderRadius={24} $borderStyle='dashed'>
      <Title>
        <Trans>Task description</Trans>
        <Status $isPending={status === TASK_STATUS.PENDING || status === TASK_STATUS.RUNNING}>
          <span></span>
          <span>{statusText}</span>
        </Status>
      </Title>
      <Content>{description}</Content>
      <Time>
        <Trans>Creation time: {formatTime}</Trans>
      </Time>
      <Operator>
        {!isSubscribed && (
          <ButtonSub onClick={subscribeTask}>
            {isSubscribeLoading ? (
              <Pending />
            ) : (
              <>
                <IconBase className='icon-subscription' />
                <Trans>Subscribe</Trans>
              </>
            )}
          </ButtonSub>
        )}
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
      </Operator>
      <TaskShare shareUrl={shareUrl} ref={shareDomRef} taskDetail={taskDetail} />
    </TaskDescriptionWrapper>
  )
}
