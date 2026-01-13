import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { IconBase } from 'components/Icons'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import { useHandleStartPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { useIsShowExpandPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import PaperTradingRunPause from '../PaperTradingNormal/components/PaperTradingRunPause'
import { useWindowSize } from 'hooks/useWindowSize'
import { MEDIA_WIDTHS } from 'theme/styled'
import { useIsShowExpandCode } from 'store/createstrategy/hooks/useCode'

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0;
`

const RestartButton = styled(ButtonBorder)`
  width: fit-content;
  height: 100%;
  border: none;
`

const ZoomButton = styled(ButtonBorder)`
  width: 38px;
  height: 100%;
  border: none;
`

export default memo(function PaperTradingButtonWrapper() {
  const { strategyId } = useParsedQueryString()
  const { width } = useWindowSize()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const [isShowExpandPaperTrading, setIsShowExpandPaperTrading] = useIsShowExpandPaperTrading()

  const isShowText = useMemo(() => {
    return !(!isShowExpandPaperTrading && Number(width) < MEDIA_WIDTHS.width1600)
  }, [isShowExpandPaperTrading, width])

  const handleRestart = useCallback(() => {
    if (isStep3Deploying) {
      return
    }
    handleStartPaperTrading()
  }, [handleStartPaperTrading, isStep3Deploying])

  const handleZoom = useCallback(() => {
    setIsShowExpandPaperTrading(!isShowExpandPaperTrading)
  }, [isShowExpandPaperTrading, setIsShowExpandPaperTrading])

  return (
    <ButtonWrapper>
      <PaperTradingRunPause isShowText={isShowText} />
      <RestartButton $disabled={isStep3Deploying} onClick={handleRestart}>
        <IconBase className='icon-arrow-loading' />
        {isShowText && <Trans>Restart</Trans>}
      </RestartButton>
      <ZoomButton onClick={handleZoom}>
        <IconBase className={isShowExpandPaperTrading ? 'icon-zoom-out' : 'icon-zoom-in'} />
      </ZoomButton>
    </ButtonWrapper>
  )
})
