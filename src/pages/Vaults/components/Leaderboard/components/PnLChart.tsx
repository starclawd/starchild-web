import { memo, useRef } from 'react'
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
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Pending from 'components/Pending'
import { usePnLChartData } from 'store/vaults/hooks/usePnLChartData'
import { useVaultPnlChartOptions } from 'store/vaults/hooks/useVaultPnlChartOptions'
import { vm } from 'pages/helper'
import NoData from 'components/NoData'

// 注册Chart.js组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

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
  const { options, zeroLinePlugin } = useVaultPnlChartOptions(chartData)

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
        <ChartWrapper>
          <Line ref={chartRef} data={chartJsData} options={options} plugins={[zeroLinePlugin]} />
        </ChartWrapper>
      </ChartContent>
    </PnLChartContainer>
  )
})

PnLChart.displayName = 'PnLChart'

export default PnLChart
