import styled from 'styled-components'
import ChatItem from '../ChatItem'

const ChatContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
`

export default function ChatContent() {
  return (
    <ChatContentWrapper>
      <ChatItem />
    </ChatContentWrapper>
  )
}
