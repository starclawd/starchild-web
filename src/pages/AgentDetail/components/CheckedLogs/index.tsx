import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import NoData from 'components/NoData'
import { ANI_DURATION } from 'constants/index'
import { Fragment, useMemo, useState } from 'react'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import styled, { css } from 'styled-components'
import { useTimezone } from 'store/timezonecache/hooks'

const CheckedLogsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  gap: 20px;
`

const LogItem = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  transition: all ${ANI_DURATION}s ease-in-out;
  background-color: transparent;
  cursor: pointer;
  ${({ theme }) =>
    theme.isMobile
      ? css`
          &:active {
            background-color: ${({ theme }) => theme.black700};
          }
        `
      : css`
          &:hover {
            background-color: ${({ theme }) => theme.black700};
          }
        `}
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL1};
`

const Time = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};
`

const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`

const DetailsText = styled.span<{ $isExpanded: boolean }>`
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  flex: 1;
  transition: all ${ANI_DURATION}s ease-in-out;
  overflow: hidden;
  max-height: ${({ $isExpanded }) => ($isExpanded ? '500px' : '20px')};

  ${({ $isExpanded }) =>
    !$isExpanded &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
    `}
`

const ExpandIcon = styled(IconBase)<{ $isExpanded: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.textL4};
  transition: transform ${ANI_DURATION}s ease-in-out;
  flex-shrink: 0;
  margin-top: 3px;

  ${({ $isExpanded }) =>
    $isExpanded &&
    css`
      transform: rotate(180deg);
    `}
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.lineDark8};
  &:last-child {
    display: none;
  }
`

export default function CheckedLogs({ agentDetailData }: { agentDetailData: AgentDetailDataType }) {
  const { check_log } = agentDetailData
  const [timezone] = useTimezone()
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleExpanded = (index: number) => {
    const newExpandedItems = new Set(expandedItems)
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index)
    } else {
      newExpandedItems.add(index)
    }
    setExpandedItems(newExpandedItems)
  }

  if (check_log.length === 0) {
    return <NoData />
  }
  return (
    <CheckedLogsWrapper>
      {check_log.map((log, index) => {
        const { details, check_time } = log
        const isExpanded = expandedItems.has(index)
        return (
          <Fragment key={check_time}>
            <LogItem onClick={() => toggleExpanded(index)}>
              <TopContent>
                <Title>
                  <Trans>The agent was checked but not triggered.</Trans>
                </Title>
                <Time>{dayjs.tz(check_time * 1000, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
              </TopContent>
              <BottomContent>
                <DetailsText $isExpanded={isExpanded}>{JSON.stringify(details)}</DetailsText>
                <ExpandIcon className='icon-chat-expand-down' $isExpanded={isExpanded} />
              </BottomContent>
            </LogItem>
            <Line />
          </Fragment>
        )
      })}
    </CheckedLogsWrapper>
  )
}
