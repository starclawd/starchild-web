import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
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
} from 'store/createstrategy/hooks/usePaperTrading'
import styled from 'styled-components'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'

const RunPauseButton = styled(ButtonBorder)`
  width: fit-content;
  min-width: 80px;
  height: 100%;
  border: none;
`

export default memo(function PaperTradingRunPause() {
  const { strategyId } = useParsedQueryString()
  const { paperTradingPublicData } = usePaperTradingPublic({ strategyId: strategyId || '' })
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const handlePausePaperTrading = useHandlePausePaperTrading()
  const [isStartingPaperTrading] = useIsStartingPaperTrading()
  const [isPausingPaperTrading] = useIsPausingPaperTrading()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const isRunning = paperTradingPublicData?.status === PAPER_TRADING_STATUS.RUNNING
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
