import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { vm } from 'pages/helper'
import ChartTypeTabs from './components/ChartTypeTabs'
import TimeRangeSelector from 'pages/VaultDetail/components/VaultPnLChart/components/TimeRangeSelector'
import {
  useVaultDetailChartOptions,
  createEmptyVaultChartData,
  createEmptyVaultChartOptions,
} from 'pages/VaultDetail/components/VaultPnLChart/hooks/useVaultDetailChartOptions'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'
import { useRef, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useChartType } from 'store/myvault/hooks/useChartType'
import { useChartVaultId } from 'store/myvault/hooks/useChartVaultId'
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
import useMyPerformanceChart from 'store/myvault/hooks/useMyPerformanceChart'
import VaultsSelector from './components/VaultsSelector'
import useValidVaultWalletAddress from 'hooks/useValidVaultWalletAddress'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'

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
  const [chartTimeRange, setChartTimeRange] = useState<VaultChartTimeRange>('30d')
  const [isValidWallet, address] = useValidVaultWalletAddress()
  const theme = useTheme()

  // 使用hooks中的空图表生成函数
  const emptyChartData = useMemo(() => createEmptyVaultChartData(chartTimeRange), [chartTimeRange])
  const emptyChartOptions = useMemo(() => createEmptyVaultChartOptions(chartType, theme), [chartType, theme])

  // 用于空图表的initialEquityLinePlugin
  const initialEquityLinePlugin = useInitialEquityLinePlugin({ theme })

  // 图表引用
  const chartRef = useRef<ChartJS<'line', number[], number>>(null)
  const chartAreaRef = useRef<HTMLDivElement>(null)

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
    walletAddress: address && isValidWallet ? address : '',
    timeRange: chartTimeRange,
    type: getApiType(chartType),
    skip: !chartVaultId || !address || !isValidWallet,
  })

  // 获取图表配置和数据
  const { options, chartJsData, crossHairPlugin } = useVaultDetailChartOptions(chartData)

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
            <TimeRangeSelector chartTimeRange={chartTimeRange} setChartTimeRange={setChartTimeRange} />
          </RightControls>
        </ChartControlsRow>

        <ChartArea ref={chartAreaRef}>
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
    </MyPerfomanceWrapper>
  )
}
