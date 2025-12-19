import { memo, useRef, useMemo, useEffect, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { vm } from 'pages/helper'
import { useStrategyBalanceHistory } from 'store/vaultsdetail/hooks'
import { useVaultsChartData } from 'store/vaults/hooks/useVaultsChartData'
import { useChartType } from 'store/vaultsdetail/hooks'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail.d'
import { VaultPositionsOrdersProps } from '../VaultPositionsOrders'
import VaultChartStats from './components/VaultChartStats'
import StrategyChartStats from './components/StrategyChartStats'
import ChartTypeTabs from './components/ChartTypeTabs'
import TimeRangeSelector from './components/TimeRangeSelector'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import {
  useVaultDetailChartOptions,
  createEmptyVaultChartData,
  createEmptyVaultChartOptions,
} from './hooks/useVaultDetailChartOptions'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import { DataModeType } from 'store/vaultsdetail/vaultsdetail'
import { useIsShowSignals, usePaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import SignalsTitle from 'pages/CreateStrategy/components/StrategyInfo/components/PaperTrading/components/SignalsTitle'
import { useLeaderboardBalanceUpdates } from 'store/vaults/hooks'

// 注册 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale)

interface ChartContainerProps {
  $dataMode?: DataModeType
}

const ChartContainer = styled.div<ChartContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: ${({ $dataMode }) => ($dataMode === 'paper_trading' ? '0' : '16px')};
  background: ${({ theme, $dataMode }) => ($dataMode === 'paper_trading' ? 'transparent' : theme.black800)};
  border-radius: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
      gap: ${vm(12)};
    `}
`

const ChartControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
      gap: ${vm(12)};
    `}
`

const ChartArea = styled.div<{ $dataMode?: DataModeType }>`
  width: 100%;
  height: ${({ $dataMode }) => ($dataMode === 'paper_trading' ? '232px' : '320px')};
  position: relative;

  ${({ theme, $dataMode }) =>
    theme.isMobile &&
    css`
      height: ${$dataMode === 'paper_trading' ? vm(232) : vm(320)};
    `};
`

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL3};
  font-size: 16px;
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
    `}
`

const VaultPnLChart = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId, dataMode }) => {
  // 根据dataMode确定默认时间范围
  const defaultTimeRange: VaultChartTimeRange = dataMode === 'paper_trading' ? '24h' : '30d'
  const theme = useTheme()

  // 获取图表类型和时间范围状态
  const [chartType] = useChartType()
  const [chartTimeRange, setChartTimeRange] = useState<VaultChartTimeRange>(defaultTimeRange)
  const [isShowSignals] = useIsShowSignals()

  // 使用hooks中的空图表生成函数
  const emptyChartData = useMemo(() => createEmptyVaultChartData(chartTimeRange), [chartTimeRange])
  const emptyChartOptions = useMemo(() => createEmptyVaultChartOptions(chartType, theme), [chartType, theme])

  // 用于空图表的initialEquityLinePlugin
  const initialEquityLinePlugin = useInitialEquityLinePlugin({ theme })

  // 图表引用
  const chartRef = useRef<ChartJS<'line', number[], number>>(null)
  const chartAreaRef = useRef<HTMLDivElement>(null)

  // 获取paper trading数据（仅在需要时）
  const { paperTradingCurrentData } = usePaperTrading({
    strategyId: strategyId || '',
  })

  // 根据chartType转换为API支持的type参数
  const getApiType = (chartType: string) => {
    switch (chartType) {
      case 'TVL':
        return 'TVL'
      case 'PnL':
        return 'PNL'
      case 'EQUITY':
        return 'EQUITY'
      // case 'Index':
      //   // Index类型目前使用PNL数据，后续可能需要独立的API接口
      //   return 'PNL'
      default:
        return 'PNL'
    }
  }

  // 根据activeTab、chartType和timeRange获取图表数据
  const vaultChartData = useVaultsChartData({
    vaultId: vaultId || '',
    timeRange: chartTimeRange,
    type: getApiType(chartType),
    skip: activeTab !== 'vaults' || chartType === 'EQUITY' || !vaultId,
  })

  const strategyChartData = useStrategyBalanceHistory({
    strategyId: strategyId || '',
    timeRange: chartTimeRange,
    type: getApiType(chartType),
    dataMode,
    skip: activeTab !== 'strategy' || !strategyId,
  })

  // 根据activeTab选择对应的数据
  const chartData = activeTab === 'strategy' ? strategyChartData : vaultChartData

  // 获取图表配置和数据
  const { options, chartJsData, crossHairPlugin } = useVaultDetailChartOptions(chartData)

  // 获取websocket实时数据
  const [leaderboardBalanceUpdates] = useLeaderboardBalanceUpdates()

  // websocket更新图表数据
  useEffect(() => {
    const chart = chartRef.current
    if (!chart || !chartData.hasData || activeTab !== 'strategy' || !strategyId) {
      return
    }

    const wsUpdate = leaderboardBalanceUpdates[strategyId]
    if (!wsUpdate) return

    let hasUpdates = false

    // 获取第一个数据集（strategy图表通常只有一个数据集）
    const dataset = chart.data.datasets[0]
    if (!dataset || !dataset.data.length || !chart.data.labels) return

    const lastDataPoint = dataset.data[dataset.data.length - 1]
    const lastLabelIndex = chart.data.labels.length - 1
    if (lastDataPoint === undefined || lastLabelIndex < 0) return

    // 获取第一个数据点的时间戳
    const firstPointTimestamp = Number(chart.data.labels[0])
    const currentTime = Date.now()
    const isWithin24Hours = currentTime - firstPointTimestamp < 24 * 60 * 60 * 1000

    // 获取最后一个数据点的时间戳（从labels数组中）
    const lastPointTimestamp = Number(chart.data.labels[lastLabelIndex])
    if (isWithin24Hours) {
      // 数据集第一个点位时间距离当前时间小于24小时，直接使用原始时间戳比较
      if (wsUpdate.timestamp > lastPointTimestamp) {
        // 新的时间戳，添加新数据点和新标签
        chart.data.labels.push(wsUpdate.timestamp)
        dataset.data.push(wsUpdate.available_balance)
        hasUpdates = true
      } else if (wsUpdate.timestamp === lastPointTimestamp) {
        // 相同时间戳，更新最后一个数据点
        dataset.data[dataset.data.length - 1] = wsUpdate.available_balance
        hasUpdates = true
      }
    } else {
      // 数据集第一个点位时间距离当前时间超过24小时，转换为小时级别进行比较
      const wsHourTimestamp = Math.floor(wsUpdate.timestamp / (1000 * 60 * 60)) * (1000 * 60 * 60)
      const lastPointHourTimestamp = Math.floor(lastPointTimestamp / (1000 * 60 * 60)) * (1000 * 60 * 60)

      if (wsHourTimestamp > lastPointHourTimestamp) {
        // 新的小时，添加新数据点和新标签
        chart.data.labels.push(wsHourTimestamp)
        dataset.data.push(wsUpdate.available_balance)
        hasUpdates = true
      } else if (wsHourTimestamp === lastPointHourTimestamp) {
        // 同一小时内，更新最后一个数据点
        dataset.data[dataset.data.length - 1] = wsUpdate.available_balance
        hasUpdates = true
      }
    }

    // 只有在有数据更新时才重绘图表
    if (hasUpdates) {
      chart.update('none') // 使用'none'动画模式实现即时更新
    }
  }, [leaderboardBalanceUpdates, chartData.hasData, activeTab, strategyId])

  return (
    <ChartContainer $dataMode={dataMode}>
      <ChartHeader>
        {activeTab === 'vaults' ? (
          <VaultChartStats chartTimeRange={chartTimeRange} />
        ) : (
          <>
            <StrategyChartStats dataMode={dataMode} strategyId={strategyId || ''} chartTimeRange={chartTimeRange} />
            {!isShowSignals && <SignalsTitle />}
          </>
        )}
      </ChartHeader>

      <ChartControlsRow>
        <ChartTypeTabs activeTab={activeTab} />
        <TimeRangeSelector chartTimeRange={chartTimeRange} setChartTimeRange={setChartTimeRange} />
      </ChartControlsRow>

      <ChartArea ref={chartAreaRef} $dataMode={dataMode}>
        {chartData.isLoading ? (
          <ChartPlaceholder>
            <Pending isNotButtonLoading />
          </ChartPlaceholder>
        ) : (
          <>
            <Line
              ref={chartRef}
              data={chartData.hasData ? chartJsData : emptyChartData}
              options={chartData.hasData ? options : emptyChartOptions}
              plugins={chartData.hasData ? [crossHairPlugin] : [initialEquityLinePlugin]}
            />
          </>
        )}
      </ChartArea>
    </ChartContainer>
  )
})

VaultPnLChart.displayName = 'VaultPnLChart'

export default VaultPnLChart
