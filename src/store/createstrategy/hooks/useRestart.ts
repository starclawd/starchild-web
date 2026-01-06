import { useMemo } from 'react'
import { useCurrentStrategyTabIndex } from 'store/createstrategy/hooks/useStrategyDetail'
import { useIsGeneratingCode, useIsTypewritingCode, useStrategyCode } from './useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { GENERATION_STATUS, PAPER_TRADING_STATUS, STRATEGY_TAB_INDEX } from '../createstrategy'
import { usePaperTrading } from './usePaperTrading'

export function useIsShowRestart() {
  const { strategyId } = useParsedQueryString()
  const [currentStrategyTabIndex] = useCurrentStrategyTabIndex()
  const [isGeneratingCode] = useIsGeneratingCode()
  const [isTypewritingCode] = useIsTypewritingCode()
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const { generation_status, external_code } = strategyCode || { external_code: '', generation_status: null }
  const { paperTradingCurrentData } = usePaperTrading({ strategyId: strategyId || '' })
  return useMemo(() => {
    if (
      currentStrategyTabIndex === STRATEGY_TAB_INDEX.CODE &&
      !isGeneratingCode &&
      (generation_status === GENERATION_STATUS.COMPLETED ||
        (generation_status === GENERATION_STATUS.FAILED && !!external_code)) &&
      !isTypewritingCode
    ) {
      return true
    } else if (
      currentStrategyTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING &&
      (paperTradingCurrentData?.status === PAPER_TRADING_STATUS.RUNNING ||
        paperTradingCurrentData?.status === PAPER_TRADING_STATUS.PAUSED)
    ) {
      return true
    }
    return false
  }, [
    external_code,
    currentStrategyTabIndex,
    isGeneratingCode,
    generation_status,
    isTypewritingCode,
    paperTradingCurrentData,
  ])
}
