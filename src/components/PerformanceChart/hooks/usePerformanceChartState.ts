import { useState } from 'react'
import { CHART_TYPE, CHAT_TIME_RANGE } from 'store/vaultsdetail/vaultsdetail'
import { PerformanceChartState, ChartMode } from 'components/PerformanceChart/types'

// 导入各模块的状态管理hooks
import { useChartType as useMyVaultChartType } from 'store/myvault/hooks/useChartType'
import { useChartVaultId } from 'store/myvault/hooks/useChartVaultId'
import { useChartStrategyId } from 'store/mystrategy/hooks/useChartStrategyId'
import { useChartType as useVaultDetailChartType } from 'store/vaultsdetail/hooks/useVaultDetailState'

/**
 * 统一的性能图表状态管理hook
 * 根据模块名称自动选择正确的Redux store进行状态管理
 */
export function usePerformanceChartState(
  module: ChartMode,
  initialTimeRange = CHAT_TIME_RANGE.MONTHLY,
): PerformanceChartState {
  // 时间范围：所有模块都使用本地state
  const [timeRange, setTimeRange] = useState<CHAT_TIME_RANGE>(initialTimeRange)

  // 图表类型：根据模块选择不同的store
  let chartType: CHART_TYPE
  let setChartType: (type: CHART_TYPE) => void

  switch (module) {
    case 'myvault': {
      const [type, setType] = useMyVaultChartType()
      chartType = type
      setChartType = setType
      break
    }
    case 'vaultsdetail': {
      const [type, setType] = useVaultDetailChartType()
      chartType = type
      setChartType = setType
      break
    }
    case 'mystrategy':
      // MyStrategy固定为EQUITY，不需要状态管理
      chartType = CHART_TYPE.EQUITY
      setChartType = () => {} // 空函数，因为不需要改变
      break
    default:
      throw new Error(`Unsupported module: ${module}`)
  }

  // 模块特定状态
  let moduleState: PerformanceChartState['moduleState']

  switch (module) {
    case 'myvault': {
      const [vaultId, setVaultId] = useChartVaultId()
      moduleState = { vaultId, setVaultId }
      break
    }
    case 'mystrategy': {
      const [strategyId, setStrategyId] = useChartStrategyId()
      moduleState = { strategyId, setStrategyId }
      break
    }
    case 'vaultsdetail':
      // VaultDetail不需要额外的module state
      moduleState = undefined
      break
  }

  return {
    chartType,
    setChartType,
    timeRange,
    setTimeRange,
    moduleState,
  }
}
