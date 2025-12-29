import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import type { StrategyPerformance } from 'api/strategy'

interface StrategyStatusProps {
  strategyInfo?: StrategyPerformance | null
}

const VaultSubtitle = styled.div<{ $statusColor: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    width: 4px;
    height: 4px;
    background-color: ${({ $statusColor, theme }) => ($statusColor === 'green' ? theme.green100 : theme.textL4)};
  }
  span:last-child {
    font-size: 10px;
    font-style: normal;
    font-weight: 300;
    line-height: 120%;
    white-space: nowrap;
    color: ${({ $statusColor, theme }) => ($statusColor === 'green' ? theme.green100 : theme.textL4)};
  }
`

export default memo(function StrategyStatus({ strategyInfo }: StrategyStatusProps) {
  // 计算显示的状态文本和颜色
  const { statusText, statusColor } = useMemo(() => {
    const isPublic = strategyInfo?.is_public
    const status = strategyInfo?.status

    // 当 isPublic 是 true 或者 status 是 deployed，展示 Live，颜色是 green100
    if (isPublic === true || status === STRATEGY_STATUS.DEPLOYED) {
      return {
        statusText: <Trans>Live</Trans>,
        statusColor: 'green',
      }
    }

    // status 是 paused，展示 Suspended，颜色默认
    if (status === STRATEGY_STATUS.PAUSED) {
      return {
        statusText: <Trans>Suspended</Trans>,
        statusColor: 'default',
      }
    }

    // status 是 delisted 或 archived，展示 Terminated，颜色默认
    if (status === STRATEGY_STATUS.DELISTED || status === STRATEGY_STATUS.ARCHIVED) {
      return {
        statusText: <Trans>Terminated</Trans>,
        statusColor: 'default',
      }
    }

    // 其他情况的默认处理
    return {
      statusText: <Trans>Live</Trans>,
      statusColor: 'default',
    }
  }, [strategyInfo?.is_public, strategyInfo?.status])

  return (
    <VaultSubtitle $statusColor={statusColor}>
      <span></span>
      <span>{statusText}</span>
    </VaultSubtitle>
  )
})
