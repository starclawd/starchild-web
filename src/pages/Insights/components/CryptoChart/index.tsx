import { memo, useCallback, useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { UTCTimestamp, IChartApi, ISeriesApi } from 'lightweight-charts'
import styled, { css } from 'styled-components'
import Markers from './components/Marker'
import { useKlineSubscription } from 'store/insights/hooks'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import PeridSelector from 'components/ChartHeader/components/PeridSelector'
import { useIssShowCharts, useSelectedPeriod } from 'store/insightscache/hooks'
import { CryptoChartProps, ChartDataItem } from 'store/insights/insights'
import Pending from 'components/Pending'
import { useTimezone } from 'store/timezonecache/hooks'
import ChartHeader from 'components/ChartHeader'
import { convertToBinanceTimeZone } from 'utils/timezone'
import { useChartInitialization } from './hooks/useChartInitialization'
import { useChartDataLoader } from './hooks/useChartDataLoader'
import { useCoinGeckoPolling } from './hooks/useCoinGeckoPolling'
import { useMarkerScroll } from './hooks/useMarkerScroll'
import { usePeriodChange } from './hooks/usePeriodChange'
import { useRealtimeData } from './hooks/useRealtimeData'
import { createCustomTimeFormatter } from './utils/timeFormatter'

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: auto;
  padding: 0 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} 0 0;
      gap: ${vm(8)};
    `}
`

const MobileWrapper = styled.div<{ $issShowCharts: boolean }>`
  position: relative;
  flex-shrink: 0;
  height: 218px;
  ${({ theme, $issShowCharts }) =>
    theme.isMobile &&
    css`
      width: 100%;
      gap: ${vm(12)};
      height: ${vm(188)};
      transition: height ${ANI_DURATION}s;
      ${!$issShowCharts &&
      css`
        height: 0;
        overflow: hidden;
      `}
    `}
`

const ChartContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 218px;
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
      height: ${vm(160)};
      transition: height ${ANI_DURATION}s;
      .pending-wrapper {
        .icon-loading {
          font-size: 0.36rem;
        }
      }
    `}
`

const CryptoChart = function CryptoChart({
  ref,
  symbol = 'BTC',
  isBinanceSupport,
}: Omit<CryptoChartProps, 'backtestData'>) {
  const isMobile = useIsMobile()
  const [issShowCharts, setIsShowCharts] = useIssShowCharts()
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [selectedPeriod, setSelectedPeriod] = useSelectedPeriod()
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [historicalDataLoaded, setHistoricalDataLoaded] = useState<boolean>(false)
  const [reachedDataLimit, setReachedDataLimit] = useState<boolean>(false)
  const paramSymbol = `${symbol}USDT`
  const [timezone] = useTimezone()
  const { isOpen } = useKlineSubscription()

  const binanceTimeZone = useMemo(() => convertToBinanceTimeZone(timezone), [timezone])
  const wsTimeZone = useMemo(() => convertToBinanceTimeZone(timezone, true), [timezone])

  const customTimeFormatter = useMemo(
    () => createCustomTimeFormatter(timezone, selectedPeriod),
    [timezone, selectedPeriod],
  )

  const { chartRef, seriesRef, handleResize } = useChartInitialization({
    chartContainerRef,
    customTimeFormatter,
    paramSymbol,
    selectedPeriod,
    triggerGetKlineData: null,
  })

  useImperativeHandle(
    ref,
    () => ({
      handleResize,
    }),
    [handleResize],
  )

  const { klinesubData, setKlinesubData } = useCoinGeckoPolling({
    isBinanceSupport,
    historicalDataLoaded,
    symbol,
    paramSymbol,
    selectedPeriod,
  })
  const { handlePeriodChange } = usePeriodChange({
    paramSymbol,
    isBinanceSupport,
    binanceTimeZone,
    setHistoricalDataLoaded,
    setChartData,
    seriesRef,
  })

  const changeShowCharts = useCallback(() => {
    setIsShowCharts(!issShowCharts)
  }, [issShowCharts, setIsShowCharts])

  useRealtimeData({
    paramSymbol,
    selectedPeriod,
    historicalDataLoaded,
    isBinanceSupport,
    wsTimeZone,
    klinesubData: klinesubData as any,
    chartData,
    seriesRef,
    isOpen,
  })

  useChartDataLoader({
    chartRef,
    seriesRef,
    chartData,
    paramSymbol,
    selectedPeriod,
    reachedDataLimit,
    binanceTimeZone,
    isBinanceSupport,
    triggerGetKlineData: null,
    getConvertPeriod: null,
    setChartData,
    setReachedDataLimit,
  })

  useEffect(() => {
    setReachedDataLimit(false)
  }, [selectedPeriod])

  useEffect(() => {
    if (selectedPeriod) {
      handlePeriodChange(selectedPeriod)
    }
  }, [timezone, selectedPeriod, handlePeriodChange])

  useMarkerScroll({
    chartRef,
    seriesRef,
    chartData,
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
    <ChartWrapper>
      <ChartHeader
        symbol={symbol}
        // issShowCharts={issShowCharts}
        changeShowCharts={changeShowCharts}
        isBinanceSupport={isBinanceSupport}
        // isShowChartCheck={false}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        klineSubData={klinesubData}
      />
      <MobileWrapper $issShowCharts={issShowCharts}>
        {isMobile && (
          <PeridSelector
            isBinanceSupport={isBinanceSupport}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
        )}
        <ChartContainer ref={chartContainerRef}>
          {chartData.length === 0 && <Pending />}
          {/* Marker component - Only render when all references are valid */}
          {chartRef.current !== null &&
            seriesRef.current !== null &&
            chartContainerRef.current !== null &&
            chartData.length > 0 && (
              <Markers
                chartRef={chartRef as React.RefObject<IChartApi>}
                seriesRef={seriesRef as React.RefObject<ISeriesApi<'Area'>>}
                chartContainerRef={chartContainerRef as React.RefObject<HTMLDivElement>}
                chartData={chartData as any}
                selectedPeriod={selectedPeriod}
              />
            )}
        </ChartContainer>
      </MobileWrapper>
    </ChartWrapper>
  )
}

export default memo(CryptoChart)
