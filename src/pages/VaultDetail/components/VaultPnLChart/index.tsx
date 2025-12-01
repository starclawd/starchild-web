import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useVaultDetailChartOptions } from 'store/vaultsdetail/hooks'
import { useVaultsPnLChartData } from 'store/vaults/hooks/useVaultsPnLChartData'
import { useCurrentVaultId } from 'store/vaultsdetail/hooks'
import { VaultChartStats } from './components'
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

// 注册 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale)

interface VaultPnLChartProps {
  activeTab: 'strategy' | 'vaults'
}

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

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
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

const VaultPnLChart = memo(({ activeTab }: VaultPnLChartProps) => {
  // 获取当前vaultId
  const [currentVaultId] = useCurrentVaultId()

  // 根据activeTab获取图表数据
  const chartData =
    activeTab === 'strategy'
      ? useVaultsPnLChartData({
          vaultId: currentVaultId || '',
          timeRange: '30d',
          skip: !currentVaultId,
        }) // FIXME: 策略数据区域
      : useVaultsPnLChartData({
          vaultId: currentVaultId || '',
          timeRange: '30d',
          skip: !currentVaultId,
        })

  // 获取图表配置和数据
  const { options, chartJsData, zeroLinePlugin } = useVaultDetailChartOptions(chartData)

  return (
    <ChartContainer>
      <ChartHeader>
        <VaultChartStats />
      </ChartHeader>

      <ChartArea>
        {chartData.isLoading ? (
          <ChartPlaceholder>
            <Trans>Loading...</Trans>
          </ChartPlaceholder>
        ) : !chartData.hasData ? (
          <ChartPlaceholder>
            <Trans>No data available</Trans>
          </ChartPlaceholder>
        ) : (
          <Line data={chartJsData} options={options} plugins={[zeroLinePlugin]} />
        )}
      </ChartArea>
    </ChartContainer>
  )
})

VaultPnLChart.displayName = 'VaultPnLChart'

export default VaultPnLChart
