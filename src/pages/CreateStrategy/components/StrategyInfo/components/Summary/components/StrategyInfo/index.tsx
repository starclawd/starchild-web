import styled from 'styled-components'
import Layer from '../Layer'
import { Trans } from '@lingui/react/macro'

const StrategyInfoWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default function StrategyInfo() {
  return (
    <StrategyInfoWrapper>
      <Layer iconCls='icon-chat-other' title={<Trans>Strategy info</Trans>} isLoading={false}>
        Data Sources
      </Layer>
    </StrategyInfoWrapper>
  )
}
