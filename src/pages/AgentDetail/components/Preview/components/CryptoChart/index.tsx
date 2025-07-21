import { memo, useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react'
import { IChartApi, ISeriesApi } from 'lightweight-charts'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { ChartDataItem, CryptoChartProps, KlineSubInnerDataType } from 'store/insights/insights'
import Pending from 'components/Pending'
import { useTimezone } from 'store/timezonecache/hooks'
import { useTheme } from 'store/themecache/hooks'
import ChartHeader from 'components/ChartHeader'
import PeridSelector from 'components/ChartHeader/components/PeridSelector'
import { PERIOD_OPTIONS } from 'store/insightscache/insightscache'
import { useCoinGeckoPolling } from './hooks/useCoinGeckoPolling'
import { useBinanceKlinePolling } from './hooks/useBinanceKlinePolling'
import { useTradeMarkers } from './hooks/useTradeMarkers'
import { useChartDataLoader } from './hooks/useChartDataLoader'
import { useChartConfiguration } from './hooks/useChartConfiguration'
import { convertToBinanceTimeZone } from 'utils/timezone'
import { createCustomTimeFormatter, createChartResizeHandler } from 'utils/chartUtils'

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: auto;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: 100%;
      gap: ${vm(8)};
      height: ${vm(297)};
    `}
`

const ChartContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  height: 218px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      gap: ${vm(12)};
      height: ${vm(243)};
    `}
`

const ChartContainer = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  .pending-wrapper {
    position: absolute;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    .icon-loading {
      font-size: 36px;
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: ${vm(203)};
      transition: height ${ANI_DURATION}s;
      .pending-wrapper {
        .icon-loading {
          font-size: 36px;
        }
      }
    `}
`

const CryptoChart = function CryptoChart({
  ref,
  symbol = 'BTC',
  isBinanceSupport,
  backtestData,
  showFullScreen = false,
}: CryptoChartProps) {
  const isMobile = useIsMobile()
  const { details: marksDetailData } = backtestData
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<PERIOD_OPTIONS>('1d')
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const [klinesubData, setKlinesubData] = useState<KlineSubInnerDataType | null>(null)
  const [historicalDataLoaded, setHistoricalDataLoaded] = useState<boolean>(false)
  const [reachedDataLimit, setReachedDataLimit] = useState<boolean>(false)
  const paramSymbol = `${symbol}USDT`
  const [timezone] = useTimezone() // 使用时区hook获取当前时区设置
  const theme = useTheme()
  // 获取币安API格式的时区
  const binanceTimeZone = useMemo(() => {
    return convertToBinanceTimeZone(timezone)
  }, [timezone])

  // 自定义时间格式化器，根据用户时区显示时间
  const customTimeFormatter = useMemo(() => {
    return createCustomTimeFormatter(timezone)
  }, [timezone])

  // 使用交易标记hook
  const {
    getMarksTimeRange,
    generateMockTradeMarkers,
    refreshTradeMarkers: refreshTradeMarkersHook,
  } = useTradeMarkers({
    marksDetailData,
    selectedPeriod,
  })

  // 包装refreshTradeMarkers方法以传递refs
  const refreshTradeMarkers = useCallback(
    (currentChartData: ChartDataItem[]) => {
      refreshTradeMarkersHook(currentChartData, seriesRef, chartRef)
    },
    [refreshTradeMarkersHook],
  )

  // 创建一个可以从外部调用的 handleResize 函数
  const handleResize = useMemo(() => {
    return createChartResizeHandler(chartContainerRef, chartRef)
  }, [])

  // 暴露 handleResize 方法给父组件
  useImperativeHandle(
    ref,
    () => ({
      handleResize,
    }),
    [handleResize],
  )

  // 使用数据加载器hook
  const { handlePeriodChange } = useChartDataLoader({
    paramSymbol,
    isBinanceSupport,
    binanceTimeZone,
    chartData,
    setChartData,
    setHistoricalDataLoaded,
    setReachedDataLimit,
    reachedDataLimit,
    selectedPeriod,
    seriesRef,
    chartRef,
    getMarksTimeRange,
    refreshTradeMarkers,
  })

  // 使用图表配置hook
  useChartConfiguration({
    chartContainerRef,
    chartRef,
    seriesRef,
    isMobile,
    paramSymbol,
    selectedPeriod,
    theme,
    handleResize,
    customTimeFormatter,
    timezone,
    klinesubData,
    historicalDataLoaded,
    chartData,
    isBinanceSupport,
  })

  // 当时区变化时重新加载数据
  useEffect(() => {
    if (selectedPeriod) {
      handlePeriodChange(selectedPeriod)
    }
  }, [timezone, selectedPeriod, handlePeriodChange])

  // 使用CoinGecko轮询hook
  useCoinGeckoPolling({
    isBinanceSupport,
    historicalDataLoaded,
    symbol,
    paramSymbol,
    selectedPeriod,
    setKlinesubData,
  })

  // 使用币安K线轮询hook
  useBinanceKlinePolling({
    isBinanceSupport,
    historicalDataLoaded,
    symbol,
    paramSymbol,
    selectedPeriod,
    setKlinesubData,
  })

  useEffect(() => {
    return () => {
      setChartData([])
      setKlinesubData(null)
      setHistoricalDataLoaded(false)
      setReachedDataLimit(false)
    }
  }, [setKlinesubData])

  return (
    <ChartWrapper className='chart-wrapper'>
      <ChartHeader
        disabledToggle
        symbol={symbol}
        backtestData={backtestData}
        klineSubData={klinesubData}
        showFullScreen={showFullScreen}
        isBinanceSupport={isBinanceSupport}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />
      <ChartContentWrapper className='chart-content-wrapper'>
        {isMobile && (
          <PeridSelector
            isBinanceSupport={isBinanceSupport}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            backtestData={backtestData}
          />
        )}
        <ChartContainer ref={chartContainerRef}>{chartData.length === 0 && <Pending />}</ChartContainer>
      </ChartContentWrapper>
    </ChartWrapper>
  )
}

export default memo(CryptoChart)
