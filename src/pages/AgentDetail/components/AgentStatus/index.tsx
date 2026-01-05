import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { AGENT_STATUS } from 'store/agentdetail/agentdetail'
import styled, { css } from 'styled-components'

const AgentStatusWrapper = styled.div<{ $status: AGENT_STATUS }>`
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
      background-color: ${({ theme }) => theme.brand100};
    }
  }
  span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.brand100};
  }
  ${({ $status }) =>
    ($status === AGENT_STATUS.PENDING || $status === AGENT_STATUS.RUNNING) &&
    css`
      span:first-child {
        &::before {
          background-color: ${({ theme }) => theme.brand100};
        }
      }
      span:last-child {
        color: ${({ theme }) => theme.brand100};
      }
    `}
  ${({ $status }) =>
    $status === AGENT_STATUS.COMPLETED &&
    css`
      span:first-child {
        &::before {
          background-color: ${({ theme }) => theme.green100};
        }
      }
      span:last-child {
        color: ${({ theme }) => theme.green100};
      }
    `}
  ${({ $status }) =>
    $status === AGENT_STATUS.FAILED &&
    css`
      span:first-child {
        &::before {
          background-color: ${({ theme }) => theme.red100};
        }
      }
      span:last-child {
        color: ${({ theme }) => theme.red100};
      }
    `}
  ${({ $status }) =>
    $status === AGENT_STATUS.CANCELLED &&
    css`
      span:first-child {
        &::before {
          background-color: ${({ theme }) => theme.black200};
        }
      }
      span:last-child {
        color: ${({ theme }) => theme.black200};
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

export default function AgentStatus({ status }: { status: AGENT_STATUS }) {
  const statusText = useMemo(() => {
    switch (status) {
      case AGENT_STATUS.PENDING:
        return <Trans>Active</Trans>
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
  return (
    <AgentStatusWrapper $status={status}>
      <span></span>
      <span>{statusText}</span>
    </AgentStatusWrapper>
  )
}
