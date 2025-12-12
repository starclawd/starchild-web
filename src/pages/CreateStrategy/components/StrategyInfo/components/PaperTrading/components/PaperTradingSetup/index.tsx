import styled from 'styled-components'
import ActionLayer from '../../../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'

const SetupWrapper = styled.div`
  display: flex;
  width: 100%;
`

interface PaperTradingSetupProps {
  onRunPaperTrading: () => void
}

const PaperTradingSetup = memo(({ onRunPaperTrading }: PaperTradingSetupProps) => {
  const codeGenerated = true // FIXME: 需要从后端获取

  return (
    <SetupWrapper>
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
        rightButtonClickCallback={onRunPaperTrading}
        rightButtonDisabled={!codeGenerated}
      />
    </SetupWrapper>
  )
})

PaperTradingSetup.displayName = 'PaperTradingSetup'

export default PaperTradingSetup
