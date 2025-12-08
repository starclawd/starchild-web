import styled from 'styled-components'
import ChatHeader from './components/ChatHeader'
import ChatItem from './components/ChatItem'
import ChatInput from './components/ChatInput'

const ChatContentWrapper = styled.div`
  display: flex;
  width: 100%;
`

export default function ChatContent() {
  return (
    <ChatContentWrapper>
      <ChatHeader />
      <ChatItem />
      <ChatInput />
    </ChatContentWrapper>
  )
}
