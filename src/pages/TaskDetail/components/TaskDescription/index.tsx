import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { TASK_STATUS } from 'store/backtest/backtest.d'
import { useTaskDetail } from 'store/backtest/hooks'
import { useTheme } from 'store/themecache/hooks'
import { useTimezone } from 'store/timezonecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const TaskDescriptionWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: fit-content;
  padding: 16px;
  background-color: ${({ theme }) => theme.bgT30};
  ${({ theme }) => theme.isMobile && css`
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
  ${({ theme }) => theme.isMobile && css`
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
  ${({ $isPending }) => $isPending && css`
    span:first-child {
      &::before {
        background-color: ${({ theme }) => theme.blue100};
      }
    }
    span:last-child {
      color: ${({ theme }) => theme.blue100};
    }
  `}
  ${({ theme }) => theme.isMobile && css`
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
  ${({ theme }) => theme.isMobile && css`
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
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.13rem;
    line-height: 0.2rem;
  `}
`

export default function TaskDescription() {
  const theme = useTheme()
  const [{ description, created_at, status }] = useTaskDetail()
  const [timezone] = useTimezone()
  const formatTime =  dayjs.tz(created_at, timezone).format('YYYY-MM-DD HH:mm:ss')
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
  return <TaskDescriptionWrapper
    $borderColor={theme.lineDark8}
    $borderRadius={24}
    $borderStyle="dashed"
  >
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
  </TaskDescriptionWrapper>
}
