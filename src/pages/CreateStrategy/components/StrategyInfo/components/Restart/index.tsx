import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'
import { memo, useCallback } from 'react'
import { useHandleRunBacktest } from 'store/createstrategy/hooks/useBacktest'
import { useHandleGenerateCode } from 'store/createstrategy/hooks/useCode'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import { useHandleStartPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { useIsShowRestart } from 'store/createstrategy/hooks/useRestart'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import styled from 'styled-components'

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
  const isStep3Deploying = useIsStep3Deploying()
  const [strategyInfoTabIndex] = useStrategyInfoTabIndex()
  const handleGenerateCode = useHandleGenerateCode()
  const handleRunBacktest = useHandleRunBacktest()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const handleRestart = useCallback(() => {
    if (isStep3Deploying) {
      return
    }
    if (strategyInfoTabIndex === 1) {
      handleGenerateCode()
    } else if (strategyInfoTabIndex === 2) {
      handleRunBacktest()
    } else if (strategyInfoTabIndex === 3) {
      handleStartPaperTrading()
    }
  }, [strategyInfoTabIndex, handleGenerateCode, handleRunBacktest, handleStartPaperTrading, isStep3Deploying])
  if (!isShowRestart) return null
  return (
    <RestartWrapper>
      <span>
        {strategyInfoTabIndex === 1 ? (
          <Trans>Strategy changed or unsatisfied with the results? Click 'Regenerate' to update the code.</Trans>
        ) : strategyInfoTabIndex === 2 ? (
          <Trans>Strategy changed or unsatisfied with the results? Click 'Restart' to restart the backtest.</Trans>
        ) : (
          <Trans>Strategy changed or unsatisfied with the results? Click 'Restart' to restart the papertrading.</Trans>
        )}
      </span>
      <RestartButton $disabled={isStep3Deploying} onClick={handleRestart}>
        {isLoading ? (
          <Pending />
        ) : strategyInfoTabIndex === 1 ? (
          <Trans>Regenerate</Trans>
        ) : strategyInfoTabIndex === 2 ? (
          <Trans>Restart</Trans>
        ) : (
          <Trans>Restart</Trans>
        )}
      </RestartButton>
    </RestartWrapper>
  )
})
