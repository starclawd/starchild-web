import styled from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback } from 'react'

const BacktestWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default memo(function Backtest() {
  const codeGenerated = false
  const handleRunBacktest = useCallback(async () => {
    console.log('handleRunBacktest')
  }, [])
  return (
    <BacktestWrapper>
      <ActionLayer
        iconCls='icon-view-code'
        title={<Trans>Run Backtest</Trans>}
        description={
          codeGenerated ? (
            <Trans>Click [**Run Backtest]** to see how your strategy would have performed on historical data.</Trans>
          ) : (
            <Trans>Strategy Not Defined. Please describe and confirm your strategy logic first.</Trans>
          )
        }
        rightText={<Trans>Run Backtest</Trans>}
        rightButtonClickCallback={handleRunBacktest}
        rightButtonDisabled={!codeGenerated}
      />
    </BacktestWrapper>
  )
})
