import { memo } from 'react'
import styled from 'styled-components'
import TabList from 'components/TabList'
import { msg, t } from '@lingui/core/macro'
import { CHAT_TIME_RANGE } from 'store/vaultsdetail/vaultsdetail.d'
import { useLingui } from '@lingui/react/macro'

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;

  .tab-list-wrapper {
    height: 24px;
  }
`

interface TimeRangeSelectorProps {
  chartTimeRange: CHAT_TIME_RANGE
  setChartTimeRange: (timeRange: CHAT_TIME_RANGE) => void
}

const TimeRangeSelector = memo<TimeRangeSelectorProps>(({ chartTimeRange, setChartTimeRange }) => {
  const { t } = useLingui()
  const timeRangeOptions = [
    {
      key: CHAT_TIME_RANGE.DAILY,
      text: t(msg`24H`),
      clickCallback: () => setChartTimeRange(CHAT_TIME_RANGE.DAILY),
    },
    {
      key: CHAT_TIME_RANGE.WEEKLY,
      text: t(msg`7D`),
      clickCallback: () => setChartTimeRange(CHAT_TIME_RANGE.WEEKLY),
    },
    {
      key: CHAT_TIME_RANGE.MONTHLY,
      text: t(msg`1M`),
      clickCallback: () => setChartTimeRange(CHAT_TIME_RANGE.MONTHLY),
    },
    {
      key: CHAT_TIME_RANGE.ALL_TIME,
      text: t(msg`All time`),
      clickCallback: () => setChartTimeRange(CHAT_TIME_RANGE.ALL_TIME),
    },
  ]

  return (
    <SelectorContainer>
      <TabList tabKey={chartTimeRange} tabList={timeRangeOptions} />
    </SelectorContainer>
  )
})

TimeRangeSelector.displayName = 'TimeRangeSelector'

export default TimeRangeSelector
