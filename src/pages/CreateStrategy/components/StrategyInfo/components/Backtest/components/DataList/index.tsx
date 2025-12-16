import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Tooltip from 'components/Tooltip'
import { vm } from 'pages/helper'
import { memo, useMemo } from 'react'
import { useIsMobile } from 'store/application/hooks'
import styled, { css, useTheme } from 'styled-components'
import { div, isLt, sub, toFix } from 'utils/calc'
import { formatPercent } from 'utils/format'
import { StrategyBacktestDataType } from 'store/createstrategy/createstrategy'
import { useIsShowWorkflow } from 'store/createstrategy/hooks/useBacktest'

const DataListWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  gap: 4px;
  flex-wrap: wrap;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: row;
      gap: 0;
      padding: ${vm(8)};
      border-radius: ${vm(12)};
      background-color: ${({ theme }) => theme.bgT20};
      position: relative;

      /* 中间竖线分割 */
      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: ${vm(8)};
        bottom: ${vm(8)};
        width: 1px;
        background-color: ${({ theme }) => theme.bgT20};
        transform: translateX(-50%);
      }
    `}
`

const ColumnWrapper = styled.div`
  display: none;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      display: flex;
      flex-direction: column;
      width: 50%;
      gap: ${vm(8)};
      &:last-child {
        padding-left: ${vm(12)};
      }
    `}
`

const ItemWrapper = styled.div<{ $isShowWorkflow?: boolean }>`
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
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
    .icon-warn {
      transform: rotate(180deg);
      font-size: 14px;
      color: ${({ theme }) => theme.textL4};
    }
  }
  .value {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    width: calc((100% - 8px) / 3);
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    width: calc((100% - 12px) / 4);
  `}
  ${({ $isShowWorkflow, theme }) =>
    $isShowWorkflow
      ? theme.mediaMinWidth.minWidth1920`
    width: calc((100% - 20px) / 6);
  `
      : theme.mediaMinWidth.minWidth1680`
    width: calc((100% - 20px) / 6);
  `}
 
  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(4)};
          width: 100%;
          height: ${vm(42)};
          padding: 0;
          background-color: transparent;
          min-width: unset;
          .title {
            gap: ${vm(4)};
            font-size: 0.12rem;
            line-height: 0.18rem;
            .icon-warn {
              font-size: 0.14rem;
            }
          }
          .value {
            font-size: 0.14rem;
            line-height: 0.2rem;
          }
        `
      : css``}
`

// 辅助函数：判断值是否为无效值（null、undefined 或 NaN）
const isInvalidValue = (val: unknown): val is null | undefined =>
  val === null || val === undefined || (typeof val === 'number' && isNaN(val))

export default memo(function DataList({ strategyBacktestData }: { strategyBacktestData: StrategyBacktestDataType }) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [isShowWorkflow] = useIsShowWorkflow()

  // 从 StrategyBacktestDataType 中提取数据
  const { result, params } = strategyBacktestData || {}
  const { metrics, summary, details, maximum_drawdown_value, maximum_runup_value, trades_per_day } = result || {}

  // 从 params 中获取初始资金
  const initial_value_raw = params?.initial_capital ?? summary?.initial_capital ?? null
  const initial_value = isInvalidValue(initial_value_raw) ? null : initial_value_raw

  // 从 result 中获取最终价值
  const final_value_raw =
    result?.final_value != null ? parseFloat(result.final_value) : (summary?.current_equity ?? null)
  const final_value = isInvalidValue(final_value_raw) ? null : final_value_raw

  // 从 metrics 中获取各项指标
  const sharpe_ratio_raw = result?.sharpe_ratio ?? metrics?.sharpe_ratio ?? null
  const sharpe_ratio = !isInvalidValue(sharpe_ratio_raw) ? String(sharpe_ratio_raw) : '--'

  const win_rate_raw = metrics?.win_rate ?? null
  const win_rates = !isInvalidValue(win_rate_raw) ? `${(win_rate_raw * 100).toFixed(2)}%` : '--'

  const profit_factor_raw = metrics?.profit_factor ?? null
  const profit_factor = !isInvalidValue(profit_factor_raw) ? profit_factor_raw.toFixed(2) : '--'

  const maximum_drawdown_rates = !isInvalidValue(metrics?.max_drawdown)
    ? formatPercent({ value: metrics?.max_drawdown })
    : '--'

  // 从 metrics 中获取其他指标
  const avg_win_raw = metrics?.average_win ?? null
  const avg_winning_trade = !isInvalidValue(avg_win_raw) ? `$${avg_win_raw.toFixed(2)}` : '--'

  const avg_loss_raw = metrics?.average_loss ?? null
  const avg_losing_trade = !isInvalidValue(avg_loss_raw) ? `$${Math.abs(avg_loss_raw).toFixed(2)}` : '--'

  // 从 summary 中获取交易统计
  const total_trades = summary?.total_trades ?? details?.length ?? null

  // 年化收益率和 run-up（API 可能未返回，使用 total_return 计算或显示 --）
  const annualized_return_rates = !isInvalidValue(metrics?.annualized_return)
    ? formatPercent({ value: metrics?.annualized_return })
    : '--'
  const run_up = null // API 未返回
  const run_up_rates = !isInvalidValue(metrics?.max_runup) ? formatPercent({ value: metrics?.max_runup }) : '--'

  // 安全计算 pnl，确保数值有效
  const hasValidData = !isInvalidValue(initial_value) && !isInvalidValue(final_value)
  const pnl = hasValidData ? sub(final_value, initial_value) : null
  const pnlRate = hasValidData && initial_value !== 0 ? div(pnl!, initial_value) : null
  const pnlDisplay = hasValidData
    ? `${Number(toFix(pnl!, 2))}(${formatPercent({ value: pnlRate!, precision: 2 })})`
    : '--'

  const itemList = useMemo(() => {
    return [
      {
        key: 'initialEquity',
        title: <Trans>Initial equity</Trans>,
        value: !isInvalidValue(initial_value) ? toFix(initial_value, 2) : '--',
        tooltip: 'The starting capital used at the beginning of backtest or live trading.',
      },
      {
        key: 'Max drawdown',
        title: <Trans>Max drawdown</Trans>,
        value: !isInvalidValue(maximum_drawdown_value) ? `${maximum_drawdown_value}(${maximum_drawdown_rates})` : '--',
        tooltip: 'The largest peak-to-trough decline in equity during the period.',
      },
      {
        key: 'Max Run-up',
        title: <Trans>Max Run-up</Trans>,
        value: !isInvalidValue(maximum_runup_value) ? `${maximum_runup_value}(${run_up_rates})` : '--',
        tooltip: 'The largest increase in equity from a trough to the next peak.',
      },
      {
        key: 'PnL',
        title: <Trans>PnL</Trans>,
        value: pnlDisplay,
        tooltip: 'Total net profit or loss generated by the strategy.',
        valueStyle: hasValidData && pnl !== null && isLt(pnl, 0) ? { color: theme.red100 } : { color: theme.green100 },
      },
      {
        key: 'APR (Annualized Return)',
        title: <Trans>APR</Trans>,
        value: annualized_return_rates,
        tooltip: 'Annualized percentage return based on total strategy performance.',
        // valueStyle:
        //   annualized_return_rates !== '--' && annualized_return_rates.includes('-')
        //     ? { color: theme.red100 }
        //     : { color: theme.green100 },
      },
      {
        key: 'Total trades',
        title: <Trans>Total trades</Trans>,
        value: !isInvalidValue(total_trades) ? total_trades : '--',
        tooltip: 'Total number of trades executed during the period.',
      },
      {
        key: 'Trades per Day',
        title: <Trans>Trades per Day</Trans>,
        value: trades_per_day,
        tooltip: 'Average number of trades executed per day.',
      },
      {
        key: 'Win Rate',
        title: <Trans>Win Rate</Trans>,
        value: win_rates,
        tooltip: 'The percentage of trades that were profitable.',
      },
      {
        key: 'Avg Winning Trade',
        title: <Trans>Avg Winning Trade</Trans>,
        value: avg_winning_trade,
        tooltip: 'The average profit from winning trades.',
      },
      {
        key: 'Avg Losing Trade',
        title: <Trans>Avg Losing Trade</Trans>,
        value: avg_losing_trade,
        tooltip: 'The average loss from losing trades.',
      },
      {
        key: 'Profit Factor',
        title: <Trans>Profit Factor</Trans>,
        value: profit_factor,
        tooltip: 'Ratio of gross profits to gross losses; a measure of risk/reward efficiency.',
      },
      {
        key: 'Sharpe ratio',
        title: <Trans>Sharpe ratio</Trans>,
        value: sharpe_ratio,
        tooltip: 'The excess return per unit of risk (volatility); used to evaluate risk-adjusted return.',
      },
    ]
  }, [
    win_rates,
    maximum_drawdown_rates,
    sharpe_ratio,
    total_trades,
    initial_value,
    maximum_drawdown_value,
    run_up_rates,
    profit_factor,
    trades_per_day,
    avg_losing_trade,
    avg_winning_trade,
    annualized_return_rates,
    pnlDisplay,
    hasValidData,
    maximum_runup_value,
    pnl,
    theme.red100,
    theme.green100,
  ])

  // 移动端分左右两列
  const leftColumnItems = isMobile ? itemList.slice(0, Math.ceil(itemList.length / 2)) : []
  const rightColumnItems = isMobile ? itemList.slice(Math.ceil(itemList.length / 2)) : []

  return (
    <DataListWrapper className='data-list-wrapper'>
      {isMobile ? (
        <>
          <ColumnWrapper>
            {leftColumnItems.map((item) => {
              const { key, title, value, tooltip, valueStyle } = item
              return (
                <ItemWrapper className='item-wrapper' key={key}>
                  <span className='title'>
                    {title}
                    <Tooltip placement='top' content={tooltip}>
                      <IconBase className='icon-warn' />
                    </Tooltip>
                  </span>
                  <span style={valueStyle || {}} className='value'>
                    {value}
                  </span>
                </ItemWrapper>
              )
            })}
          </ColumnWrapper>
          <ColumnWrapper>
            {rightColumnItems.map((item) => {
              const { key, title, value, tooltip, valueStyle } = item
              return (
                <ItemWrapper className='item-wrapper' key={key}>
                  <span className='title'>
                    {title}
                    <Tooltip placement='top' content={tooltip}>
                      <IconBase className='icon-warn' />
                    </Tooltip>
                  </span>
                  <span style={valueStyle || {}} className='value'>
                    {value}
                  </span>
                </ItemWrapper>
              )
            })}
          </ColumnWrapper>
        </>
      ) : (
        itemList.map((item) => {
          const { key, title, value, tooltip, valueStyle } = item
          return (
            <ItemWrapper $isShowWorkflow={isShowWorkflow} className='item-wrapper' key={key}>
              <span className='title'>
                {title}
                <Tooltip placement='top' content={tooltip}>
                  <IconBase className='icon-warn' />
                </Tooltip>
              </span>
              <span style={valueStyle || {}} className='value'>
                {value}
              </span>
            </ItemWrapper>
          )
        })
      )}
    </DataListWrapper>
  )
})
