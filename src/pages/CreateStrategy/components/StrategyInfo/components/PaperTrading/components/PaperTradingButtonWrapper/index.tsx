import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback } from 'react'
import { IconBase } from 'components/Icons'
import { ButtonCommon } from 'components/Button'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import { useHandleStartPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { useIsShowExpandPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import PaperTradingRunPause from '../PaperTradingTabs/components/PaperTradingRunPause'

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0;
`

const RestartButton = styled(ButtonCommon)`
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
  color: ${({ theme }) => theme.black200};
  background: ${({ theme }) => theme.black900};
  gap: 4px;

  .icon-arrow-loading {
    font-size: 18px;
    color: ${({ theme }) => theme.black200};
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.black800};
  }
`

const ZoomButton = styled(ButtonCommon)`
  width: 38px;
  height: 100%;
  padding: 0;
  border-radius: 0;
  border-top: none;
  border-left: 1px solid ${({ theme }) => theme.black600};
  color: ${({ theme }) => theme.black200};
  background: ${({ theme }) => theme.black900};
  display: flex;
  align-items: center;
  justify-content: center;

  .icon-zoom-in,
  .icon-zoom-out {
    font-size: 18px;
    color: ${({ theme }) => theme.black200};
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.black800};
  }
`

export default memo(function PaperTradingButtonWrapper() {
  const { strategyId } = useParsedQueryString()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')
  const [isShowExpandPaperTrading, setIsShowExpandPaperTrading] = useIsShowExpandPaperTrading()

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
      <PaperTradingRunPause />
      <RestartButton $disabled={isStep3Deploying} onClick={handleRestart}>
        <IconBase className='icon-arrow-loading' />
        <Trans>Restart</Trans>
      </RestartButton>
      <ZoomButton $disabled={isStep3Deploying} onClick={handleZoom}>
        <IconBase className={isShowExpandPaperTrading ? 'icon-zoom-out' : 'icon-zoom-in'} />
      </ZoomButton>
    </ButtonWrapper>
  )
})
