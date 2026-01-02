import styled from 'styled-components'
import ActionLayer from '../../../ActionLayer'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'
import { useStrategyCode } from 'store/createstrategy/hooks/useCode'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { GENERATION_STATUS } from 'store/createstrategy/createstrategy'

const SetupWrapper = styled.div`
  display: flex;
  width: 100%;
`

interface PaperTradingSetupProps {
  onRunPaperTrading: () => void
  isLoading?: boolean
}

const PaperTradingSetup = memo(({ onRunPaperTrading, isLoading }: PaperTradingSetupProps) => {
  const { strategyId } = useParsedQueryString()
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const codeGenerated = strategyCode?.generation_status === GENERATION_STATUS.COMPLETED

  return <SetupWrapper></SetupWrapper>
})

PaperTradingSetup.displayName = 'PaperTradingSetup'

export default PaperTradingSetup
