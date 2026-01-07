import { memo } from 'react'
import PerformanceChart from 'components/PerformanceChart'
import { usePerformanceChartState } from 'components/PerformanceChart/hooks/usePerformanceChartState'
import {
  useMyStrategyChartOptions,
  createEmptyStrategyChartData,
  createEmptyStrategyChartOptions,
} from 'pages/MyStrategy/components/MyPerfomance/hooks/useMyStrategyChartOptions'
import useMyStrategyPerformanceChart from 'store/mystrategy/hooks/useMyStrategyPerformanceChart'
import { useUserInfo } from 'store/login/hooks'
import styled, { useTheme } from 'styled-components'
import TimeRangeSelector from 'pages/VaultDetail/components/PaperTradingPerformance/components/TimeRangeSelector'

const MyPerformanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

/**
 * MyStrategy 性能图表组件
 * 使用统一的PerformanceChart组件
 */
const MyPerformance = memo(() => {
  // 使用统一的图表状态管理
  const chartState = usePerformanceChartState('mystrategy')
  const { strategyId } = chartState.moduleState!
  const theme = useTheme()

  // 获取用户信息
  const [{ userInfoId }] = useUserInfo()

  // 获取图表数据
  const chartData = useMyStrategyPerformanceChart({
    timeRange: chartState.timeRange,
    skip: !userInfoId, // 需要等用户登录后才调用接口
  })

  // 获取图表配置（MyStrategy使用特殊的hook，需要strategyId）
  const chartOptions = useMyStrategyChartOptions(chartData, strategyId || null)

  // 生成空图表数据和配置
  const emptyChartData = createEmptyStrategyChartData(chartState.timeRange)
  const emptyChartOptions = createEmptyStrategyChartOptions(theme)

  return (
    <MyPerformanceWrapper>
      <TimeRangeSelector chartTimeRange={chartState.timeRange} setChartTimeRange={chartState.setTimeRange} />
      <PerformanceChart
        chartData={chartData}
        chartOptions={chartOptions}
        emptyChartData={emptyChartData}
        emptyChartOptions={emptyChartOptions}
        chartState={chartState}
        chartMode='mystrategy'
      />
    </MyPerformanceWrapper>
  )
})

MyPerformance.displayName = 'MyPerformance'

export default MyPerformance
