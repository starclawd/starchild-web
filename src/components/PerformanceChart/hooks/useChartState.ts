import { useState } from 'react'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'
import { ChartState } from 'components/PerformanceChart/types'

// 通用的图表状态管理hook
// chartType由各自的模块管理，这里只管理timeRange
export function useChartState(
  initialTimeRange: VaultChartTimeRange = '30d',
): Pick<ChartState, 'timeRange' | 'setTimeRange'> {
  const [timeRange, setTimeRange] = useState<VaultChartTimeRange>(initialTimeRange)

  return {
    timeRange,
    setTimeRange,
  }
}
