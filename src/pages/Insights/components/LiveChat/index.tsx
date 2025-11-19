import { memo, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import {
  useCurrentLiveChatData,
  useGetLiveChat,
  useIsExpandedLiveChat,
  useLiveChatList,
} from 'store/insights/hooks/useLiveChatHooks'
import Pending from 'components/Pending'
import ChatItem from './components/ChatItem'
import { vm } from 'pages/helper'
import { useInsightsSubscription } from 'store/insights/hooks'
import { LIVE_CHAT_SUB_ID, LIVE_CHAT_UNSUB_ID } from 'store/websocket/websocket'

const LiveChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.black900};
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.textL2};
  width: 100%;
  height: 100%;
  padding: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
    `}
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  gap: 24px;
  padding-bottom: 80px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(24)};
      padding-bottom: ${vm(80)};
    `}
`

const LiveChat = memo(() => {
  const [isLoading, setIsLoading] = useState(true)
  const [liveChatList] = useLiveChatList()
  const triggerGetLiveChat = useGetLiveChat()
  const { subscribe, isOpen, unsubscribe } = useInsightsSubscription({ handleMessage: false })
  const contentRef = useRef<HTMLDivElement>(null)
  const prevLengthRef = useRef(0)
  const [, changeIsExpandedLiveChat] = useIsExpandedLiveChat()
  const [, changeCurrentLiveChatData] = useCurrentLiveChatData()

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

  useEffect(() => {
    if (isOpen && !isLoading) {
      subscribe('live-chat-notification', LIVE_CHAT_SUB_ID)
    }
    return () => {
      unsubscribe('live-chat-notification', LIVE_CHAT_UNSUB_ID)
    }
  }, [subscribe, unsubscribe, isOpen, isLoading])

  // 监听 liveChatList 数量变化，自动滚动到底部
  useEffect(() => {
    if (!contentRef.current || isLoading) return

    const element = contentRef.current
    const scrollHeight = element.scrollHeight
    const scrollTop = element.scrollTop
    const clientHeight = element.clientHeight
    const distanceToBottom = scrollHeight - scrollTop - clientHeight
    const prevLength = prevLengthRef.current
    const currentLength = liveChatList.length

    // 初始化时（从0到有值），直接滚动到底部（无动画）
    if (prevLength === 0 && currentLength > 0) {
      element.scrollTo({
        top: scrollHeight,
        behavior: 'auto',
      })
    }
    // 其他情况：如果距离底部小于 100px，则平滑滚动到底部
    else if (distanceToBottom < 100) {
      element.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      })
    }

    // 更新之前的长度
    prevLengthRef.current = currentLength
  }, [liveChatList.length, isLoading])

  useEffect(() => {
    return () => {
      changeIsExpandedLiveChat(false)
      changeCurrentLiveChatData(null)
    }
  }, [changeIsExpandedLiveChat, changeCurrentLiveChatData])

  if (isLoading) {
    return (
      <LiveChatWrapper>
        <Pending isFetching={isLoading} />
      </LiveChatWrapper>
    )
  }
  return (
    <LiveChatWrapper>
      <Content ref={contentRef} className='scroll-style'>
        <InnerContent>
          {liveChatList.map((item) => (
            <ChatItem key={item.msg_id} data={item} />
          ))}
        </InnerContent>
      </Content>
    </LiveChatWrapper>
  )
})

LiveChat.displayName = 'LiveChat'

export default LiveChat
