import { memo, useRef, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
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
import { Line } from 'react-chartjs-2'
import Pending from 'components/Pending'
import { usePnLChartData } from 'store/vaults/hooks/usePnLChartData'
import { useVaultPnlChartOptions } from 'pages/Vaults/components/Leaderboard/components/PnLChart/hooks/useVaultPnlChartOptions'
import {
  useLeaderboardWebSocketSubscription,
  useMockLeaderboardWebSocket,
  useLeaderboardBalanceUpdates,
} from 'store/vaults/hooks'
import { vm } from 'pages/helper'
import NoData from 'components/NoData'

// 注册Chart.js组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale)

const PnLChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
`

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
`

const ChartSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.textL3};
  margin: 4px 0 0 0;
  line-height: 1.4;
`

const ChartContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    flex-direction: column;
    gap: ${vm(16)};
  `}
`

const ChartWrapper = styled.div`
  flex: 1;
  height: 360px;
  background: ${({ theme }) => theme.black800};
  position: relative;

  ${({ theme }) =>
    theme.isMobile &&
    `
    height: ${vm(360)};
  `}
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${({ theme }) => theme.textL3};

  & > i {
    font-size: 48px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.textL3};
  }
`

const PnLChart = memo(() => {
  const { chartJsData, isLoading, hasData, chartData } = usePnLChartData()
  const chartRef = useRef<any>(null)

  // 对 chartData 进行 memoization
  const memoizedChartData = useMemo(() => chartData, [chartData])

  const { options, zeroLinePlugin, vaultPointDrawPlugin, crossHairPlugin, glowEffectPlugin, resetHoverState } =
    useVaultPnlChartOptions(memoizedChartData)

  // 订阅leaderboard websocket实时更新
  useLeaderboardWebSocketSubscription()

  // 获取websocket实时数据
  const [leaderboardBalanceUpdates] = useLeaderboardBalanceUpdates()

  // 提取策略ID用于mock数据 - 使用字符串比较避免数组引用变化导致的无限循环
  const strategyIdsString = useMemo(() => {
    return chartData.map((item) => item.strategyId).join(',')
  }, [chartData])

  const mockStrategyIds = useMemo(() => {
    return strategyIdsString.split(',').filter(Boolean)
  }, [strategyIdsString])

  // Mock WebSocket数据更新 (仅开发环境)
  const { isActive: isMockActive } = useMockLeaderboardWebSocket(
    process.env.NODE_ENV === 'development' ? mockStrategyIds : [],
  )

  // websocket更新图表数据
  useEffect(() => {
    const chart = chartRef.current
    if (!chart || !hasData) {
      return
    }

    let hasUpdates = false

    // 遍历每个数据集（strategy）
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const strategyData = chartData[datasetIndex]
      if (!strategyData) return

      const wsUpdate = leaderboardBalanceUpdates[strategyData.strategyId]
      if (!wsUpdate) return

      const lastDataPoint = dataset.data[dataset.data.length - 1]
      const lastLabelIndex = chart.data.labels.length - 1
      if (lastDataPoint === undefined || lastLabelIndex < 0) return

      // 获取最后一个数据点的时间戳（从labels数组中）
      const lastPointTimestamp = chart.data.labels[lastLabelIndex]

      // 将时间戳转换为小时级别进行比较
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
    })

    // 只有在有数据更新时才重绘图表
    if (hasUpdates) {
      chart.update('none') // 使用'none'动画模式实现即时更新
    }
  }, [leaderboardBalanceUpdates, chartData, hasData])

  if (isLoading) {
    return (
      <PnLChartContainer>
        <ChartHeader>
          <div>
            <ChartTitle>
              <Trans>Performance Trends</Trans>
            </ChartTitle>
            <ChartSubtitle>
              <Trans>All-time PnL comparison of top vaults</Trans>
            </ChartSubtitle>
          </div>
        </ChartHeader>
        <LoadingContainer>
          <Pending isFetching />
        </LoadingContainer>
      </PnLChartContainer>
    )
  }

  if (!hasData) {
    return (
      <PnLChartContainer>
        <EmptyState>
          <NoData />
          <div>
            <Trans>No chart data available</Trans>
          </div>
        </EmptyState>
      </PnLChartContainer>
    )
  }

  return (
    <PnLChartContainer>
      <ChartContent>
        <ChartWrapper
          onMouseLeave={() => {
            resetHoverState(chartRef.current)
          }}
        >
          <Line
            ref={chartRef}
            data={chartJsData}
            options={options}
            plugins={[zeroLinePlugin, vaultPointDrawPlugin, crossHairPlugin, glowEffectPlugin]}
          />
        </ChartWrapper>
      </ChartContent>
    </PnLChartContainer>
  )
})

PnLChart.displayName = 'PnLChart'

export default PnLChart
