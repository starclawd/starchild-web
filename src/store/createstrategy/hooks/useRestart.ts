import { useMemo } from 'react'
import { useStrategyInfoTabIndex } from './useTabIndex'
import { useIsGeneratingCode, useIsTypewritingCode, useStrategyCode } from './useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { BACKTEST_STATUS, GENERATION_STATUS } from '../createstrategy'
import { useStrategyBacktest, useStreamingSteps } from './useBacktest'
import { usePaperTrading } from './usePaperTrading'

export function useIsShowRestart() {
  const { strategyId } = useParsedQueryString()
  const [strategyInfoTabIndex] = useStrategyInfoTabIndex()
  const [isGeneratingCode] = useIsGeneratingCode()
  const [, isBacktestStreaming] = useStreamingSteps()
  const [isTypewritingCode] = useIsTypewritingCode()
  const { strategyBacktestData } = useStrategyBacktest({
    strategyId: strategyId || '',
  })
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const { generation_status, external_code } = strategyCode || { external_code: '', generation_status: null }
  const { paperTradingCurrentData } = usePaperTrading({ strategyId: strategyId || '' })
  return useMemo(() => {
    if (
      strategyInfoTabIndex === 1 &&
      !isBacktestStreaming &&
      strategyBacktestData?.status === BACKTEST_STATUS.COMPLETED
    ) {
      return true
    } else if (
      strategyInfoTabIndex === 2 &&
      !isGeneratingCode &&
      (generation_status === GENERATION_STATUS.COMPLETED ||
        (generation_status === GENERATION_STATUS.FAILED && !!external_code)) &&
      !isTypewritingCode
    ) {
      return true
    } else if (
      strategyInfoTabIndex === 3 &&
      paperTradingCurrentData?.status === 'active' &&
      paperTradingCurrentData?.mode === 'paper_trading'
    ) {
      return true
    }
    return false
  }, [
    external_code,
    strategyInfoTabIndex,
    isGeneratingCode,
    generation_status,
    isBacktestStreaming,
    isTypewritingCode,
    strategyBacktestData,
    paperTradingCurrentData,
  ])
}
