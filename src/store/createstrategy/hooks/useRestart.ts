import { useMemo } from 'react'
import { useStrategyInfoTabIndex } from './useTabIndex'
import { useIsGeneratingCode, useStrategyCode } from './useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { GENERATION_STATUS } from '../createstrategy'
import { useStrategyBacktest, useStreamingSteps } from './useBacktest'

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
  return useMemo(() => {
    if (strategyInfoTabIndex === 1 && !isGeneratingCode && generation_status === GENERATION_STATUS.COMPLETED) {
      return true
    } else if (strategyInfoTabIndex === 2 && !isBacktestStreaming && strategyBacktestData?.status === 'completed') {
      return true
    }
    // TODO: 添加 Paper Trading 重启逻辑
    return false
  }, [strategyInfoTabIndex, isGeneratingCode, generation_status, isBacktestStreaming, strategyBacktestData])
}
