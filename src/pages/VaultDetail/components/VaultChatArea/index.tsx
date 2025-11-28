import { memo } from 'react'
import styled from 'styled-components'
const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`

const VaultChatArea = memo(() => {
  return (
    <ChatAreaContainer>
      <ChatContent></ChatContent>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea
