import { memo, useEffect } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useGetLiveChat } from 'store/insights/hooks/useLiveChatHooks'

const LiveChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.bgL0};
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: ${({ theme }) => theme.textL1};
  margin-bottom: 20px;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL2};
  font-size: 16px;
`

const LiveChat = memo(() => {
  const triggerGetLiveChat = useGetLiveChat()
  useEffect(() => {
    triggerGetLiveChat()
  }, [triggerGetLiveChat])
  return (
    <LiveChatWrapper>
      <Title>
        <Trans>Live Chat</Trans>
      </Title>
      <Content>
        <Trans>Live Chat content coming soon...</Trans>
      </Content>
    </LiveChatWrapper>
  )
})

LiveChat.displayName = 'LiveChat'

export default LiveChat
