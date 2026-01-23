import { useState } from 'react'
import { CHAT_TIME_RANGE } from 'store/vaultsdetail/vaultsdetail'
import { ChartState } from '../types'

// 通用的图表状态管理hook
// chartType由各自的模块管理，这里只管理timeRange
export function useChartState(
  initialTimeRange = CHAT_TIME_RANGE.MONTHLY,
): Pick<ChartState, 'timeRange' | 'setTimeRange'> {
  const [timeRange, setTimeRange] = useState<CHAT_TIME_RANGE>(initialTimeRange)

  return {
    timeRange,
    setTimeRange,
  }
}
