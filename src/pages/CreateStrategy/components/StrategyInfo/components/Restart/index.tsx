import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { memo, useCallback } from 'react'
import { useHandleRunBacktest } from 'store/createstrategy/hooks/useBacktest'
import { useHandleGenerateCode } from 'store/createstrategy/hooks/useCode'
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
  width: 100%;
  height: 60px;
  background: rgba(0, 0, 0, 0.64);
  backdrop-filter: blur(4px);
`

const RestartButton = styled(ButtonCommon)`
  width: fit-content;
  height: 36px;
  padding: 8px 16px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

export default memo(function Restart() {
  const isShowRestart = useIsShowRestart()
  const [strategyInfoTabIndex] = useStrategyInfoTabIndex()
  const handleGenerateCode = useHandleGenerateCode()
  const handleRunBacktest = useHandleRunBacktest()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const handleRestart = useCallback(() => {
    if (strategyInfoTabIndex === 1) {
      handleGenerateCode()
    } else if (strategyInfoTabIndex === 2) {
      handleRunBacktest()
    } else if (strategyInfoTabIndex === 3) {
      handleStartPaperTrading()
    }
  }, [strategyInfoTabIndex, handleGenerateCode, handleRunBacktest, handleStartPaperTrading])
  if (!isShowRestart) return null
  return (
    <RestartWrapper>
      <span>
        <Trans>Strategy changed or unsatisfied with the results? Click 'Restart' to restart the backtest.</Trans>
      </span>
      <RestartButton onClick={handleRestart}>
        {strategyInfoTabIndex === 1 ? <Trans>Regenerate</Trans> : <Trans>Restart</Trans>}
      </RestartButton>
    </RestartWrapper>
  )
})
