import styled from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo, useEffect, useMemo, useState } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { BACKTEST_STATUS, STRATEGY_STATUS, SymbolDataType } from 'store/createstrategy/createstrategy'
import {
  useStrategyBacktest,
  useStreamingSteps,
  useHandleRunBacktest,
  useIsShowWorkflow,
} from 'store/createstrategy/hooks/useBacktest'
import useParsedQueryString from 'hooks/useParsedQueryString'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
import Workflow from './components/Workflow'
import Pending from 'components/Pending'
import BacktestContent from './components/BacktestContent'

const BacktestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
  width: 100%;
  height: 100%;
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
  position: relative;
  display: flex;
  gap: 4px;
  width: 100%;
  height: 100%;
`

const BacktestContentLoading = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  white-space: pre-wrap;
`

export default memo(function Backtest() {
  const { strategyId } = useParsedQueryString()
  const handleRunBacktest = useHandleRunBacktest()
  const [isShowWorkflow] = useIsShowWorkflow()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategyBacktestData, isLoadingStrategyBacktest, refetch } = useStrategyBacktest({
    strategyId: strategyId || '',
  })

  const [currentSymbolData, setCurrentSymbolData] = useState<SymbolDataType | null>(null)
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
  // 当状态为 RUNNING 时，每 5 秒轮询一次
  useEffect(() => {
    if (strategyBacktestData?.status === BACKTEST_STATUS.RUNNING) {
      const intervalId = setInterval(() => {
        refetch()
      }, 5000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [strategyBacktestData?.status, refetch])
  if (isLoadingStrategyBacktest) {
    return (
      <BacktestWrapper>
        <Pending isNotButtonLoading />
      </BacktestWrapper>
    )
  }
  return (
    <BacktestWrapper>
      {!isBacktestStreaming &&
        strategyBacktestData?.status !== BACKTEST_STATUS.COMPLETED &&
        strategyBacktestData?.status !== BACKTEST_STATUS.RUNNING && (
          <ActionLayer
            iconCls='icon-view-code'
            title={<Trans>Run Backtest</Trans>}
            description={
              isCodeGenerated ? (
                <Trans>
                  Click [**Run Backtest]** to see how your strategy would have performed on historical data.
                </Trans>
              ) : (
                <Trans>Strategy Not Defined. Please describe and confirm your strategy logic first.</Trans>
              )
            }
            rightText={<Trans>Run Backtest</Trans>}
            rightButtonClickCallback={handleRunBacktest}
            rightButtonDisabled={!isCodeGenerated}
          />
        )}
      {isBacktestStreaming || strategyBacktestData?.status === BACKTEST_STATUS.RUNNING ? (
        <>
          <LoadingWrapper>
            <ThinkingProgress loadingText={<Trans>Running Backtest...</Trans>} intervalDuration={120000} />
          </LoadingWrapper>
          <ContentWrapper style={{ height: '100%' }}>
            <BacktestContentLoading>
              <Pending isNotButtonLoading />
            </BacktestContentLoading>
          </ContentWrapper>
        </>
      ) : (
        strategyBacktestData && (
          <ContentWrapper>
            {currentSymbolData && (
              <BacktestContent
                currentSymbolData={currentSymbolData}
                strategyBacktestData={strategyBacktestData}
                setCurrentSymbolData={setCurrentSymbolData}
              />
            )}
            <Workflow isShowWorkflow={isShowWorkflow} />
          </ContentWrapper>
        )
      )}
    </BacktestWrapper>
  )
})
