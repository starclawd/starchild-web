import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import dayjs from 'dayjs'
import Avatar from 'components/Avatar'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import { AGENT_TYPE } from 'store/agentdetail/agentdetail'
import { AgentOverviewDetailDataType } from 'store/myagent/myagent'
import { useTimezone } from 'store/timezonecache/hooks'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import BacktestView from '../BacktestView'
import AgentShare, { useCopyText } from 'pages/AgentDetail/components/AgentShare'
import Pending from 'components/Pending'
import { useSetCurrentRouter, useGetTokenImg, useIsMobile } from 'store/application/hooks'
import LazyImage from 'components/LazyImage'
import Popover from 'components/Popover'
import ShareActionDropdown from 'pages/AgentDetail/components/AgentActions/components/ShareActionDropdown'
import { useShareActions } from 'pages/AgentDetail/components/AgentActions/hooks'
import { ROUTER } from 'pages/router'
import AgentTriggerItemFeedback from '../AgentTriggerItemFeedback'

interface AgentOverviewCardProps {
  data: AgentOverviewDetailDataType
  fromPage?: 'myagents' | 'insights'
}

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: ${({ theme }) => theme.black900};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.black800};
  transition: all ${ANI_DURATION}s ease;
  gap: 24px;
  cursor: pointer;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      padding: ${vm(12)};
      border-radius: ${vm(24)};
      gap: ${vm(16)};
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
  color: ${({ theme }) => theme.black100};
`

const TriggerTime = styled.div`
  color: ${({ theme }) => theme.black200};
`

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: transparent;
  border-radius: 8px;
  color: ${({ theme }) => theme.black200};
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;

  .icon-chat-share {
    font-size: 16px;
  }

  &:hover {
    background: ${({ theme }) => theme.black800};
    color: ${({ theme }) => theme.black0};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};

      .icon-chat-share {
        color: ${({ theme }) => theme.black200};
        font-size: 0.18rem;
      }

      &:hover {
        background: transparent;
      }
    `}
`

const TitleSection = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.black700};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  .symbol-info,
  .kol-info {
    display: flex;
    align-items: center;
    gap: 6px;
    height: fit-content;
    span {
      font-size: 13px;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) => theme.black0};
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
      border-radius: ${vm(12)};
      gap: ${vm(4)};
      .symbol-info,
      .kol-info {
        img {
          width: ${vm(32)};
          height: ${vm(32)};
        }
        span {
          font-size: 0.13rem;
          line-height: 0.2rem;
        }
      }
    `}
`

const Title = styled.div`
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.black0};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`

const AlertTitle = styled.div`
  font-size: 26px;
  font-weight: 500;
  line-height: 34px;
  color: ${({ theme }) => theme.black0};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.26rem;
      line-height: 0.34rem;
    `}
`

function AgentOverviewCard({ data, fromPage = 'myagents' }: AgentOverviewCardProps) {
  const [timezone] = useTimezone()
  const isMobile = useIsMobile()
  const setCurrentRouter = useSetCurrentRouter()
  const [showSharePopover, setShowSharePopover] = useState(false)
  const isBacktestTask = data.task_type === AGENT_TYPE.BACKTEST_TASK
  const symbol = useMemo(() => {
    return data?.backtest_result?.result?.symbol?.toUpperCase().replace('USDT', '') || ''
  }, [data?.backtest_result?.result])
  const firstTriggerHistory = data.trigger_history?.[0]
  const triggerTime = firstTriggerHistory?.trigger_time
  const content = firstTriggerHistory?.message || firstTriggerHistory?.error

  const splitContent = content?.split('\n\n')
  const alertTitle = splitContent?.[0]
  const alertMessage = splitContent?.slice(1).join('\n\n')

  // 使用分享相关的 hook
  const { shareDomRef, shareUrl, isCopyLoading, shareActionConfigs, setIsCopyLoading } = useShareActions({
    data,
    onClose: () => setShowSharePopover(false),
  })

  const copyText = useCopyText()

  const getTokenImg = useGetTokenImg()

  const formatTriggerTime = useCallback(
    (timestamp: number) => {
      if (!timestamp) return ''
      return dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')
    },
    [timezone],
  )

  const handleShareClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (isMobile) {
        setShowSharePopover(!showSharePopover)
      } else {
        copyText({
          shareUrl,
          setIsCopyLoading,
        })
      }
    },
    [isMobile, copyText, shareUrl, setIsCopyLoading, showSharePopover],
  )

  const handleShareMouseEnter = useCallback(() => {
    if (!isMobile) {
      setShowSharePopover(true)
    }
  }, [isMobile])

  const handleShareMouseLeave = useCallback(() => {
    if (!isMobile) {
      setShowSharePopover(false)
    }
  }, [isMobile])

  const handleClick = useCallback(() => {
    setCurrentRouter(`${ROUTER.AGENT_DETAIL}?agentId=${data.id}&from=${fromPage}`)
  }, [setCurrentRouter, data, fromPage])

  return (
    <CardWrapper data-agent-id={data.task_id} onClick={handleClick}>
      <CardHeader>
        <UserInfo>
          {/* <Avatar size={18} name={data.user_name || 'Unknown'} avatar={data.user_avatar} />
          <UserName>{data.user_name || 'Unknown User'}</UserName> */}
          {triggerTime && <TriggerTime>{formatTriggerTime(triggerTime)}</TriggerTime>}
        </UserInfo>

        <Popover
          show={showSharePopover}
          content={
            <ShareActionDropdown
              shareActionConfigs={shareActionConfigs}
              onItemClick={() => setShowSharePopover(false)}
            />
          }
          placement='bottom-end'
          onClick={handleShareClick}
          onMouseEnter={handleShareMouseEnter}
          onMouseLeave={handleShareMouseLeave}
          onClickOutside={() => setShowSharePopover(false)}
        >
          <ShareButton onClick={handleShareClick}>
            {isCopyLoading ? <Pending /> : <IconBase className='icon-chat-share' />}
            {!isMobile && <Trans>Share</Trans>}
          </ShareButton>
        </Popover>
      </CardHeader>

      <TitleSection>
        {data.kol_name && (
          <span className='kol-info'>
            <LazyImage src={data.kol_avatar} alt={data.kol_name} width={32} height={32} />
            <span>{data.kol_name}</span>
          </span>
        )}
        {symbol && (
          <span className='symbol-info'>
            <LazyImage src={getTokenImg(symbol)} alt={symbol} width={32} height={32} />
            <span>{symbol}</span>
          </span>
        )}
        <Title>{data.title || 'Untitled Agent'}</Title>
      </TitleSection>
      {isBacktestTask && data.backtest_result && (
        <div onClick={(e) => e.stopPropagation()}>
          <BacktestView agentDetailData={data} backtestData={data.backtest_result.result} />
        </div>
      )}
      {alertTitle && <AlertTitle>{alertTitle}</AlertTitle>}
      {alertMessage && <Markdown>{alertMessage}</Markdown>}
      <AgentShare agentDetailData={data} ref={shareDomRef} shareUrl={shareUrl} />
      <AgentTriggerItemFeedback triggerHistory={firstTriggerHistory} />
    </CardWrapper>
  )
}

export default memo(AgentOverviewCard)
