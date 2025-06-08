import { useScrollbarClass } from 'hooks/useScrollbarClass'
import CryptoChart from 'pages/BackTest/components/CryptoChart'
import styled from 'styled-components'
import Highlights from 'pages/BackTest/components/Highlights'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBinanceSymbols, useGetExchangeInfo } from 'store/insights/hooks'
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
    height: calc(100vh + 60px) !important;
    min-height: calc(100vh + 60px);
    max-height: none;
    overflow-y: auto;
  }
`

export default function MobileBackTest() {
  const [{ symbol }] = useBacktestData()
  const [isLoading, setIsLoading] = useState(false)
  const [binanceSymbols] = useBinanceSymbols()
  const triggerGetExchangeInfo = useGetExchangeInfo()
  const { taskId } = useParsedQueryString()
  const triggerGetBacktestData = useGetBacktestData()
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  const propSymbol = useMemo(() => {
    return symbol.replace('USDT', '')
  }, [symbol])
  const isBinanceSupport = useMemo(() => {
    const filterBinanceSymbols = binanceSymbols.filter((symbol: any) => symbol.quoteAsset === 'USDT').map((symbol: any) => symbol.baseAsset)
    return filterBinanceSymbols.includes(propSymbol)
  }, [propSymbol, binanceSymbols])
  const init = useCallback(async () => {
    try {
      if (taskId) {
        setIsLoading(true)
        await triggerGetExchangeInfo()
        await triggerGetBacktestData(taskId)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }, [taskId, triggerGetExchangeInfo, triggerGetBacktestData])
  useEffect(() => {
    init()
  }, [init])

  return <MobileBackTestWrapper 
    ref={backTestWrapperRef as any}
  >
    {isLoading
      ? <Pending isFetching />
      : <>
        <CryptoChart
          symbol={propSymbol}
          ref={backTestWrapperRef as any}
          isBinanceSupport={isBinanceSupport}
          isMobileBackTestPage={true}
        />
        <Highlights />
      </>}
    
  </MobileBackTestWrapper>
}
