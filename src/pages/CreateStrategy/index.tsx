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
