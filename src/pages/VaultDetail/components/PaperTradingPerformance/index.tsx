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
import { usePixelLinePlugin } from './utils/PixelLinePlugin'
import styled, { css, useTheme } from 'styled-components'
import PerformanceChart from 'components/PerformanceChart'
import { useIsShowSignals } from 'store/createstrategy/hooks/usePaperTrading'
import SignalsTitle from 'pages/CreateStrategy/components/StrategyInfo/components/PaperTrading/components/SignalsTitle'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { t } from '@lingui/core/macro'
import { vm } from 'pages/helper'
import AiSummary from '../AiSummary'
import StrategyRadarChart from '../StrategyRadarChart'

const StrategyChartStatsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const TabsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      gap: ${vm(16)};
      align-items: flex-start;
      padding: 0 0 ${vm(16)} 0;
    `}
`

const StrategySection = styled.div`
  display: flex;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      gap: ${vm(16)};
    `}
`

const AiSummaryWrapper = styled.div`
  flex: 4;
  border-right: 1px solid ${({ theme }) => theme.black800};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-right: none;
      border-bottom: 1px solid ${({ theme }) => theme.black800};
    `}
`

const RadarChartWrapper = styled.div`
  flex: 3;
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
  const defaultTimeRange: VaultChartTimeRange = 'all_time'
  const theme = useTheme()

  // Demo 雷达图数据 - 后续可以从 API 获取
  const radarData = [
    { label: t`Profit`, value: 85 },
    { label: t`Stability`, value: 72 },
    { label: t`Hot`, value: 58 },
    { label: t`Risk-Reward`, value: 76 },
    { label: t`Safety`, value: 91 },
  ]

  // 构建策略分析组件
  const strategyAnalysisComponent = (
    <StrategySection>
      <AiSummaryWrapper>
        <AiSummary summary='This strategy operates with high selectivity. Despite low frequency—just 5 trades in the last month—it maintains high accuracy...' />
      </AiSummaryWrapper>
      <RadarChartWrapper>
        <StrategyRadarChart riskAppetite='Aggressive Scalping' radarData={radarData} />
      </RadarChartWrapper>
    </StrategySection>
  )

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
    skip: activeTab !== 'strategy' || !strategyId,
  })

  // 监听 shouldRefreshData 状态，触发图表数据重新获取
  useEffect(() => {
    if (shouldRefreshData && activeTab === 'strategy' && strategyChartData.refetch) {
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
  const chartData = activeTab === 'strategy' ? strategyChartData : vaultChartData

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

  // 构建stats组件
  const statsComponent =
    activeTab === 'vaults' ? (
      <VaultChartStats chartTimeRange={chartState.timeRange} />
    ) : (
      <StrategyChartStatsWrapper>
        <StrategyChartStats strategyId={strategyId || ''} chartTimeRange={chartState.timeRange} />
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
      strategyAnalysisComponent={strategyAnalysisComponent}
      leftControls={<ChartTypeTabs activeTab={activeTab} />}
      rightControls={
        <TimeRangeSelector chartTimeRange={chartState.timeRange} setChartTimeRange={chartState.setTimeRange} />
      }
      chartMode='vaultsdetail'
      strategyId={strategyId}
    />
  )
})

PaperTradingPerformance.displayName = 'PaperTradingPerformance'

export default PaperTradingPerformance
