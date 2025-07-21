import { useBacktestData, useIsGeneratingCode, useIsRunningBacktestAgent } from 'store/agentdetail/hooks'
import styled, { css } from 'styled-components'
import CryptoChart from './components/CryptoChart'
import { useBinanceSymbols } from 'store/insights/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useMemo, useRef, useEffect, useCallback } from 'react'
import DataList from './components/DataList'
import VolumeChart from './components/VolumeChart'
import BuySellTable from './components/BuySellTable'
import { CryptoChartRef } from 'store/insights/insights.d'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { BACKTEST_STATUS } from 'store/agentdetail/agentdetail'
import Pending from 'components/Pending'

const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: fit-content;
  margin-top: 20px;
  white-space: pre-wrap;
  .chart-wrapper {
    margin-bottom: 20px;
  }
  .data-list-wrapper {
    margin-bottom: 12px;
  }
  .volume-chart-wrapper {
    margin-bottom: 20px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .chart-wrapper {
        margin-bottom: ${vm(20)};
      }
      .data-list-wrapper {
        margin-bottom: ${vm(20)};
      }
      .volume-chart-wrapper {
        margin-bottom: ${vm(20)};
      }
    `}
`

const Title = styled.div`
  font-size: 0.18rem;
  font-weight: 400;
  line-height: 0.22rem;
  margin-bottom: ${vm(12)};
  color: ${({ theme }) => theme.textL1};
`

const ErrorDisplay = styled.pre`
  padding: 20px;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.textL2};
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      font-size: ${vm(12)};
    `}
`

// 简单格式化错误信息
const formatErrorForDisplay = (message: string) => {
  try {
    // 查找 JSON 部分
    const jsonStart = message.indexOf('{')
    if (jsonStart === -1) return message

    const textPart = message.substring(0, jsonStart).trim()
    const jsonPart = message.substring(jsonStart)

    // 尝试格式化 JSON
    try {
      const parsed = JSON.parse(jsonPart)
      const formattedJson = JSON.stringify(parsed, null, 2)
      return textPart + '\n\n' + formattedJson
    } catch {
      return message
    }
  } catch {
    return message
  }
}

export default function Preview() {
  const [backtestData] = useBacktestData()
  const { symbol, status, error_msg } = backtestData
  const isMobile = useIsMobile()
  const [binanceSymbols] = useBinanceSymbols()
  const previewWrapperRef = useScrollbarClass<HTMLDivElement>()
  const cryptoChartRef = useRef<CryptoChartRef>(null!)
  const isRunningBacktestAgent = useIsRunningBacktestAgent()
  const isGeneratingCode = useIsGeneratingCode()

  const propSymbol = useMemo(() => {
    return symbol.toUpperCase().replace('USDT', '')
  }, [symbol])

  const isBinanceSupport = useMemo(() => {
    const filterBinanceSymbols = binanceSymbols
      .filter((symbol: any) => symbol.quoteAsset === 'USDT')
      .map((symbol: any) => symbol.baseAsset)
    return filterBinanceSymbols.includes(propSymbol)
  }, [propSymbol, binanceSymbols])

  // 处理图表尺寸调整的回调函数
  const handleChartsResize = useCallback(() => {
    // 使用 requestAnimationFrame 确保 DOM 更新完成后再调整图表尺寸
    requestAnimationFrame(() => {
      // 调用 CryptoChart 的 handleResize 方法
      if (cryptoChartRef.current?.handleResize) {
        cryptoChartRef.current.handleResize()
      }
      // VolumeChart 使用 Chart.js，会自动响应容器尺寸变化，无需手动调用 resize
    })
  }, [])

  // 监听容器尺寸变化
  useEffect(() => {
    if (!previewWrapperRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 当容器尺寸发生变化时，调用图表的 resize 方法
        // 添加一个小延迟来确保 CSS 过渡动画完成
        setTimeout(() => {
          handleChartsResize()
        }, 50) // 50ms 延迟，确保动画完成
      }
    })

    resizeObserver.observe(previewWrapperRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [previewWrapperRef, handleChartsResize])

  if (isRunningBacktestAgent || isGeneratingCode) {
    return (
      <PreviewWrapper className='scroll-style' ref={previewWrapperRef as any}>
        <Pending isFetching />
      </PreviewWrapper>
    )
  }
  if (status === BACKTEST_STATUS.FAILED) {
    return (
      <PreviewWrapper className='scroll-style' ref={previewWrapperRef as any}>
        <ErrorDisplay>{formatErrorForDisplay(error_msg)}</ErrorDisplay>
      </PreviewWrapper>
    )
  }
  return (
    <PreviewWrapper className='scroll-style' ref={previewWrapperRef as any}>
      <CryptoChart
        symbol={propSymbol}
        backtestData={backtestData}
        ref={cryptoChartRef}
        showFullScreen={false}
        isBinanceSupport={isBinanceSupport}
      />
      {isMobile && (
        <Title>
          <Trans>Details</Trans>
        </Title>
      )}
      <DataList backtestData={backtestData} />
      {isMobile && (
        <Title>
          <Trans>Strategy vs. HODL</Trans>
        </Title>
      )}
      <VolumeChart symbol={propSymbol} isBinanceSupport={isBinanceSupport} backtestData={backtestData} />
      {isMobile && (
        <Title>
          <Trans>Transaction History</Trans>
        </Title>
      )}
      <BuySellTable backtestData={backtestData} />
    </PreviewWrapper>
  )
}
