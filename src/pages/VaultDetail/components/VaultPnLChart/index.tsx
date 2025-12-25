import { memo, useEffect } from 'react'
import { useStrategyBalanceHistory } from 'store/vaultsdetail/hooks'
import { useVaultsChartData } from 'store/vaults/hooks/useVaultsChartData'
import { usePerformanceChartState } from 'components/PerformanceChart/hooks/usePerformanceChartState'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail.d'
import { VaultPositionsOrdersProps } from '../VaultPositionsOrders'
import VaultChartStats from './components/VaultChartStats'
import StrategyChartStats from './components/StrategyChartStats'
import ChartTypeTabs from './components/ChartTypeTabs'
import TimeRangeSelector from './components/TimeRangeSelector'
import {
  useVaultDetailChartOptions,
  createEmptyVaultChartData,
  createEmptyVaultChartOptions,
} from './hooks/useVaultDetailChartOptions'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'
import styled, { useTheme } from 'styled-components'
import PerformanceChart from 'components/PerformanceChart'
import { useIsShowSignals } from 'store/createstrategy/hooks/usePaperTrading'
import SignalsTitle from 'pages/CreateStrategy/components/StrategyInfo/components/PaperTrading/components/SignalsTitle'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

const StrategyChartStatsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

/**
 * VaultDetail 性能图表组件
 * 使用统一的PerformanceChart组件，但保留VaultDetail特有的逻辑
 */
const VaultPnLChart = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId, dataMode }) => {
  // 根据dataMode确定默认时间范围
  const defaultTimeRange: VaultChartTimeRange = dataMode === 'paper_trading' ? '24h' : '30d'
  const theme = useTheme()

  // 使用统一的图表状态管理
  const chartState = usePerformanceChartState('vaultsdetail', defaultTimeRange)
  const [isShowSignals] = useIsShowSignals()

  // 监听数据重新获取信号
  const shouldRefreshData = useSelector((state: RootState) => state.createstrategy.shouldRefreshData)

  // 根据chartType转换为API支持的type参数
  const getApiType = (chartType: string) => {
    switch (chartType) {
      case 'TVL':
        return 'TVL'
      case 'PnL':
        return 'PNL'
      case 'EQUITY':
        return 'EQUITY'
      default:
        return 'PNL'
    }
  }

  // 根据activeTab获取对应的图表数据
  const vaultChartData = useVaultsChartData({
    vaultId: vaultId || '',
    timeRange: chartState.timeRange,
    type: getApiType(chartState.chartType),
    skip: activeTab !== 'vaults' || chartState.chartType === 'EQUITY' || !vaultId,
  })

  const strategyChartData = useStrategyBalanceHistory({
    strategyId: strategyId || '',
    timeRange: chartState.timeRange,
    type: getApiType(chartState.chartType),
    dataMode,
    skip: activeTab !== 'strategy' || !strategyId,
  })

  // 监听 shouldRefreshData 状态，触发图表数据重新获取
  useEffect(() => {
    if (shouldRefreshData && dataMode === 'paper_trading' && activeTab === 'strategy' && strategyChartData.refetch) {
      const refreshChartData = async () => {
        try {
          await strategyChartData.refetch!()
        } catch (error) {
          console.error('重新获取图表数据失败:', error)
        }
      }

      refreshChartData()
    }
  }, [shouldRefreshData, dataMode, activeTab, strategyChartData])

  // 根据activeTab选择对应的数据
  const chartData = activeTab === 'strategy' ? strategyChartData : vaultChartData

  // 获取图表配置
  const chartOptions = useVaultDetailChartOptions(chartData)

  // 生成空图表数据和配置
  const emptyChartData = createEmptyVaultChartData(chartState.timeRange)
  const emptyChartOptions = createEmptyVaultChartOptions(chartState.chartType, theme)
  const initialEquityLinePlugin = useInitialEquityLinePlugin({ theme })

  // 构建stats组件
  const statsComponent =
    activeTab === 'vaults' ? (
      <VaultChartStats chartTimeRange={chartState.timeRange} />
    ) : (
      <StrategyChartStatsWrapper>
        <StrategyChartStats dataMode={dataMode} strategyId={strategyId || ''} chartTimeRange={chartState.timeRange} />
        {!isShowSignals && <SignalsTitle />}
      </StrategyChartStatsWrapper>
    )

  return (
    <PerformanceChart
      chartData={chartData}
      chartOptions={chartOptions}
      emptyChartData={emptyChartData}
      emptyChartOptions={{ ...emptyChartOptions, plugins: [initialEquityLinePlugin] }}
      chartState={chartState}
      statsComponent={statsComponent}
      leftControls={<ChartTypeTabs activeTab={activeTab} />}
      rightControls={
        <TimeRangeSelector chartTimeRange={chartState.timeRange} setChartTimeRange={chartState.setTimeRange} />
      }
      chartMode='vaultsdetail'
      strategyId={strategyId}
    />
  )
})

VaultPnLChart.displayName = 'VaultPnLChart'

export default VaultPnLChart
