import styled from 'styled-components'
import StrategyInfo from './components/StrategyInfo'

const SummaryWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default function Summary() {
  return (
    <SummaryWrapper>
      <StrategyInfo />
    </SummaryWrapper>
  )
}
