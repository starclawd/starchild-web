import { memo, useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useGetLiveChat, useLiveChatList } from 'store/insights/hooks/useLiveChatHooks'
import Pending from 'components/Pending'
import ChatItem from './components/ChatItem'
import { vm } from 'pages/helper'

const LiveChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.bgL0};
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.textL2};
  max-width: 800px;
  height: 100%;
  gap: 40px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

const LiveChat = memo(() => {
  const [isLoading, setIsLoading] = useState(false)
  const [liveChatList] = useLiveChatList()
  const triggerGetLiveChat = useGetLiveChat()
  const getLiveChat = useCallback(async () => {
    try {
      setIsLoading(true)
      await triggerGetLiveChat()
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to get live chat:', error)
      setIsLoading(false)
    }
  }, [triggerGetLiveChat])

  useEffect(() => {
    getLiveChat()
  }, [getLiveChat])

  if (isLoading) {
    return (
      <LiveChatWrapper>
        <Pending isFetching={isLoading} />
      </LiveChatWrapper>
    )
  }
  return (
    <LiveChatWrapper>
      <Content className='scroll-style'>
        {liveChatList.map((item) => (
          <ChatItem key={item.msg_id} data={item} />
        ))}
      </Content>
    </LiveChatWrapper>
  )
})

LiveChat.displayName = 'LiveChat'

export default LiveChat
