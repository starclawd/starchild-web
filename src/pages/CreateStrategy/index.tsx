import styled from 'styled-components'
import ChatContent from './components/ChatContent'
import StrategyInfo from './components/StrategyInfo'

const CreateStrategyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const LeftContent = styled.div`
  width: 35%;
  height: 100%;
  flex-shrink: 0;
  background: ${({ theme }) => theme.black900};
`

const RightContent = styled.div`
  width: 65%;
  height: 100%;
  flex-shrink: 0;
  background: ${({ theme }) => theme.black1000};
`

export default function CreateStrategy() {
  return (
    <CreateStrategyWrapper>
      <LeftContent>
        <ChatContent />
      </LeftContent>
      <RightContent>
        <StrategyInfo />
      </RightContent>
    </CreateStrategyWrapper>
  )
}
