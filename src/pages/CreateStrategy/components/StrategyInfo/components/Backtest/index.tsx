import styled from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo } from 'react'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import { useStrategyBacktest, useGetBacktestStreamData } from 'store/createstrategy/hooks/useBacktest'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Divider from 'components/Divider'
import { useTheme } from 'store/themecache/hooks'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'

const BacktestWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  flex-grow: 1;
`

const Workflow = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  flex-shrink: 0;
`

const WorkflowTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL2};
`

export default memo(function Backtest() {
  const theme = useTheme()
  const { strategyId } = useParsedQueryString()
  const { strategyDetail } = useStrategyDetail()
  const { strategyBacktestData, refetch: refetchStrategyBacktestData } = useStrategyBacktest()
  const { fetchBacktestStream, isStreaming } = useGetBacktestStreamData()
  const isCodeGenerated = useMemo(() => {
    return strategyDetail?.status === STRATEGY_STATUS.DRAFT_READY
  }, [strategyDetail])
  const handleRunBacktest = useCallback(async () => {
    if (!strategyId || isStreaming) return
    await fetchBacktestStream({ strategyId })
  }, [strategyId, isStreaming, fetchBacktestStream])
  return (
    <BacktestWrapper>
      {isStreaming ? (
        <LoadingWrapper>
          <ThinkingProgress loadingText={<Trans>Running Backtest...</Trans>} intervalDuration={120000} />
        </LoadingWrapper>
      ) : (
        strategyBacktestData && (
          <ContentWrapper>
            <BacktestContent></BacktestContent>
            <Workflow>
              <WorkflowTitle>
                <Trans>Workflow</Trans>
              </WorkflowTitle>
              <Divider color={theme.lineDark8} height={1} paddingVertical={12} />
            </Workflow>
          </ContentWrapper>
        )
      )}
      {!isStreaming && (
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
    </BacktestWrapper>
  )
})
