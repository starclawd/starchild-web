import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useCallback, useMemo, useRef, useState } from 'react'
import { AGENT_STATUS } from 'store/agentdetail/agentdetail'
import { useAgentDetailData } from 'store/agentdetail/hooks'
import { useTimezone } from 'store/timezonecache/hooks'
import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { useIsMobile } from 'store/application/hooks'
import { CommonTooltip } from 'components/Tooltip'
import { ANI_DURATION } from 'constants/index'
import ShareAndSub from '../ShareAndSub'

const AgentDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 12px;
  width: 100%;
  background-color: ${({ theme }) => theme.black900};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      position: sticky;
      top: 0;
      z-index: 10;
      gap: ${vm(12)};
      padding-top: ${vm(12)};
    `}
`

const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  > span:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.textL1};
    .icon-task-detail {
      font-size: 24px;
    }
  }
`

const ContentWrapper = styled.div<{ $isMobile: boolean; $isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.black700};
  transition: all ${ANI_DURATION}s;
  overflow: hidden;

  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(12)};
          padding: ${vm(16)};
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.black600};
          }
        `}

  ${({ $isMobile, $isCollapsed }) =>
    $isCollapsed &&
    css`
      ${$isMobile
        ? css`
            gap: 0;
          `
        : css`
            gap: 0;
          `}
    `}
`

const Title = styled.div<{ $isMobile: boolean; $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};

  > span:first-child {
    ${({ $isCollapsed }) =>
      $isCollapsed &&
      css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      `}
  }

  ${({ theme, $isMobile, $isCollapsed }) =>
    theme.isMobile &&
    css`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: ${vm(12)};
      font-size: 0.18rem;
      line-height: 0.26rem;

      ${$isCollapsed &&
      css`
        > span:first-child {
          width: 100%;
          font-size: 0.16rem;
          line-height: 0.24rem;
        }
      `}
    `}
`

const Status = styled.div<{ $isPending: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
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
      background-color: ${({ theme }) => theme.blue100};
    }
  }
  span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.blue100};
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

const Content = styled.div<{ $isMobile?: boolean; $isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  transition: all ${ANI_DURATION}s ease-in-out;

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      max-height: 0;
      opacity: 0;
      padding: 0;
      margin: 0;
    `}

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const Time = styled.div<{ $isMobile?: boolean; $isCollapsed: boolean }>`
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL4};
  transition: all ${ANI_DURATION}s ease-in-out;

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      max-height: 0;
      opacity: 0;
      padding: 0;
      margin: 0;
    `}

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`

export default function AgentDescription({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}) {
  const isMobile = useIsMobile()
  const descriptionRef = useRef<HTMLDivElement>(null)
  const [agentDetailData] = useAgentDetailData()
  const { description, created_at, status, title } = agentDetailData
  const [timezone] = useTimezone()
  const formatTime = dayjs.tz(created_at, timezone).format('YYYY-MM-DD HH:mm:ss')

  const statusText = useMemo(() => {
    switch (status) {
      case AGENT_STATUS.PENDING:
        return <Trans>Pending</Trans>
      case AGENT_STATUS.RUNNING:
        return <Trans>Running</Trans>
      case AGENT_STATUS.COMPLETED:
        return <Trans>Completed</Trans>
      case AGENT_STATUS.FAILED:
        return <Trans>Failed</Trans>
      case AGENT_STATUS.CANCELLED:
        return <Trans>Cancelled</Trans>
    }
  }, [status])

  // 点击切换收起/展开（桌面端和移动端都支持）
  const handleToggleCollapse = useCallback(() => {
    if (isMobile) {
      return
    }
    setIsCollapsed(!isCollapsed)
  }, [isMobile, isCollapsed, setIsCollapsed])

  return (
    <AgentDescriptionWrapper>
      {!isMobile && (
        <OperatorWrapper>
          <span>
            <IconBase className='icon-task-detail' />
            <Trans>Agent description</Trans>
          </span>
          <ShareAndSub />
        </OperatorWrapper>
      )}
      <CommonTooltip
        content={isMobile ? '' : <Trans>{isCollapsed ? 'Expand details' : 'Collapse details'}</Trans>}
        placement='top'
      >
        <ContentWrapper $isMobile={isMobile} $isCollapsed={isCollapsed} onClick={handleToggleCollapse}>
          <Title $isMobile={isMobile} $isCollapsed={isCollapsed}>
            <span>
              <Trans>{title}</Trans>
            </span>
            <Status $isPending={status === AGENT_STATUS.PENDING || status === AGENT_STATUS.RUNNING}>
              <span></span>
              <span>{statusText}</span>
            </Status>
          </Title>
          <Content $isMobile={isMobile} $isCollapsed={isCollapsed}>
            <span className='description-text' ref={descriptionRef}>
              {description}
            </span>
          </Content>
          <Time $isMobile={isMobile} $isCollapsed={isCollapsed}>
            <Trans>Creation time: {formatTime}</Trans>
          </Time>
        </ContentWrapper>
      </CommonTooltip>
    </AgentDescriptionWrapper>
  )
}
