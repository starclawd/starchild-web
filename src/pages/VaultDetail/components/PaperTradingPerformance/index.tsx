import { memo, useEffect } from 'react'
import { useStrategyBalanceHistory } from 'store/vaultsdetail/hooks'
import { useVaultsChartData } from 'store/vaults/hooks/useVaultsChartData'
import { usePerformanceChartState } from 'components/PerformanceChart/hooks/usePerformanceChartState'
import { CHART_TYPE, CHAT_TIME_RANGE, DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail.d'
import { VaultPositionsOrdersProps } from '../VaultPositionsOrders'
import VaultChartStats from './components/VaultChartStats'
import StrategyChartStats from './components/StrategyChartStats'
import TimeRangeSelector from './components/TimeRangeSelector'
import {
  useVaultDetailChartOptions,
  createEmptyVaultChartData,
  createEmptyVaultChartOptions,
} from './hooks/useVaultDetailChartOptions'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'
import { usePixelLinePlugin } from './utils/PixelLinePlugin'
import styled, { useTheme } from 'styled-components'
import PerformanceChart from 'components/PerformanceChart'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { t } from '@lingui/core/macro'
import AiSummary from '../AiSummary'
import StrategyRadarChart from '../StrategyRadarChart'

const PaperTradingPerformanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const AiAnalysis = styled.div`
  display: flex;
  height: 200px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
`

interface VaultPnLChartProps extends VaultPositionsOrdersProps {
  strategyAnalysisComponent?: React.ReactNode
}

/**
 * VaultDetail 性能图表组件
 * 使用统一的PerformanceChart组件，但保留VaultDetail特有的逻辑
 */
const PaperTradingPerformance = memo<VaultPnLChartProps>(({ activeTab, vaultId, strategyId }) => {
  // 设置默认时间范围
  const defaultTimeRange = CHAT_TIME_RANGE.ALL_TIME
  const theme = useTheme()

  // 使用统一的图表状态管理
  const chartState = usePerformanceChartState('vaultsdetail', defaultTimeRange)

  // 监听数据重新获取信号
  const shouldRefreshData = useSelector((state: RootState) => state.createstrategy.shouldRefreshData)

  // 根据activeTab获取对应的图表数据
  const vaultChartData = useVaultsChartData({
    vaultId: vaultId || '',
    timeRange: chartState.timeRange,
    type: chartState.chartType,
    skip: activeTab !== DETAIL_TYPE.VAULT || chartState.chartType === CHART_TYPE.EQUITY || !vaultId,
  })

  const strategyChartData = useStrategyBalanceHistory({
    strategyId: strategyId || '',
    timeRange: chartState.timeRange,
    type: chartState.chartType,
    skip: activeTab !== DETAIL_TYPE.STRATEGY || !strategyId,
  })

  // 监听 shouldRefreshData 状态，触发图表数据重新获取
  useEffect(() => {
    if (shouldRefreshData && activeTab === DETAIL_TYPE.STRATEGY && strategyChartData.refetch) {
      const refreshChartData = async () => {
        try {
          await strategyChartData.refetch!()
        } catch (error) {
          console.error('重新获取图表数据失败:', error)
        }
      }

      refreshChartData()
    }
  }, [shouldRefreshData, activeTab, strategyChartData])

  // 根据activeTab选择对应的数据
  const chartData = activeTab === DETAIL_TYPE.STRATEGY ? strategyChartData : vaultChartData

  // 生成插件
  const initialEquityLinePlugin = useInitialEquityLinePlugin({ theme })
  const pixelLinePlugin = usePixelLinePlugin({
    theme,
    showGrid: false, // 是否显示4x4网格，方便调试和查看像素对齐
  })

  // 获取图表配置
  const chartOptions = useVaultDetailChartOptions(chartData, pixelLinePlugin)

  // 生成空图表数据和配置
  const emptyChartData = createEmptyVaultChartData(chartState.timeRange)
  const emptyChartOptions = createEmptyVaultChartOptions(chartState.chartType, theme)

  return (
    <PaperTradingPerformanceWrapper>
      {activeTab === DETAIL_TYPE.VAULT ? (
        <VaultChartStats chartTimeRange={chartState.timeRange} />
      ) : (
        <StrategyChartStats strategyId={strategyId || ''} chartTimeRange={chartState.timeRange} />
      )}
      <AiAnalysis>
        <AiSummary />
        <StrategyRadarChart />
      </AiAnalysis>
      <ChatWrapper>
        <TimeRangeSelector chartTimeRange={chartState.timeRange} setChartTimeRange={chartState.setTimeRange} />
        <PerformanceChart
          chartData={chartData}
          chartOptions={chartOptions}
          emptyChartData={emptyChartData}
          emptyChartOptions={{ ...emptyChartOptions, plugins: [initialEquityLinePlugin] }}
          chartState={chartState}
          chartMode='vaultsdetail'
          strategyId={strategyId}
        />
      </ChatWrapper>
    </PaperTradingPerformanceWrapper>
  )
})

PaperTradingPerformance.displayName = 'PaperTradingPerformance'

export default PaperTradingPerformance
