import { useMemo, memo } from 'react'
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
import styled, { css } from 'styled-components'
import { useIsMobile } from 'store/application/hooks'
import { BacktestDataType } from 'store/agentdetail/agentdetail'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import {
  useVolumeChartState,
  usePriceData,
  useCheckboxHandlers,
  useMockData,
  useChartData,
  useChartOptions,
  useCrosshair,
} from './hooks'
import { createDynamicGradient } from './utils'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'

// 注册Chart.js组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const VolumeChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 320px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(176)};
    `}
`

const ChartContent = styled.div`
  width: 100%;
  height: 289px;
  position: relative;

  canvas {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transform: translateZ(0);
    will-change: transform;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(144)};
    `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  span {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 2px;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: ${({ theme }) => theme.textL2};
    i {
      font-size: 14px;
    }
    .icon-selected {
      color: ${({ theme }) => theme.brand100};
    }
    .icon-unselected {
      color: ${({ theme }) => theme.textDark80};
    }
  }
`

const AxisLabel = styled.div.attrs<{ x?: number; y?: number; $position: 'x' | 'y' | 'y1' }>((props) => ({
  style: {
    ...(props.$position === 'x' && {
      bottom: 0,
      left: `${props.x}px`,
      transform: 'translateX(-50%)',
    }),
    ...(props.$position === 'y' && {
      left: 0,
      top: `${props.y}px`,
      transform: 'translateY(-50%)',
    }),
    ...(props.$position === 'y1' && {
      right: 0,
      top: `${props.y}px`,
      transform: 'translateY(-50%)',
    }),
  },
}))<{ x?: number; y?: number; $position: 'x' | 'y' | 'y1' }>`
  position: absolute;
  background: ${({ theme }) => theme.sfC2};
  color: ${({ theme }) => theme.textL2};
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
`

export default memo(function VolumeChart({
  symbol = 'BTC',
  isBinanceSupport,
  backtestData,
}: {
  symbol: string
  isBinanceSupport: boolean
  backtestData: BacktestDataType
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const { funding_trends, initial_value, coingecko_id } = backtestData

  const {
    initialPriceData,
    priceData,
    setPriceData,
    isPending,
    setIsPending,
    isCheckedEquity,
    setIsCheckedEquity,
    isCheckedHold,
    setIsCheckedHold,
    chartRef,
    crosshairData,
    setCrosshairData,
  } = useVolumeChartState()

  const fundingTrends = useMemo(() => {
    if (!Array.isArray(funding_trends)) return []
    return funding_trends
  }, [funding_trends])

  const [endTime, fundingTrendsLen] = useMemo(() => {
    const len = fundingTrends.length
    return [fundingTrends[len - 1]?.timestamp || 0, len]
  }, [fundingTrends])

  const { formatPriceData } = usePriceData(
    symbol,
    isBinanceSupport,
    endTime,
    fundingTrendsLen,
    initialPriceData,
    setPriceData,
    priceData,
    coingecko_id,
    setIsPending,
  )

  const mockData = useMockData(fundingTrends, Number(initial_value), formatPriceData)

  const { changeCheckedEquity, changeCheckedHold } = useCheckboxHandlers(
    isCheckedEquity,
    setIsCheckedEquity,
    isCheckedHold,
    setIsCheckedHold,
  )

  useCrosshair(chartRef, mockData, isCheckedEquity, isCheckedHold, setCrosshairData)

  const chartData = useChartData(mockData, isCheckedEquity, isCheckedHold, createDynamicGradient)

  const options = useChartOptions(isMobile, isCheckedEquity, isCheckedHold, mockData, fundingTrends)

  return (
    <VolumeChartWrapper className='volume-chart-wrapper'>
      <ChartContent className='chart-content'>
        <Line ref={chartRef} data={chartData} options={options} />

        {crosshairData && (
          <>
            {/* X轴标签 */}
            <AxisLabel $position='x' x={crosshairData.x}>
              {/* {new Date(crosshairData.xLabel).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} */}
              {crosshairData.xLabel}
            </AxisLabel>

            {/* Y轴标签（左轴 - Equity） */}
            {isCheckedEquity && (
              <AxisLabel $position='y' y={crosshairData.equityY}>
                {crosshairData.equityValue.toFixed(0)}
              </AxisLabel>
            )}

            {/* Y1轴标签（右轴 - Hold） */}
            {isCheckedHold && (
              <AxisLabel $position='y1' y={crosshairData.holdY}>
                {crosshairData.holdValue.toFixed(0)}
              </AxisLabel>
            )}
          </>
        )}

        {isPending && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.black1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <Pending isFetching />
          </div>
        )}
      </ChartContent>
      <IconWrapper className='icon-wrapper'>
        <span onClick={changeCheckedEquity}>
          <IconBase className={isCheckedEquity ? 'icon-selected' : 'icon-unselected'} />
          <Trans>Equity</Trans>
        </span>
        <span onClick={changeCheckedHold}>
          <IconBase className={isCheckedHold ? 'icon-selected' : 'icon-unselected'} />
          <Trans>Buy & hold equity</Trans>
        </span>
      </IconWrapper>
    </VolumeChartWrapper>
  )
})
