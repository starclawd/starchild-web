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
import { useIsMobile } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'

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

const Content = styled.div<{ $isExpanded?: boolean; $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}

  .description-text {
    transition: max-height ${ANI_DURATION}s;
    overflow: hidden;
    ${({ $isMobile, $isExpanded }) =>
      $isMobile &&
      !$isExpanded &&
      css`
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
      `}
  }
`

const ShowMore = styled.div<{ $isExpanded?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  ${({ theme, $isExpanded }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      color: ${theme.blue100};
      .icon-chat-expand {
        font-size: 0.14rem;
        color: ${theme.blue100};
        transform: ${$isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)'};
        transition: transform 0.2s ease;
      }
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
  const isMobile = useIsMobile()
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsShowMore, setNeedsShowMore] = useState(false)
  const [maxHeight, setMaxHeight] = useState<string>('none')
  const shareDomRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const [taskDetail, setTaskDetail] = useTaskDetail()
  const { description, created_at, status, task_id } = taskDetail
  const [timezone] = useTimezone()
  const isSubscribed = useIsAgentSubscribed(task_id)
  const [{ telegramUserId }] = useUserInfo()
  const copyImgAndText = useCopyImgAndText()
  const triggerSubscribeAgent = useSubscribeAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const formatTime = dayjs.tz(created_at, timezone).format('YYYY-MM-DD HH:mm:ss')

  // 检测文本是否超过3行并计算高度
  const checkTextOverflow = useCallback(() => {
    if (!isMobile || !descriptionRef.current) return false

    const element = descriptionRef.current
    const computedStyle = window.getComputedStyle(element)
    const lineHeight = parseFloat(computedStyle.lineHeight)
    const threeLineHeight = lineHeight * 3 // 3行的高度

    // 临时移除所有限制来获取实际高度
    const originalDisplay = element.style.display
    const originalWebkitLineClamp = element.style.webkitLineClamp
    const originalWebkitBoxOrient = element.style.webkitBoxOrient

    element.style.display = 'block'
    element.style.webkitLineClamp = 'none'
    element.style.webkitBoxOrient = 'initial'

    const fullHeight = element.scrollHeight

    // 设置最大高度值以支持过渡动画
    if (isExpanded) {
      setMaxHeight(`${fullHeight}px`)
    } else {
      setMaxHeight(`${threeLineHeight}px`)
    }

    // 恢复原有样式
    if (!isExpanded) {
      element.style.display = originalDisplay || '-webkit-box'
      element.style.webkitLineClamp = originalWebkitLineClamp || '3'
      element.style.webkitBoxOrient = originalWebkitBoxOrient || 'vertical'
    } else {
      element.style.display = 'block'
      element.style.webkitLineClamp = 'none'
      element.style.webkitBoxOrient = 'initial'
    }

    return fullHeight > threeLineHeight
  }, [isMobile, isExpanded])

  // 监听 description 变化，检查是否需要显示 "Show more"
  useEffect(() => {
    if (description && isMobile) {
      // 使用 setTimeout 确保 DOM 已经渲染
      setTimeout(() => {
        const overflow = checkTextOverflow()
        setNeedsShowMore(overflow)
      }, 100)
    } else {
      setNeedsShowMore(false)
      setMaxHeight('none')
    }
  }, [description, isMobile, checkTextOverflow])

  // 当展开状态改变时更新高度
  useEffect(() => {
    if (isMobile && needsShowMore) {
      checkTextOverflow()
    }
  }, [isExpanded, isMobile, needsShowMore, checkTextOverflow])

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

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  useEffect(() => {
    if (telegramUserId) {
      triggerGetSubscribedAgents()
    }
  }, [triggerGetSubscribedAgents, telegramUserId])

  return (
    <TaskDescriptionWrapper $borderColor={theme.lineDark8} $borderRadius={24} $borderStyle='dashed'>
      <Title>
        <Trans>Agent description</Trans>
        <Status $isPending={status === TASK_STATUS.PENDING || status === TASK_STATUS.RUNNING}>
          <span></span>
          <span>{statusText}</span>
        </Status>
      </Title>
      <Content $isExpanded={isExpanded} $isMobile={isMobile}>
        <span className='description-text' ref={descriptionRef} style={{ maxHeight: isMobile ? maxHeight : 'none' }}>
          {description}
        </span>
        {isMobile && needsShowMore && (
          <ShowMore $isExpanded={isExpanded} onClick={toggleExpanded}>
            <span>{isExpanded ? <Trans>Show less</Trans> : <Trans>Show more</Trans>}</span>
            <IconBase className='icon-chat-expand' />
          </ShowMore>
        )}
      </Content>
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
