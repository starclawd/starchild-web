import styled from 'styled-components'
import Strategies from './components/Strategies'

const StrategyListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`

export default function StrategyList() {
  return (
    <StrategyListWrapper>
      <Strategies />
    </StrategyListWrapper>
  )
}
