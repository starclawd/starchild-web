import { useMemo } from 'react'
import Pending from 'components/Pending'
import styled from 'styled-components'
import CryptoChart from '../CryptoChart'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { BacktestData } from 'store/backtest/backtest.d'
import { useBinanceSymbols } from 'store/insights/hooks'
import DataList from '../DataList'
import VolumeChart from '../VolumeChart'
import BuySellTable from '../BuySellTable'
import Highlights from '../Highlights'

const ContentWrapper = styled.div`
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
  height: fit-content;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  .chart-wrapper {
    height: 462px;
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
  height: 300px;
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

const TableWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.lineDark6};
`

export default function Content({
  isLoading,
  backtestData,
  showFullScreen,
}: {
  isLoading: boolean
  backtestData: BacktestData
  showFullScreen?: boolean
}) {
  const { symbol } = backtestData
  const [binanceSymbols] = useBinanceSymbols()
  const backTestWrapperRef = useScrollbarClass<HTMLDivElement>()
  const propSymbol = useMemo(() => {
    return symbol.toUpperCase().replace('USDT', '')
  }, [symbol])
  const isBinanceSupport = useMemo(() => {
    const filterBinanceSymbols = binanceSymbols.filter((symbol: any) => symbol.quoteAsset === 'USDT').map((symbol: any) => symbol.baseAsset)
    return filterBinanceSymbols.includes(propSymbol)
  }, [propSymbol, binanceSymbols])
  return <ContentWrapper
    className="scroll-style backtest-content"
    ref={backTestWrapperRef as any}
  >
    {isLoading
    ? <Pending isFetching />
    : <>
      <Left>
        <CryptoChart
          symbol={propSymbol}
          backtestData={backtestData}
          ref={backTestWrapperRef as any}
          showFullScreen={showFullScreen}
          isBinanceSupport={isBinanceSupport}
        />
        <BottomWrapper>
          <DataList backtestData={backtestData} />
          <VolumeChart backtestData={backtestData} />
        </BottomWrapper>
        <TableWrapper>
          <BuySellTable backtestData={backtestData} />
        </TableWrapper>
      </Left>
      <Highlights backtestData={backtestData} />
    </>}
  </ContentWrapper>
}
