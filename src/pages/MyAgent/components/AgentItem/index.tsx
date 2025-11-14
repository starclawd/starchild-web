import dayjs from 'dayjs'
import styled, { css } from 'styled-components'
import { useCallback } from 'react'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import AgentOperator from '../AgentOperator'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import AgentStatus from 'pages/AgentDetail/components/AgentStatus'
import { useBacktestData, useGetBacktestData } from 'store/agentdetail/hooks'
import { useCurrentRouter, useIsMobile, useIsShowMobileMenu } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { useTimezone } from 'store/timezonecache/hooks'
import { ANI_DURATION } from 'constants/index'
import useParsedQueryString from 'hooks/useParsedQueryString'

const AgentItemWrapper = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.black700};
  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(8)};
          padding: ${vm(8)};
          border-radius: ${vm(8)};
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.black600};
          }
        `}
  ${({ $isSelected }) =>
    $isSelected &&
    css`
      border: 1px solid ${({ theme }) => theme.brand100};
    `}
`

const ItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(24)};
    `}
`

const Title = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`

const Time = styled.span`
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.textL4};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.11rem;
      line-height: 0.16rem;
    `}
`

export default function AgentItem({
  data,
  fromPage = 'myagent',
}: {
  data: AgentDetailDataType
  fromPage?: 'myagent' | 'insights'
}) {
  const [timezone] = useTimezone()
  const [, setCurrentRouter] = useCurrentRouter()
  const isMobile = useIsMobile()
  const [, setBacktestData] = useBacktestData()
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const triggerGetBacktestData = useGetBacktestData()
  const { agentId } = useParsedQueryString()
  const { id, title, created_at, triggered_at, status } = data
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setBacktestData(null)
      setCurrentRouter(`${ROUTER.AGENT_DETAIL}?agentId=${id}&from=${fromPage}`)
      if (isMobile) {
        setIsShowMobileMenu(false)
      }
    },
    [id, isMobile, setBacktestData, setCurrentRouter, setIsShowMobileMenu, fromPage],
  )

  return (
    <AgentItemWrapper
      key={id}
      className='agent-item-wrapper'
      onClick={handleClick}
      $isSelected={agentId === id.toString()}
    >
      <ItemTop>
        <AgentStatus status={status} />
        <AgentOperator data={data} />
      </ItemTop>
      <Title>{title}</Title>
      <Time>
        <Trans>Update time</Trans>:&nbsp;
        {(triggered_at ?? created_at)
          ? dayjs.tz(triggered_at ?? created_at, timezone).format('YYYY-MM-DD HH:mm:ss')
          : '--'}
      </Time>
    </AgentItemWrapper>
  )
}
