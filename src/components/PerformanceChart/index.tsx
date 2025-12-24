import { memo, useRef, useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { vm } from 'pages/helper'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import Pending from 'components/Pending'
import NoData from 'components/NoData'
import { PerformanceChartProps, ChartMode } from 'components/PerformanceChart/types'
import { useLeaderboardBalanceUpdates } from 'store/vaults/hooks'

// 注册 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend, Filler, TimeScale)

// 样式定义
const PerformanceChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

const ChartContainer = styled.div<{ $chartMode?: ChartMode }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: ${({ $chartMode }) => ($chartMode === 'vaultsdetail' ? '0' : '16px')};
  background: ${({ theme, $chartMode }) => ($chartMode === 'vaultsdetail' ? 'transparent' : theme.black800)};
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

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const ChartArea = styled.div<{ $chartMode?: ChartMode }>`
  width: 100%;
  height: ${({ $chartMode }) => ($chartMode === 'vaultsdetail' ? '232px' : '320px')};
  position: relative;

  ${({ theme, $chartMode }) =>
    theme.isMobile &&
    css`
      height: ${$chartMode === 'vaultsdetail' ? vm(232) : vm(320)};
    `}
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

/**
 * 通用的性能图表组件
 * 整合了MyVault、MyStrategy、VaultDetail的共同逻辑
 */
const PerformanceChart = memo<PerformanceChartProps>(
  ({
    chartData,
    chartOptions,
    emptyChartData,
    emptyChartOptions,
    chartState,
    title,
    leftControls,
    rightControls,
    statsComponent,
    chartMode,
    strategyId,
    className,
    chartHeight,
    chartHeightMobile,
  }) => {
    const theme = useTheme()

    // 图表引用
    const chartRef = useRef<ChartJS<'line', number[], number>>(null)
    const chartAreaRef = useRef<HTMLDivElement>(null)

    // 获取websocket实时数据（仅在strategyDetail模式下）
    const [leaderboardBalanceUpdates] = useLeaderboardBalanceUpdates()

    // websocket更新图表数据（vaultsdetail的特殊逻辑）
    useEffect(() => {
      if (chartMode !== 'vaultsdetail' || !strategyId) return

      const chart = chartRef.current
      if (!chart || !chartData.hasData) return

      const wsUpdate = leaderboardBalanceUpdates[strategyId]
      if (!wsUpdate) return

      let hasUpdates = false

      // 获取第一个数据集
      const dataset = chart.data.datasets[0]
      if (!dataset || !dataset.data.length || !chart.data.labels) return

      const lastDataPoint = dataset.data[dataset.data.length - 1]
      const lastLabelIndex = chart.data.labels.length - 1
      if (lastDataPoint === undefined || lastLabelIndex < 0) return

      // 获取第一个数据点的时间戳
      const firstPointTimestamp = Number(chart.data.labels[0])
      const currentTime = Date.now()
      const isWithin24Hours = currentTime - firstPointTimestamp < 24 * 60 * 60 * 1000

      // 获取最后一个数据点的时间戳
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
    }, [leaderboardBalanceUpdates, chartData.hasData, chartMode, strategyId])

    return (
      <PerformanceChartWrapper className={className}>
        {title && <Title>{title}</Title>}

        <ChartContainer $chartMode={chartMode}>
          {statsComponent && <ChartHeader>{statsComponent}</ChartHeader>}

          <ChartControlsRow>
            {leftControls}
            <RightControls>{rightControls}</RightControls>
          </ChartControlsRow>

          <ChartArea ref={chartAreaRef} $chartMode={chartMode}>
            {chartData.isLoading ? (
              <ChartPlaceholder>
                <Pending isNotButtonLoading />
              </ChartPlaceholder>
            ) : (
              <Line
                ref={chartRef}
                data={chartData.hasData ? chartOptions.chartJsData : emptyChartData || chartOptions.chartJsData}
                options={chartData.hasData ? chartOptions.options : emptyChartOptions || chartOptions.options}
                plugins={
                  chartData.hasData
                    ? [
                        ...(chartOptions.crossHairPlugin ? [chartOptions.crossHairPlugin] : []),
                        ...(chartOptions.initialEquityLinePlugin ? [chartOptions.initialEquityLinePlugin] : []),
                        ...(chartOptions.glowEffectPlugin ? [chartOptions.glowEffectPlugin] : []),
                        ...(chartOptions.plugins || []),
                      ]
                    : [...(emptyChartOptions?.plugins || [])]
                }
                onMouseLeave={() => {
                  if (chartRef.current && chartOptions.resetHoverState) {
                    chartOptions.resetHoverState(chartRef.current)
                  }
                }}
              />
            )}
          </ChartArea>
        </ChartContainer>
      </PerformanceChartWrapper>
    )
  },
)

PerformanceChart.displayName = 'PerformanceChart'

export default PerformanceChart
