import { Trans } from '@lingui/react/macro'
import { StrategiesOverviewStrategy } from 'api/strategy'
import { useMemo } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled from 'styled-components'
import { toFix } from 'utils/calc'
import { formatNumber, formatPercent } from 'utils/format'

const StrategyDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`

const StrategyDataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black300};
  }
  span:last-child {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.black0};
  }
`

export default function StrategyData({ strategy }: { strategy: StrategiesOverviewStrategy }) {
  const theme = useTheme()
  const { all_time_apr, pnl, end_balance } = strategy
  const vaultDataList = useMemo(() => {
    const isPositive = (pnl || 0) > 0
    const isNegative = (pnl || 0) < 0
    const isAllTimeAprPositive = (all_time_apr || 0) > 0
    const isAllTimeAprNegative = (all_time_apr || 0) < 0
    return [
      {
        key: 'Equity',
        text: <Trans>Equity</Trans>,
        value: formatNumber(toFix(end_balance, 0), { showDollar: true }),
      },
      {
        key: ' Total PnL',
        text: <Trans> Total PnL</Trans>,
        value: (
          <span style={{ color: isPositive ? theme.green100 : isNegative ? theme.red100 : theme.black0 }}>
            {isPositive ? '+' : isNegative ? '-' : ''}${formatNumber(toFix(Math.abs(pnl || 0), 2))}
          </span>
        ),
      },
      {
        key: 'apr',
        text: <Trans>APR</Trans>,
        value: (
          <span
            style={{
              color: isAllTimeAprPositive ? theme.green100 : isAllTimeAprNegative ? theme.red100 : theme.black0,
            }}
          >
            {formatPercent({ value: all_time_apr || 0 })}
          </span>
        ),
      },
    ]
  }, [all_time_apr, pnl, end_balance, theme])
  return (
    <StrategyDataWrapper>
      {vaultDataList.map((item) => (
        <StrategyDataItem className='strategy-data-item' key={item.key}>
          <span>{item.text}</span>
          <span>{item.value}</span>
        </StrategyDataItem>
      ))}
    </StrategyDataWrapper>
  )
}
