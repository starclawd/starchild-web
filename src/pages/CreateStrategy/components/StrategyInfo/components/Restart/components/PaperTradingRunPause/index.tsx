import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { memo } from 'react'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import {
  useHandlePausePaperTrading,
  useHandleStartPaperTrading,
  useIsPausingPaperTrading,
  useIsStartingPaperTrading,
  usePaperTrading,
} from 'store/createstrategy/hooks/usePaperTrading'
import styled from 'styled-components'

const PaperTradingButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const RunPauseButton = styled(ButtonCommon)`
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.black700};
  width: fit-content;
  min-width: 70px;
  height: 32px;
  padding: 8px 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
`

export default memo(function PaperTradingRunPause() {
  const { strategyId } = useParsedQueryString()
  const { paperTradingCurrentData } = usePaperTrading({ strategyId: strategyId || '' })
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const handlePausePaperTrading = useHandlePausePaperTrading()
  const [isStartingPaperTrading] = useIsStartingPaperTrading()
  const [isPausingPaperTrading] = useIsPausingPaperTrading()
  const isStep3Deploying = useIsStep3Deploying()
  const isRunning = paperTradingCurrentData?.status === 'active'

  return (
    <PaperTradingButtonWrapper>
      <RunPauseButton
        $disabled={isStep3Deploying || isStartingPaperTrading || isPausingPaperTrading}
        onClick={isRunning ? handlePausePaperTrading : handleStartPaperTrading}
      >
        {isStartingPaperTrading || isPausingPaperTrading ? (
          <Pending />
        ) : isRunning ? (
          <>
            <IconBase className='icon-chat-stop-play' />
            <Trans>Pause</Trans>
          </>
        ) : (
          <>
            <IconBase className='icon-play' />
            <Trans>Run</Trans>
          </>
        )}
      </RunPauseButton>
    </PaperTradingButtonWrapper>
  )
})
