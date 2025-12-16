import { vm } from 'pages/helper'
import { memo, useCallback, useEffect, useRef } from 'react'
import { useIsShowWorkflow } from 'store/createstrategy/hooks/useBacktest'
import styled, { css } from 'styled-components'
import CryptoChart from '../CryptoChart'
import { CryptoChartRef } from 'store/insights/insights'
import DataList from '../DataList'
import VolumeChart from '../VolumeChart'
import BuySellTable from '../BuySellTable'
import { StrategyBacktestDataType, SymbolDataType } from 'store/createstrategy/createstrategy'

const BacktestContentWrapper = styled.div<{ $isShowWorkflow: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: fit-content;
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
  ${({ $isShowWorkflow }) =>
    $isShowWorkflow &&
    css`
      width: calc(100% - 330px);
    `}
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

export default memo(function BacktestContent({
  currentSymbolData,
  strategyBacktestData,
  setCurrentSymbolData,
}: {
  currentSymbolData: SymbolDataType
  strategyBacktestData: StrategyBacktestDataType
  setCurrentSymbolData: (symbolData: SymbolDataType) => void
}) {
  const backtestContentRef = useRef<HTMLDivElement>(null)
  const cryptoChartRef = useRef<CryptoChartRef>(null!)
  const [isShowWorkflow] = useIsShowWorkflow()
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
    if (!backtestContentRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 当容器尺寸发生变化时，调用图表的 resize 方法
        // 添加一个小延迟来确保 CSS 过渡动画完成
        setTimeout(() => {
          handleChartsResize()
        }, 50) // 50ms 延迟，确保动画完成
      }
    })

    resizeObserver.observe(backtestContentRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [backtestContentRef, handleChartsResize])

  return (
    <BacktestContentWrapper ref={backtestContentRef} $isShowWorkflow={isShowWorkflow}>
      <CryptoChart
        currentSymbolData={currentSymbolData}
        setCurrentSymbolData={setCurrentSymbolData}
        strategyBacktestData={strategyBacktestData}
        showFullScreen={false}
        isBinanceSupport={false}
        ref={cryptoChartRef}
      />
      {/* {isMobile && (
                <Title>
                  <Trans>Details</Trans>
                </Title>
              )} */}
      <DataList strategyBacktestData={strategyBacktestData} />
      {/* {isMobile && (
                <Title>
                  <Trans>Strategy vs. HODL</Trans>
                </Title>
              )} */}
      <VolumeChart
        currentSymbolData={currentSymbolData}
        isBinanceSupport={false}
        strategyBacktestData={strategyBacktestData}
      />
      {/* {isMobile && (
                <Title>
                  <Trans>Transaction History</Trans>
                </Title>
              )} */}
      <BuySellTable currentSymbolData={currentSymbolData} strategyBacktestData={strategyBacktestData} />
    </BacktestContentWrapper>
  )
})
