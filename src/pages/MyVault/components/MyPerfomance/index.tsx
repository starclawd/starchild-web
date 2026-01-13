import styled from 'styled-components'
import { memo } from 'react'
import PerformanceChart from 'components/PerformanceChart'
import { usePerformanceChartState } from 'components/PerformanceChart/hooks/usePerformanceChartState'
import {
  useVaultDetailChartOptions,
  createEmptyVaultChartData,
  createEmptyVaultChartOptions,
} from 'pages/VaultDetail/components/PaperTradingPerformance/hooks/useVaultDetailChartOptions'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'
import { useTheme } from 'styled-components'
import useMyPerformanceChart from 'store/myvault/hooks/useMyPerformanceChart'
import useValidVaultWalletAddress from 'hooks/useValidVaultWalletAddress'
import ChartTypeTabs from './components/ChartTypeTabs'
import VaultsSelector from './components/VaultsSelector'
import TimeRangeSelector from 'pages/VaultDetail/components/PaperTradingPerformance/components/TimeRangeSelector'

const MyPerformanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

/**
 * MyVault 性能图表组件
 * 使用统一的PerformanceChart组件
 */
const MyPerformance = memo(() => {
  // 使用统一的图表状态管理
  const chartState = usePerformanceChartState('myvault')
  const { vaultId } = chartState.moduleState!
  const theme = useTheme()

  // 获取钱包地址验证
  const [isValidWallet, address] = useValidVaultWalletAddress()

  // 获取图表数据
  const chartData = useMyPerformanceChart({
    vaultId: vaultId || '',
    walletAddress: address && isValidWallet ? address : '',
    timeRange: chartState.timeRange,
    type: chartState.chartType,
    skip: !vaultId || !address || !isValidWallet,
  })

  // 获取图表配置
  const chartOptions = useVaultDetailChartOptions(chartData)

  // 生成空图表数据和配置
  const emptyChartData = createEmptyVaultChartData(chartState.timeRange)
  const emptyChartOptions = createEmptyVaultChartOptions(chartState.chartType, theme)
  const initialEquityLinePlugin = useInitialEquityLinePlugin({ theme })

  return (
    <MyPerformanceWrapper>
      <TimeRangeSelector chartTimeRange={chartState.timeRange} setChartTimeRange={chartState.setTimeRange} />
      <PerformanceChart
        chartData={chartData}
        chartOptions={chartOptions}
        emptyChartData={emptyChartData}
        emptyChartOptions={{ ...emptyChartOptions, plugins: [initialEquityLinePlugin] }}
        chartState={chartState}
        chartMode='myvault'
      />
    </MyPerformanceWrapper>
  )
})

MyPerformance.displayName = 'MyPerformance'

export default MyPerformance
