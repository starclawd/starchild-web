import styled from 'styled-components'
import ActionLayer from '../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { useCallback } from 'react'

const PaperTradingWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default function PaperTrading() {
  const codeGenerated = false
  const handleRunPaperTrading = useCallback(async () => {
    console.log('handleRunPaperTrading')
  }, [])

  return (
    <PaperTradingWrapper>
      <ActionLayer
        iconCls='icon-view-code'
        title={<Trans>Run Paper Trading</Trans>}
        description={
          codeGenerated ? (
            <Trans>Click Run Paper Trading Simulation in real-time with virtual funds.</Trans>
          ) : (
            <Trans>Strategy Not Defined. Please describe and confirm your strategy logic first.</Trans>
          )
        }
        rightText={<Trans>Paper trading</Trans>}
        rightButtonClickCallback={handleRunPaperTrading}
        rightButtonDisabled={!codeGenerated}
      />
    </PaperTradingWrapper>
  )
}
