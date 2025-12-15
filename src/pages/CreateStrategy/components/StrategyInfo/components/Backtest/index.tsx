import styled, { css } from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { STRATEGY_STATUS, SymbolDataType } from 'store/createstrategy/createstrategy'
import { useStrategyBacktest, useStreamingSteps, useHandleRunBacktest } from 'store/createstrategy/hooks/useBacktest'
import useParsedQueryString from 'hooks/useParsedQueryString'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
import Workflow from './components/Workflow'
import DataList from './components/DataList'
import { vm } from 'pages/helper'
import CryptoChart from './components/CryptoChart'
import { CryptoChartRef } from 'store/insights/insights'
import VolumeChart from './components/VolumeChart'
import BuySellTable from './components/BuySellTable'
import Pending from 'components/Pending'

const BacktestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
  width: 100%;
`

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  padding: 16px;
`

const ContentWrapper = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`

const BacktestContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: calc(100% - 330px);
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

export default memo(function Backtest() {
  const { strategyId } = useParsedQueryString()
  const handleRunBacktest = useHandleRunBacktest()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategyBacktestData, isLoadingStrategyBacktest } = useStrategyBacktest({
    strategyId: strategyId || '',
  })
  const [currentSymbolData, setCurrentSymbolData] = useState<SymbolDataType | null>(null)
  const cryptoChartRef = useRef<CryptoChartRef>(null!)
  const [, isBacktestStreaming] = useStreamingSteps()
  const isCodeGenerated = useMemo(() => {
    return strategyDetail?.status === STRATEGY_STATUS.DRAFT_READY
  }, [strategyDetail])
  useEffect(() => {
    const symbols = strategyBacktestData?.result?.symbols || []
    if (symbols.length > 0) {
      setCurrentSymbolData(symbols[0])
    }
  }, [strategyBacktestData])
  if (isLoadingStrategyBacktest) {
    return (
      <BacktestWrapper>
        <Pending isFetching />
      </BacktestWrapper>
    )
  }
  return (
    <BacktestWrapper>
      {!isBacktestStreaming && strategyBacktestData?.status !== 'completed' && (
        <ActionLayer
          iconCls='icon-view-code'
          title={<Trans>Run Backtest</Trans>}
          description={
            isCodeGenerated ? (
              <Trans>Click [**Run Backtest]** to see how your strategy would have performed on historical data.</Trans>
            ) : (
              <Trans>Strategy Not Defined. Please describe and confirm your strategy logic first.</Trans>
            )
          }
          rightText={<Trans>Run Backtest</Trans>}
          rightButtonClickCallback={handleRunBacktest}
          rightButtonDisabled={!isCodeGenerated}
        />
      )}
      {isBacktestStreaming ? (
        <>
          <LoadingWrapper>
            <ThinkingProgress loadingText={<Trans>Running Backtest...</Trans>} intervalDuration={120000} />
          </LoadingWrapper>
          <ContentWrapper style={{ height: '100%' }}>
            <BacktestContent style={{ height: '100%' }}>
              <Pending isFetching />
            </BacktestContent>
            <Workflow />
          </ContentWrapper>
        </>
      ) : (
        strategyBacktestData && (
          <ContentWrapper>
            {currentSymbolData && (
              <BacktestContent>
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
              </BacktestContent>
            )}
            <Workflow />
          </ContentWrapper>
        )
      )}
    </BacktestWrapper>
  )
})
