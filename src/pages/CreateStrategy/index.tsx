import styled from 'styled-components'
import Chat from './components/Chat'
import StrategyInfo from './components/StrategyInfo'
import { memo } from 'react'

const CreateStrategyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const LeftContent = styled.div`
  width: 400px;
  height: 100%;
  flex-shrink: 0;
  border-right: 1px solid ${({ theme }) => theme.black600};
`

const RightContent = styled.div`
  width: calc(100% - 400px);
  height: 100%;
  flex-shrink: 0;
`

export default memo(function CreateStrategy() {
  return (
    <CreateStrategyWrapper>
      <LeftContent>
        <Chat />
      </LeftContent>
      <RightContent>
        <StrategyInfo />
      </RightContent>
    </CreateStrategyWrapper>
  )
})
