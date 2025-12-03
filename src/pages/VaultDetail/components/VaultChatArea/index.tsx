import { memo } from 'react'
import styled from 'styled-components'
import ChainOfThought from './components/ChainOfThought'
import MarketItem from './components/MarketItem'
import SignalAlertItem from './components/SignalAlertItem'
const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 40px 20px;
`

const VaultChatArea = memo(() => {
  return (
    <ChatAreaContainer>
      <ChatContent>
        <ChainOfThought />
        <MarketItem />
        <SignalAlertItem />
      </ChatContent>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea
