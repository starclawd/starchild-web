import { Trans } from '@lingui/react/macro'
import { useMemo } from 'react'
import { AllStrategiesOverview } from 'store/vaults/vaults'
import styled from 'styled-components'
import { toFix } from 'utils/calc'
import { formatNumber, formatPercent } from 'utils/format'

const VaultDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`

const VaultDataItem = styled.div<{ $isPositive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  span:last-child {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme, $isPositive }) => ($isPositive ? theme.green100 : theme.red100)};
  }
  &:last-child {
    span:first-child {
      text-align: right;
      color: ${({ theme }) => theme.textL3};
    }
    span:last-child {
      text-align: right;
      color: ${({ theme }) => theme.textL2};
    }
  }
`

export default function VaultData({ strategy }: { strategy: AllStrategiesOverview }) {
  const { allTimeApr, pnl, maxDrawdown } = strategy
  const vaultDataList = useMemo(() => {
    return [
      {
        key: 'apr',
        text: <Trans>APR</Trans>,
        value: formatPercent({ value: allTimeApr / 100 }),
        isPositive: allTimeApr >= 0,
      },
      {
        key: 'pnl',
        text: <Trans>PnL</Trans>,
        value: `$${formatNumber(toFix(pnl || 0, 2))}`,
        isPositive: pnl >= 0,
      },
      {
        key: 'maxDrawdown',
        text: <Trans>Max drawdown</Trans>,
        value: formatPercent({ value: maxDrawdown }),
        isPositive: maxDrawdown >= 0,
      },
    ]
  }, [allTimeApr, pnl, maxDrawdown])
  return (
    <VaultDataWrapper>
      {vaultDataList.map((item) => (
        <VaultDataItem $isPositive={item.isPositive} key={item.key}>
          <span>{item.text}</span>
          <span>{item.value}</span>
        </VaultDataItem>
      ))}
    </VaultDataWrapper>
  )
}
