import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { BacktestData } from 'store/backtest/backtest'
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
  const { final_value, maximum_drawdown_rates, sharpe_ratio, details, win_rates, initial_value, maximum_drawdown_value, profit_factor, trades_per_day, avg_losing_trade, avg_winning_trade, run_up, annualized_return_rates } = backtestData
  const itemList = useMemo(() => {
    return [
      {
        key: 'initialEquity',
        title: <Trans>Initial equity</Trans>,
        value: initial_value ? toFix(initial_value, 2) : '--'
      },
      {
        key: 'Max drawdown',
        title: <Trans>Max drawdown</Trans>,
        value: maximum_drawdown_rates ? `${toFix(maximum_drawdown_value, 2)}(${maximum_drawdown_rates})` : '--'
      },
      {
        key: 'PnL',
        title: <Trans>PnL</Trans>,
        value: annualized_return_rates ? `${Number(toFix(sub(final_value, initial_value), 2))}(${annualized_return_rates})` : '--'
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
        key: 'Sharpe ratio',
        title: <Trans>Sharpe ratio</Trans>,
        value: sharpe_ratio || '--'
      },
      {
        key: 'Profit factor',
        title: <Trans>Profit factor</Trans>,
        value: profit_factor || '--'
      },
      {
        key: 'Trades per Day',
        title: <Trans>Trades per Day</Trans>,
        value: trades_per_day || '--'
      },
      {
        key: 'Avg Losing Trade',
        title: <Trans>Avg Losing Trade</Trans>,
        value: avg_losing_trade || '--'
      },
      {
        key: 'Avg Winning Trade',
        title: <Trans>Avg Winning Trade</Trans>,
        value: avg_winning_trade || '--'
      },
      {
        key: 'Run-up',
        title: <Trans>Run-up</Trans>,
        value: run_up || '--'
      }
    ]
  }, [win_rates, final_value, maximum_drawdown_rates, sharpe_ratio, details.length, initial_value, maximum_drawdown_value, profit_factor, trades_per_day, avg_losing_trade, avg_winning_trade, run_up, annualized_return_rates])
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
