import { useMemo } from 'react'
import { useStrategyInfoTabIndex } from './useTabIndex'
import { useIsGeneratingCode, useStrategyCode } from './useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { GENERATION_STATUS } from '../createstrategy'
import { useStrategyBacktest, useStreamingSteps } from './useBacktest'
import { usePaperTrading } from './usePaperTrading'

export function useIsShowRestart() {
  const { strategyId } = useParsedQueryString()
  const [strategyInfoTabIndex] = useStrategyInfoTabIndex()
  const [isGeneratingCode] = useIsGeneratingCode()
  const [, isBacktestStreaming] = useStreamingSteps()
  const { strategyBacktestData } = useStrategyBacktest({
    strategyId: strategyId || '',
  })
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const { generation_status } = strategyCode || { external_code: '', generation_status: null }
  const { paperTradingCurrentData } = usePaperTrading({ strategyId: strategyId || '' })
  return useMemo(() => {
    if (strategyInfoTabIndex === 1 && !isGeneratingCode && generation_status === GENERATION_STATUS.COMPLETED) {
      return true
    } else if (strategyInfoTabIndex === 2 && !isBacktestStreaming && strategyBacktestData?.status === 'completed') {
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
    strategyInfoTabIndex,
    isGeneratingCode,
    generation_status,
    isBacktestStreaming,
    strategyBacktestData,
    paperTradingCurrentData,
  ])
}
