import styled, { css } from 'styled-components'
import { useCallback, useEffect } from 'react'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import AgentOperator from '../AgentOperator'
import { AGENT_TYPE, AgentDetailDataType } from 'store/agentdetail/agentdetail'
import AgentStatus from 'pages/AgentDetail/components/AgentStatus'
import { useCurrentAgentDetailData } from 'store/myagent/hooks'
import { useGetBacktestData } from 'store/agentdetail/hooks'

const AgentItemWrapper = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 4px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.black700};
  ${({ theme }) =>
    theme.isMobile
      ? css``
      : css`
          cursor: pointer;
        `}
  ${({ $isSelected }) =>
    $isSelected &&
    css`
      border: 1px solid ${({ theme }) => theme.blue100};
    `}
`

const ItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  padding: 0 8px;
`

const ItemBottom = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 8px;
  width: 100%;
  .title {
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .description {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL2};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .interval {
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.textL4};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      .title {
        font-size: 0.13rem;
        line-height: 0.2rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .description {
        font-size: 0.12rem;
        line-height: 0.18rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .interval {
        font-size: 0.11rem;
        line-height: 0.16rem;
      }
    `}
`

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  > span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: transparent;
    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
  }
  > span:nth-child(2) {
    margin-right: 12px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  > span:nth-child(3) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 18px;
    padding: 0 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    line-height: 14px;
    color: ${({ theme }) => theme.textL2};
    background-color: ${({ theme }) => theme.text20};
  }
  > span:nth-child(4) {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin-left: 12px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      > span:first-child {
        width: ${vm(14)};
        height: ${vm(14)};
        margin-right: ${vm(4)};
        span {
          width: ${vm(6)};
          height: ${vm(6)};
        }
      }
      > span:nth-child(2) {
        margin-right: ${vm(12)};
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
      > span:nth-child(3) {
        height: ${vm(18)};
        padding: 0 ${vm(6)};
        border-radius: ${vm(4)};
        font-size: 0.1rem;
        line-height: 0.14rem;
      }
      > span:nth-child(4) {
        font-size: 0.16rem;
        line-height: 0.24rem;
        margin-left: ${vm(12)};
      }
    `}
`

export default function AgentItem({ data }: { data: AgentDetailDataType }) {
  const triggerGetBacktestData = useGetBacktestData()
  const { id, title, description, interval, status, task_type, task_id } = data
  const [currentAgentDetailData, setCurrentAgentDetailData] = useCurrentAgentDetailData()
  const handleClick = useCallback(() => {
    setCurrentAgentDetailData(data)
  }, [data, setCurrentAgentDetailData])

  useEffect(() => {
    if (currentAgentDetailData?.id === id && task_type === AGENT_TYPE.BACKTEST_TASK) {
      triggerGetBacktestData(task_id)
    }
  }, [currentAgentDetailData?.id, id, task_type, task_id, triggerGetBacktestData])

  return (
    <AgentItemWrapper
      key={id}
      className='agent-item-wrapper'
      onClick={handleClick}
      $isSelected={currentAgentDetailData?.id === id}
    >
      <ItemTop>
        <TopLeft>
          <AgentStatus status={status} />
        </TopLeft>
        <AgentOperator data={data} operatorType={1} />
      </ItemTop>
      <ItemBottom>
        <span className='title'>{title}</span>
        <span className='description'>{description}</span>
        <span className='interval'>
          <Trans>Execution time</Trans>:&nbsp;<span>{interval}</span>
        </span>
      </ItemBottom>
    </AgentItemWrapper>
  )
}
