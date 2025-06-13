import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { BacktestData } from 'store/backtest/backtest'
import { useBacktestData } from 'store/backtest/hooks'
import styled, { css } from 'styled-components'
import { sub, toFix } from 'utils/calc'

const DataListWrapper = styled.div<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  width: 100%;
  gap: 4px;
  flex-wrap: wrap;
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && !$isMobileBackTestPage && css`
    flex-direction: column;
    gap: 0;
    padding: ${vm(12)};
    border-radius: ${vm(16)};
    background-color: ${({ theme }) => theme.bgL1};
  `}
`

const ItemWrapper = styled.div<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: calc((100% - 8px) / 3);
  height: 58px;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgT20};
  .title {
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px; 
    color: ${({ theme }) => theme.textL3};
  }
  .value {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && !$isMobileBackTestPage && css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: ${vm(24)};
    padding: 0;
    background-color: transparent;
    .title {
      font-size: 0.12rem;
      line-height: 0.18rem;
    }
    .value {
      font-size: 0.12rem;
      line-height: 0.18rem;
    }
  `}
`

export default function DataList({
  isMobileBackTestPage,
  backtestData,
}: {
  isMobileBackTestPage?: boolean
  backtestData: BacktestData
}) {
  const { final_value, maximum_drawdown, sharpe_ratio, funding_trends, details, win_rates } = backtestData
  const itemList = useMemo(() => {
    const initialEquity = funding_trends[0]?.funding
    return [
      {
        key: 'initialEquity',
        title: <Trans>Initial equity</Trans>,
        value: Number(toFix(initialEquity, 2)) || '--'
      },
      {
        key: 'Max drawdown',
        title: <Trans>Max drawdown</Trans>,
        value: maximum_drawdown || '--'
      },
      {
        key: 'PnL',
        title: <Trans>PnL</Trans>,
        value: Number(toFix(sub(final_value, initialEquity), 2)) || '--'
      },
      {
        key: 'Total trades',
        title: <Trans>Total trades</Trans>,
        value: details.length || '--'
      },
      {
        key: 'Wins',  
        title: <Trans>Wins</Trans>,
        value: win_rates || '--'
      },
      {
        key: 'Sharp ratio',
        title: <Trans>Sharp ratio</Trans>,
        value: sharpe_ratio || '--'
      }
    ]
  }, [win_rates, final_value, maximum_drawdown, sharpe_ratio, funding_trends, details.length])
  return <DataListWrapper $isMobileBackTestPage={isMobileBackTestPage}>
    {itemList.map((item) => {
      const { key, title, value } = item
      return (
        <ItemWrapper className="item-wrapper" $isMobileBackTestPage={isMobileBackTestPage} key={key}>
          <span className="title">{title}</span>
          <span className="value">{value}</span>
        </ItemWrapper>
      )
    })}
  </DataListWrapper>
}
