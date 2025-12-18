import { memo, useRef, useState, useMemo } from 'react'
import styled, { css } from 'styled-components'
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
import { useVaultDetailChartOptions } from './hooks/useVaultDetailChartOptions'
import { useVaultCrosshair, type VaultCrosshairData } from './hooks/useVaultCrosshair'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import { DataModeType } from 'store/vaultsdetail/vaultsdetail'
import { useIsShowSignals, usePaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import SignalsTitle from 'pages/CreateStrategy/components/StrategyInfo/components/PaperTrading/components/SignalsTitle'

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

  // 获取图表类型和时间范围状态
  const [chartType] = useChartType()
  const [chartTimeRange, setChartTimeRange] = useState<VaultChartTimeRange>(defaultTimeRange)
  const [isShowSignals] = useIsShowSignals()

  // 十字线相关状态
  const chartRef = useRef<ChartJS<'line', number[], string>>(null)
  const chartAreaRef = useRef<HTMLDivElement>(null)
  const [crosshairData, setCrosshairData] = useState<VaultCrosshairData | null>(null)

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
  const rawChartData = activeTab === 'strategy' ? strategyChartData : vaultChartData

  // 处理EQUITY类型在paper_trading模式下需要添加初始点位的情况
  const chartData = useMemo(() => {
    if (chartType === 'EQUITY' && dataMode === 'paper_trading' && paperTradingCurrentData?.deploy_time) {
      // deploy_time现在是时间戳（数字），直接使用
      const deployTimestamp = paperTradingCurrentData.deploy_time

      // 添加初始点位
      const initialPoint = {
        timestamp: deployTimestamp,
        value: 1000,
      }

      // 在现有数据前面添加初始点位
      const newData = [initialPoint, ...rawChartData.data]

      return {
        ...rawChartData,
        data: newData,
        hasData: true,
      }
    }

    return rawChartData
  }, [chartType, dataMode, paperTradingCurrentData?.deploy_time, rawChartData])

  // 获取图表配置和数据
  const { options, chartJsData, vaultCrosshairPlugin } = useVaultDetailChartOptions(chartData)

  // 启用十字线功能
  useVaultCrosshair(chartRef, chartData, setCrosshairData)

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
        ) : !chartData.hasData ? (
          <ChartPlaceholder>
            <NoData />
          </ChartPlaceholder>
        ) : (
          <>
            <Line ref={chartRef} data={chartJsData} options={options} plugins={[vaultCrosshairPlugin]} />
          </>
        )}
      </ChartArea>
    </ChartContainer>
  )
})

VaultPnLChart.displayName = 'VaultPnLChart'

export default VaultPnLChart
