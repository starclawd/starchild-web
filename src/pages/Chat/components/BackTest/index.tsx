import BuySellTable from 'pages/AgentDetail/components/Preview/components/BuySellTable'
import CryptoChart from 'pages/AgentDetail/components/Preview/components/CryptoChart'
import DataList from 'pages/AgentDetail/components/Preview/components/DataList'
import VolumeChart from 'pages/AgentDetail/components/Preview/components/VolumeChart'
import { vm } from 'pages/helper'
import { useEffect, useMemo, useRef } from 'react'
import { useIsMobile } from 'store/application/hooks'
import { BacktestData } from 'store/agentdetail/agentdetail'
import { useBinanceSymbols } from 'store/insights/hooks'
import { CryptoChartRef } from 'store/insights/insights'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const BackTestWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
    `}
`

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.lineDark6};
`

const TableWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.lineDark6};
`

export default function BackTest({ backtestData }: { backtestData: BacktestData }) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const { symbol } = backtestData
  const [binanceSymbols] = useBinanceSymbols()
  const backTestWrapperRef = useRef<HTMLDivElement>(null)
  const cryptoChartRef = useRef<CryptoChartRef>(null)
  const propSymbol = useMemo(() => {
    return symbol.toUpperCase().replace('USDT', '')
  }, [symbol])
  const isBinanceSupport = useMemo(() => {
    const filterBinanceSymbols = binanceSymbols
      .filter((symbol: any) => symbol.quoteAsset === 'USDT')
      .map((symbol: any) => symbol.baseAsset)
    return filterBinanceSymbols.includes(propSymbol)
  }, [propSymbol, binanceSymbols])

  // 监听 RightContent 的宽度变化
  useEffect(() => {
    if (!backTestWrapperRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 当容器宽度发生变化时，调用图表的 handleResize 方法
        if (cryptoChartRef.current) {
          cryptoChartRef.current.handleResize()
        }
      }
    })

    resizeObserver.observe(backTestWrapperRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])
  return (
    <BackTestWrapper ref={backTestWrapperRef as any} $borderRadius={24} $borderColor={theme.bgT30}>
      <CryptoChart
        symbol={propSymbol}
        ref={cryptoChartRef as any}
        isBinanceSupport={isBinanceSupport}
        backtestData={backtestData}
        showFullScreen={true}
      />
      {!isMobile && (
        <BottomWrapper>
          <DataList backtestData={backtestData} />
          <VolumeChart symbol={propSymbol} isBinanceSupport={isBinanceSupport} backtestData={backtestData} />
        </BottomWrapper>
      )}
      {!isMobile && (
        <TableWrapper>
          <BuySellTable backtestData={backtestData} />
        </TableWrapper>
      )}
    </BackTestWrapper>
  )
}
