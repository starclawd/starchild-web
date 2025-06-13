import { useScrollbarClass } from 'hooks/useScrollbarClass'
import CryptoChart from 'pages/BackTest/components/CryptoChart'
import styled from 'styled-components'
import Highlights from 'pages/BackTest/components/Highlights'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBinanceSymbols } from 'store/insights/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useBacktestData, useGetBacktestData } from 'store/backtest/hooks'
import Pending from 'components/Pending'

const MobileBackTestWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  padding: 12px;
  cursor: pointer;
  .icon-loading {
    font-size: 36px !important;
  }
  @media screen and (orientation:landscape) {
    gap: 20px;
    width: 100vw;
    height: 100vh !important;
    min-height: 100vh;
    max-height: none;
    overflow-y: auto;
    .chart-content-wrapper {
      height: 100vh;
    }
    .highlights-content {
      height: calc(100vh + 46px);
    }
  }
`

export default function MobileBackTest() {
  const [backtestData] = useBacktestData()
  const { symbol } = backtestData
  const [isLoading, setIsLoading] = useState(false)
  const [orientationKey, setOrientationKey] = useState(0)
  const [binanceSymbols] = useBinanceSymbols()
  const { taskId } = useParsedQueryString()
  const triggerGetBacktestData = useGetBacktestData()
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  const propSymbol = useMemo(() => {
    return symbol.toUpperCase().replace('USDT', '')
  }, [symbol])
  const isBinanceSupport = useMemo(() => {
    const filterBinanceSymbols = binanceSymbols.filter((symbol: any) => symbol.quoteAsset === 'USDT').map((symbol: any) => symbol.baseAsset)
    return filterBinanceSymbols.includes(propSymbol)
  }, [propSymbol, binanceSymbols])
  const init = useCallback(async () => {
    try {
      if (taskId) {
        setIsLoading(true)
        await triggerGetBacktestData(taskId)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }, [taskId, triggerGetBacktestData])
  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        setOrientationKey(prev => prev + 1)
        init()
      }, 300)
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    
    const mediaQuery = window.matchMedia('(orientation: landscape)')
    const handleMediaChange = () => {
      setTimeout(() => {
        setOrientationKey(prev => prev + 1)
        init()
      }, 300)
    }
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange)
    } else {
      mediaQuery.addListener(handleMediaChange)
    }

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange)
      } else {
        mediaQuery.removeListener(handleMediaChange)
      }
    }
  }, [init])

  useEffect(() => {
    init()
  }, [init])

  return <MobileBackTestWrapper 
    key={orientationKey}
    ref={backTestWrapperRef as any}
  >
    {isLoading
      ? <Pending isFetching />
      : <>
        <CryptoChart
          key={`chart-${orientationKey}`}
          symbol={propSymbol}
          ref={backTestWrapperRef as any}
          isBinanceSupport={isBinanceSupport}
          isMobileBackTestPage={true}
          backtestData={backtestData}
        />
        <Highlights 
          key={`highlights-${orientationKey}`}
          isMobileBackTestPage={true} 
          backtestData={backtestData}
        />
      </>}
    
  </MobileBackTestWrapper>
}
