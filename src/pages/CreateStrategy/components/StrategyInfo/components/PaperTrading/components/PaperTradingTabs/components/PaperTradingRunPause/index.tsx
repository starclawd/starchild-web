import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { memo } from 'react'
import { PAPER_TRADING_STATUS } from 'store/createstrategy/createstrategy'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import {
  useHandlePausePaperTrading,
  useHandleStartPaperTrading,
  useIsPausingPaperTrading,
  useIsStartingPaperTrading,
  usePaperTrading,
} from 'store/createstrategy/hooks/usePaperTrading'
import styled from 'styled-components'

const RunPauseButton = styled(ButtonCommon)`
  width: fit-content;
  min-width: 80px;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding: 0 12px;
  border-radius: 0;
  border-top: none;
  border-left: 1px solid ${({ theme }) => theme.black600};
  color: ${({ theme }) => theme.textL3};
  background: ${({ theme }) => theme.black900};
  gap: 4px;

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.black800};
  }
`

export default memo(function PaperTradingRunPause() {
  const { strategyId } = useParsedQueryString()
  const { paperTradingCurrentData } = usePaperTrading({ strategyId: strategyId || '' })
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const handlePausePaperTrading = useHandlePausePaperTrading()
  const [isStartingPaperTrading] = useIsStartingPaperTrading()
  const [isPausingPaperTrading] = useIsPausingPaperTrading()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const isRunning = paperTradingCurrentData?.status === PAPER_TRADING_STATUS.RUNNING
  const isDisabled = isStep3Deploying || isStartingPaperTrading || isPausingPaperTrading

  const handleClick = () => {
    if (isDisabled) return
    if (isRunning) {
      handlePausePaperTrading()
    } else {
      handleStartPaperTrading()
    }
  }

  return (
    <RunPauseButton $disabled={isDisabled} onClick={handleClick}>
      {isStartingPaperTrading || isPausingPaperTrading ? (
        <Pending />
      ) : isRunning ? (
        <>
          <IconBase className='icon-pause' />
          <Trans>Pause</Trans>
        </>
      ) : (
        <>
          <IconBase className='icon-play' />
          <Trans>Run</Trans>
        </>
      )}
    </RunPauseButton>
  )
})
