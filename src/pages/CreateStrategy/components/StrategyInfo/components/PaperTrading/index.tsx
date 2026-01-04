import styled, { css } from 'styled-components'
import { useCallback } from 'react'
import PaperTradingSetup from './components/PaperTradingSetup'
import PaperTradingRunning from './components/PaperTradingRunning'
import PaperTradingTabs from './components/PaperTradingTabs'
import PaperTradingFullScreen from './components/PaperTradingFullScreen'
import {
  usePaperTrading,
  useHandleStartPaperTrading,
  useIsStartingPaperTrading,
  useIsShowExpandPaperTrading,
} from 'store/createstrategy/hooks/usePaperTrading'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Pending from 'components/Pending'

const PaperTradingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

export default function PaperTrading() {
  const { strategyId } = useParsedQueryString()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const [isStartingPaperTrading] = useIsStartingPaperTrading()
  const [isShowExpandPaperTrading] = useIsShowExpandPaperTrading()
  const { paperTradingCurrentData, isLoadingPaperTradingCurrent } = usePaperTrading({
    strategyId: strategyId || '',
  })

  const handleRunPaperTrading = useCallback(async () => {
    handleStartPaperTrading()
  }, [handleStartPaperTrading])

  // 如果正在加载Paper Trading状态，显示加载状态
  if (isLoadingPaperTradingCurrent) {
    return (
      <PaperTradingWrapper>
        <Pending isNotButtonLoading />
      </PaperTradingWrapper>
    )
  }

  // 如果有Paper Trading数据，说明正在运行，根据全屏状态显示不同视图
  if (paperTradingCurrentData) {
    return (
      <PaperTradingWrapper>
        {isShowExpandPaperTrading ? <PaperTradingFullScreen /> : <PaperTradingTabs />}
      </PaperTradingWrapper>
    )
  }

  // 否则显示Setup视图
  return (
    <PaperTradingWrapper>
      <PaperTradingSetup onRunPaperTrading={handleRunPaperTrading} isLoading={isStartingPaperTrading} />
    </PaperTradingWrapper>
  )
}
