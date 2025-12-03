import { Trans } from '@lingui/react/macro'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import { vm } from 'pages/helper'
import ChartTypeTabs from './components/ChartTypeTabs'
import TimeRangeSelector from './components/TimeRangeSelector'
import {
  useVaultCrosshair,
  VaultCrosshairData,
} from 'pages/VaultDetail/components/VaultPnLChart/hooks/useVaultCrosshair'
import { useVaultDetailChartOptions } from 'pages/VaultDetail/components/VaultPnLChart/hooks/useVaultDetailChartOptions'
import { useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useChartTimeRange } from 'store/portfolio/hooks/useChartTimeRange'
import { useChartType } from 'store/portfolio/hooks/useChartType'
import { useChartVaultId } from 'store/portfolio/hooks/useChartVaultId'
import styled, { css } from 'styled-components'
import { Chart as ChartJS } from 'chart.js'
import useMyPerformanceChart from 'store/portfolio/hooks/useMyPerformanceChart'
import { useAppKitAccount } from '@reown/appkit/react'
import VaultsSelector from './components/VaultsSelector'

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
  border-radius: 4px;

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
  padding: 20px;
  border-radius: 4px;
  background: ${({ theme }) => theme.black800};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(320)};
    `};
`

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.black800};
  border: 2px dashed ${({ theme }) => theme.lineDark6};
  border-radius: 8px;
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

export default function MyPerfomance() {
  const [chartVaultId] = useChartVaultId()
  const [chartType] = useChartType()
  const [chartTimeRange] = useChartTimeRange()
  const { address } = useAppKitAccount()

  // 十字线相关状态
  const chartRef = useRef<ChartJS<'line', number[], string>>(null)
  const chartAreaRef = useRef<HTMLDivElement>(null)
  const [crosshairData, setCrosshairData] = useState<VaultCrosshairData | null>(null)

  // 根据chartType转换为API支持的type参数
  const getApiType = (chartType: string) => {
    switch (chartType) {
      case 'TVL':
        return 'TVL'
      case 'PnL':
        return 'PNL'
      default:
        return 'PNL'
    }
  }

  // 获取图表数据
  const chartData = useMyPerformanceChart({
    vaultId: chartVaultId || '',
    walletAddress: address || '',
    timeRange: chartTimeRange,
    type: getApiType(chartType),
    skip: !chartVaultId || !address,
  })

  // 获取图表配置和数据
  const { options, chartJsData } = useVaultDetailChartOptions(chartData)

  // 启用十字线功能
  useVaultCrosshair(chartRef, chartData, setCrosshairData)

  return (
    <MyPerfomanceWrapper>
      <Title>
        <Trans>My performance</Trans>
      </Title>
      <ChartContainer>
        <ChartControlsRow>
          <ChartTypeTabs />
          <RightControls>
            <VaultsSelector />
            <TimeRangeSelector />
          </RightControls>
        </ChartControlsRow>

        <ChartArea ref={chartAreaRef}>
          {chartData.isLoading ? (
            <ChartPlaceholder>
              <Pending />
            </ChartPlaceholder>
          ) : !chartData.hasData ? (
            <ChartPlaceholder>
              <NoData />
            </ChartPlaceholder>
          ) : (
            <>
              <Line ref={chartRef} data={chartJsData} options={options} />
            </>
          )}
        </ChartArea>
      </ChartContainer>
    </MyPerfomanceWrapper>
  )
}
