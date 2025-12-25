import { useMemo } from 'react'
import { useStrategyTabIndex } from 'store/createstrategycache/hooks'
import { useIsGeneratingCode, useIsTypewritingCode, useStrategyCode } from './useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { GENERATION_STATUS, STRATEGY_TAB_INDEX } from '../createstrategy'
import { usePaperTrading } from './usePaperTrading'

export function useIsShowRestart() {
  const { strategyId } = useParsedQueryString()
  const [strategyInfoTabIndex] = useStrategyTabIndex(strategyId || undefined)
  const [isGeneratingCode] = useIsGeneratingCode()
  const [isTypewritingCode] = useIsTypewritingCode()
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const { generation_status, external_code } = strategyCode || { external_code: '', generation_status: null }
  const { paperTradingCurrentData } = usePaperTrading({ strategyId: strategyId || '' })
  return useMemo(() => {
    if (
      strategyInfoTabIndex === STRATEGY_TAB_INDEX.CODE &&
      !isGeneratingCode &&
      (generation_status === GENERATION_STATUS.COMPLETED ||
        (generation_status === GENERATION_STATUS.FAILED && !!external_code)) &&
      !isTypewritingCode
    ) {
      return true
    } else if (
      strategyInfoTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING &&
      paperTradingCurrentData?.status &&
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
    isTypewritingCode,
    paperTradingCurrentData,
  ])
}
