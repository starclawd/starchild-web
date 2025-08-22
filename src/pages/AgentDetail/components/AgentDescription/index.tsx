import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useCallback, useRef } from 'react'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useTimezone } from 'store/timezonecache/hooks'
import styled, { css, useTheme } from 'styled-components'
import { IconBase } from 'components/Icons'
import { useCurrentRouter, useIsMobile } from 'store/application/hooks'
import Tooltip from 'components/Tooltip'
import { ANI_DURATION } from 'constants/index'
import AgentDetailOperator from '../AgentDetailOperator'
import AgentStatus from '../AgentStatus'
import { ROUTER } from 'pages/router'
import { useCurrentAgentDetailData } from 'store/myagent/hooks'
import { IconButton } from 'components/Button'

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
    color: ${({ theme }) => theme.textL2};
    > i {
      font-size: 24px;
    }

    .icon-chat-back {
      &:hover {
        cursor: pointer;
      }
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
      : css``}

  ${({ $isMobile, $isCollapsed }) =>
    $isCollapsed
      ? css`
          ${$isMobile
            ? css`
                gap: 0;
              `
            : css`
                gap: 0;
              `}
        `
      : css`
          cursor: text;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL4};
  span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${({ theme }) => theme.textL3};
    white-space: nowrap;
    .icon-chat-expand {
      font-size: 18px;
      transform: rotate(90deg);
      transition: all ${ANI_DURATION}s;
    }
  }

  ${({ theme, $isCollapsed }) =>
    theme.isMobile
      ? css`
          font-size: 0.13rem;
          line-height: 0.2rem;
          span:last-child {
            .icon-chat-expand {
              font-size: 0.18rem;
            }
          }
          ${$isCollapsed &&
          css`
            margin-top: ${vm(12)};
            span:last-child {
              .icon-chat-expand {
                transform: rotate(270deg);
              }
            }
          `}
        `
      : css`
          span:last-child {
            cursor: pointer;
            &:hover {
              color: ${({ theme }) => theme.textL1};
              .icon-chat-expand {
                transform: rotate(270deg);
              }
            }
          }
          ${$isCollapsed &&
          css`
            max-height: 0;
            opacity: 0;
            padding: 0;
            margin: 0;
          `}
        `}
`

export default function AgentDescription({
  isCollapsed,
  setIsCollapsed,
  agentDetailData,
  showBackButton,
}: {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  agentDetailData: AgentDetailDataType
  showBackButton: boolean
}) {
  const isMobile = useIsMobile()
  const descriptionRef = useRef<HTMLDivElement>(null)
  const { description, created_at, status, title } = agentDetailData
  const [timezone] = useTimezone()
  const formatTime = dayjs.tz(created_at, timezone).format('YYYY-MM-DD HH:mm:ss')

  // 点击切换收起/展开（桌面端和移动端都支持）
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed, setIsCollapsed])

  const [, setCurrentRouter] = useCurrentRouter()
  const [, setCurrentAgentDetailData] = useCurrentAgentDetailData()
  const handleClick = useCallback(() => {
    setCurrentRouter(ROUTER.MY_AGENT)
    setCurrentAgentDetailData(null)
  }, [setCurrentRouter, setCurrentAgentDetailData])
  const theme = useTheme()

  return (
    <AgentDescriptionWrapper>
      {!isMobile && (
        <OperatorWrapper>
          <span>
            {showBackButton && <IconButton icon='icon-chat-back' onClick={handleClick} color={theme.textL2} />}
            <IconBase className='icon-task-detail' />
            <Trans>Agent description</Trans>
          </span>
          <AgentDetailOperator agentDetailData={agentDetailData} />
        </OperatorWrapper>
      )}
      <Tooltip content={isMobile ? '' : isCollapsed ? <Trans>Expand details</Trans> : ''} placement='top'>
        <ContentWrapper
          $isMobile={isMobile}
          $isCollapsed={isCollapsed}
          onClick={isCollapsed ? handleToggleCollapse : undefined}
        >
          <Title $isMobile={isMobile} $isCollapsed={isCollapsed}>
            <span>
              <Trans>{title}</Trans>
            </span>
            <AgentStatus status={status} />
          </Title>
          <Content $isMobile={isMobile} $isCollapsed={isCollapsed}>
            <span className='description-text' ref={descriptionRef}>
              {description}
            </span>
          </Content>
          <Time $isMobile={isMobile} $isCollapsed={isCollapsed}>
            <span>
              <Trans>Creation time: {formatTime}</Trans>
            </span>
            <span onClick={handleToggleCollapse}>
              {isMobile ? '' : <Trans>Collapse details</Trans>}
              <IconBase className='icon-chat-expand' />
            </span>
          </Time>
        </ContentWrapper>
      </Tooltip>
    </AgentDescriptionWrapper>
  )
}
