import styled from 'styled-components'
import CryptoChart from './components/CryptoChart'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import DataList from './components/DataList'
import VolumeChart from './components/VolumeChart'
import Highlights from './components/Highlights'
import { useBacktestData, useGetBacktestData } from 'store/backtest/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useBinanceSymbols, useGetExchangeInfo } from 'store/insights/hooks'
import Pending from 'components/Pending'

const BackTestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 1920px;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
  overflow-x: hidden;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: calc(100% - 380px);
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  .chart-wrapper {
    height: 60%;
    .chart-content-wrapper {
      height: calc(100% - 104px);
    }
  }
`

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 40%;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.lineDark6};
  .volume-chart-wrapper {
    height: calc(100% - 70px);
    .chart-content {
      /* height: calc(100% - 30px); */
      height: 100%;
    }
  }
  .item-wrapper {
    width: calc((100% - 20px) / 6);
  }
`

export default function BackTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [binanceSymbols] = useBinanceSymbols()
  const [{ symbol }] = useBacktestData()
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
        const data = await triggerGetBacktestData(taskId)
        if (!(data as any).data.success) {
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
    } catch (error) {
      setIsLoading(false)
    }
  }, [taskId, triggerGetExchangeInfo, triggerGetBacktestData])
  useEffect(() => {
    init()
  }, [init])
  return <BackTestWrapper
    className="scroll-style"
    ref={backTestWrapperRef as any}
  >
    <Content>
      {isLoading
      ? <Pending isFetching />
      : <>
        <Left>
          <CryptoChart
            symbol={propSymbol}
            ref={backTestWrapperRef as any}
            isBinanceSupport={isBinanceSupport}
          />
          <BottomWrapper>
            <DataList />
            <VolumeChart />
          </BottomWrapper>
        </Left>
        <Highlights />
      </>}
    </Content>
  </BackTestWrapper>
}
