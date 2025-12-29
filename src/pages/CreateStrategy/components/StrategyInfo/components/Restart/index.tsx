import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'
import { memo, useCallback } from 'react'
import { useHandleGenerateCode } from 'store/createstrategy/hooks/useCode'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import { useHandleStartPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { useIsShowRestart } from 'store/createstrategy/hooks/useRestart'
import { useStrategyTabIndex } from 'store/createstrategycache/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import styled from 'styled-components'
import PaperTradingRunPause from './components/PaperTradingRunPause'
import PublicPrivateToggle from './components/PublicPrivateToggle'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'

const RestartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 8px;
  width: 100%;
  height: 48px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  background: rgba(0, 0, 0, 0.64);
  backdrop-filter: blur(4px);
`

const RestartActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const RestartButton = styled(ButtonCommon)`
  width: fit-content;
  min-width: 70px;
  height: 32px;
  padding: 8px 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

export default memo(function Restart({ isLoading }: { isLoading?: boolean }) {
  const isShowRestart = useIsShowRestart()
  const { strategyId } = useParsedQueryString()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const [strategyInfoTabIndex] = useStrategyTabIndex(strategyId || undefined)
  const handleGenerateCode = useHandleGenerateCode()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const handleRestart = useCallback(() => {
    if (isStep3Deploying) {
      return
    }
    if (strategyInfoTabIndex === STRATEGY_TAB_INDEX.CODE) {
      handleGenerateCode()
    } else if (strategyInfoTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING) {
      handleStartPaperTrading()
    }
  }, [strategyInfoTabIndex, handleGenerateCode, handleStartPaperTrading, isStep3Deploying])

  if (!isShowRestart) return null
  return (
    <RestartWrapper>
      <span>
        {strategyInfoTabIndex === STRATEGY_TAB_INDEX.CODE ? (
          <Trans>Strategy changed or unsatisfied with the results? Click 'Regenerate' to update the code.</Trans>
        ) : (
          <Trans>Strategy changed or unsatisfied with the results? Click 'Restart' to restart the papertrading.</Trans>
        )}
      </span>
      <RestartActionWrapper>
        {strategyInfoTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING && <PaperTradingRunPause />}
        <RestartButton $disabled={isStep3Deploying} onClick={handleRestart}>
          {isLoading ? (
            <Pending />
          ) : strategyInfoTabIndex === STRATEGY_TAB_INDEX.CODE ? (
            <Trans>Regenerate</Trans>
          ) : (
            <Trans>Restart</Trans>
          )}
        </RestartButton>
        {/* {strategyInfoTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING && <PublicPrivateToggle />} */}
      </RestartActionWrapper>
    </RestartWrapper>
  )
})
