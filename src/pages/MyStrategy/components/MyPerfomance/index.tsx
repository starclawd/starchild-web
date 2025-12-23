import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { vm } from 'pages/helper'
import ChartTypeTabs from './components/ChartTypeTabs'
import TimeRangeSelector from 'pages/VaultDetail/components/VaultPnLChart/components/TimeRangeSelector'
import {
  useMyStrategyChartOptions,
  createEmptyStrategyChartData,
  createEmptyStrategyChartOptions,
} from 'pages/MyStrategy/components/MyPerfomance/hooks/useMyStrategyChartOptions'
import { useRef, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useChartStrategyId } from 'store/mystrategy/hooks/useChartStrategyId'
import styled, { css, useTheme } from 'styled-components'
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
// 注册 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend, Filler, TimeScale)
import useMyStrategyPerformanceChart from 'store/mystrategy/hooks/useMyStrategyPerformanceChart'
import StrategiesSelector from './components/StrategiesSelector'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'
import { useUserInfo } from 'store/login/hooks'

const MyPerfomanceWrapper = styled.div`
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

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.black800};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
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

const ChartArea = styled.div`
  width: 100%;
  height: 320px;
  position: relative;
  border-radius: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(320)};
    `};
`

export default function MyPerfomance() {
  const [chartStrategyId] = useChartStrategyId()
  const [chartTimeRange, setChartTimeRange] = useState<VaultChartTimeRange>('30d')
  const theme = useTheme()
  const [{ userInfoId }] = useUserInfo()

  // 用于空图表的数据和配置
  const emptyChartData = useMemo(() => createEmptyStrategyChartData(chartTimeRange), [chartTimeRange])
  const emptyChartOptions = useMemo(() => createEmptyStrategyChartOptions(theme), [theme])

  // 图表引用
  const chartRef = useRef<ChartJS<'line', { x: number; y: number }[], number>>(null)
  const chartAreaRef = useRef<HTMLDivElement>(null)

  // 获取图表数据
  const chartData = useMyStrategyPerformanceChart({
    timeRange: chartTimeRange,
    skip: !userInfoId, // 需要等用户登录后才调用接口
  })

  // 获取图表配置和数据
  const { options, chartJsData, initialEquityLinePlugin, crossHairPlugin, glowEffectPlugin, resetHoverState } =
    useMyStrategyChartOptions(chartData, chartStrategyId)

  return (
    <MyPerfomanceWrapper>
      <Title>
        <Trans>My Performance</Trans>
      </Title>

      <ChartContainer>
        <ChartControlsRow>
          <ChartTypeTabs />

          <RightControls>
            <StrategiesSelector />
            <TimeRangeSelector chartTimeRange={chartTimeRange} setChartTimeRange={setChartTimeRange} />
          </RightControls>
        </ChartControlsRow>

        <ChartArea ref={chartAreaRef}>
          {chartData.isLoading ? (
            <Pending isNotButtonLoading />
          ) : chartData.hasData ? (
            <Line
              ref={chartRef}
              data={chartJsData}
              options={options}
              plugins={[initialEquityLinePlugin, crossHairPlugin, glowEffectPlugin]}
              onMouseLeave={() => {
                if (chartRef.current) {
                  resetHoverState(chartRef.current)
                }
              }}
            />
          ) : (
            <Line data={emptyChartData} options={emptyChartOptions} plugins={[initialEquityLinePlugin]} />
          )}
        </ChartArea>
      </ChartContainer>
    </MyPerfomanceWrapper>
  )
}
