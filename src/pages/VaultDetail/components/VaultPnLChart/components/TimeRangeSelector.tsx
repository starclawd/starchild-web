import { memo, useMemo } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { vm } from 'pages/helper'
import { useChartTimeRange } from 'store/vaultsdetail/hooks/useVaultDetailState'
import Select, { TriggerMethod, DataType } from 'components/Select'
import { t } from '@lingui/core/macro'

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 68px;

  .select-border-wrapper {
    height: 28px;
    border-radius: 4px;
  }

  .time-range-pop {
    span {
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      color: ${({ theme }) => theme.textL2};
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
    `}
`

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};
  margin-right: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(28)};
      font-size: ${vm(12)};
      line-height: ${vm(18)};
      margin-right: ${vm(8)};
    `}
`

const TimeRangeSelector = memo(() => {
  const theme = useTheme()
  const [chartTimeRange, setChartTimeRange] = useChartTimeRange()

  const timeRangeOptions: DataType[] = [
    {
      value: '24h',
      text: t`24H`,
      clickCallback: () => setChartTimeRange('24h'),
    },
    {
      value: '7d',
      text: t`7D`,
      clickCallback: () => setChartTimeRange('7d'),
    },
    {
      value: '30d',
      text: t`30D`,
      clickCallback: () => setChartTimeRange('30d'),
    },
    {
      value: 'all_time',
      text: t`All time`,
      clickCallback: () => setChartTimeRange('all_time'),
    },
  ]

  const getSelectedText = (value: string) => {
    const option = timeRangeOptions.find((option) => option.value === value)
    return option?.text || t`30D`
  }

  return (
    <SelectorContainer>
      <Select
        value={chartTimeRange}
        dataList={timeRangeOptions}
        triggerMethod={TriggerMethod.CLICK}
        placement='bottom-end'
        hideExpand={false}
        iconExpandStyle={{
          color: theme.textL3,
        }}
        alignPopWidth={true}
        popClass='time-range-pop'
        borderWrapperBg='transparent'
      >
        <SelectValue>{getSelectedText(chartTimeRange)}</SelectValue>
      </Select>
    </SelectorContainer>
  )
})

TimeRangeSelector.displayName = 'TimeRangeSelector'

export default TimeRangeSelector
