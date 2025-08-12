import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import dayjs from 'dayjs'
import Avatar from 'components/Avatar'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import { AgentDetailDataType, AGENT_TYPE } from 'store/agentdetail/agentdetail'
import { useTimezone } from 'store/timezonecache/hooks'
import { useGetBacktestData } from 'store/myagent/hooks'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import BacktestView from '../BacktestView'
import AgentShare, { useCopyImgAndText } from 'components/AgentShare'
import Pending from 'components/Pending'

interface AgentOverviewCardProps {
  data: AgentDetailDataType
}

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 800px;
  background: ${({ theme }) => theme.black900};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  transition: all ${ANI_DURATION}s ease;
  gap: 24px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      padding: ${vm(20)};
      border-radius: ${vm(24)};
      gap: ${vm(24)};
    `}
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 8px;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const UserName = styled.div`
  color: ${({ theme }) => theme.textL2};
`

const TriggerTime = styled.div`
  color: ${({ theme }) => theme.textL3};
  margin-left: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-left: ${vm(12)};
    `}
`

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 7px 8px;
  background: transparent;
  border-radius: 8px;
  color: ${({ theme }) => theme.textL3};
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;

  .icon-chat-share {
    font-size: 16px;
  }

  &:hover {
    background: ${({ theme }) => theme.bgT20};
    color: ${({ theme }) => theme.textL1};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(16)};
      border-radius: ${vm(20)};
      font-size: ${vm(14)};
      gap: ${vm(6)};

      .icon-chat-share {
        font-size: ${vm(16)};
      }
    `}
`

const TitleSection = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 12px;
  margin-bottom: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
      border-radius: ${vm(12)};
      margin-bottom: ${vm(16)};
    `}
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  line-height: 1.5;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
    `}
`

function AgentOverviewCard({ data }: AgentOverviewCardProps) {
  const [timezone] = useTimezone()
  const { backtestData, isLoading, error, fetchBacktestData } = useGetBacktestData()
  const shareDomRef = useRef<HTMLDivElement>(null)
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const copyImgAndText = useCopyImgAndText()
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/agentdetail?agentId=${data.task_id}`
  }, [data.task_id])

  const isBacktestTask = data.task_type === AGENT_TYPE.BACKTEST_TASK

  useEffect(() => {
    if (isBacktestTask && data.task_id) {
      fetchBacktestData(data.task_id)
    }
  }, [isBacktestTask, data.task_id, fetchBacktestData])

  const firstTriggerHistory = data.trigger_history?.[0]
  const triggerTime = firstTriggerHistory?.trigger_time
  const message = firstTriggerHistory?.message || firstTriggerHistory?.error

  const formatTriggerTime = useCallback(
    (timestamp: number) => {
      if (!timestamp) return ''
      return dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')
    },
    [timezone],
  )

  const shareImg = useCallback(() => {
    copyImgAndText({
      shareUrl,
      shareDomRef: shareDomRef as RefObject<HTMLDivElement>,
      setIsCopyLoading,
    })
  }, [shareUrl, shareDomRef, copyImgAndText, setIsCopyLoading])

  return (
    <CardWrapper data-agent-id={data.task_id}>
      <CardHeader>
        <UserInfo>
          <Avatar size={16} name={data.user_name || 'Unknown'} avatar={data.user_avatar} />
          <UserName>{data.user_name || 'Unknown User'}</UserName>
          {triggerTime && <TriggerTime>{formatTriggerTime(triggerTime)}</TriggerTime>}
        </UserInfo>

        <ShareButton onClick={shareImg}>
          {isCopyLoading ? <Pending /> : <IconBase className='icon-chat-share' />}
          <Trans>Share</Trans>
        </ShareButton>
      </CardHeader>

      <TitleSection>
        <Title>{data.title || 'Untitled Agent'}</Title>
      </TitleSection>
      {isBacktestTask && <BacktestView agentDetailData={data} backtestData={backtestData} />}
      {message && <Markdown>{message}</Markdown>}
      <AgentShare agentDetailData={data} ref={shareDomRef} shareUrl={shareUrl} />
    </CardWrapper>
  )
}

export default memo(AgentOverviewCard)
