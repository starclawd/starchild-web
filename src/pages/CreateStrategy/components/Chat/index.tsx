import styled from 'styled-components'
import ChatHeader from './components/ChatHeader'
import ChatContent from './components/ChatContent'
import ChatInput from './components/ChatInput'
import { memo } from 'react'

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export default memo(function Chat() {
  return (
    <ChatWrapper>
      <ChatHeader />
      <ChatContent />
      <ChatInput />
    </ChatWrapper>
  )
})
