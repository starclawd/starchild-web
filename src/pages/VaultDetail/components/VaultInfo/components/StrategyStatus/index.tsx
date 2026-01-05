import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { t } from '@lingui/core/macro'
import { PAPER_TRADING_STATUS } from 'store/createstrategy/createstrategy'

interface StrategyStatusProps {
  status?: PAPER_TRADING_STATUS
}

const VaultSubtitle = styled.div<{ $statusColor: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    width: 4px;
    height: 4px;
    background-color: ${({ $statusColor, theme }) => ($statusColor === 'green' ? theme.green100 : theme.black300)};
  }
  span:last-child {
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: 120%;
    white-space: nowrap;
    color: ${({ $statusColor, theme }) => ($statusColor === 'green' ? theme.green100 : theme.black300)};
  }
`

export default memo(function StrategyStatus({ status }: StrategyStatusProps) {
  // 状态映射配置
  const statusConfig = useMemo(() => {
    const statusMap: Record<PAPER_TRADING_STATUS, { text: string; color: string }> = {
      [PAPER_TRADING_STATUS.RUNNING]: { text: t`Running`, color: 'green' },
      [PAPER_TRADING_STATUS.LIVE]: { text: t`Live`, color: 'green' },
      [PAPER_TRADING_STATUS.PAUSED]: { text: t`Paused`, color: 'default' },
      [PAPER_TRADING_STATUS.SUSPENDED]: { text: t`Suspended`, color: 'default' },
      [PAPER_TRADING_STATUS.TERMINATED]: { text: t`Terminated`, color: 'default' },
    }

    return status ? statusMap[status] : { text: t`Running`, color: 'default' }
  }, [status])

  const { text: statusText, color: statusColor } = statusConfig

  return (
    <VaultSubtitle $statusColor={statusColor}>
      <span></span>
      <span>{statusText}</span>
    </VaultSubtitle>
  )
})
