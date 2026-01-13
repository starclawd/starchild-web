import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import LiveChat from './components/LiveChat'
import { useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'
import { vm } from 'pages/helper'
import { useCurrentLiveChatData, useIsExpandedLiveChat } from 'store/insights/hooks/useLiveChatHooks'
import { ANI_DURATION } from 'constants/index'
import ChatDetail from './components/LiveChat/components/ChatDetail'
import BottomSheet from 'components/BottomSheet'
import { useIsMobile } from 'store/application/hooks'

const LiveChatPageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.black900};
`

const Empty = styled.div`
  display: flex;
  visibility: hidden;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`

const LiveChatDetailWrapper = styled.div<{ $isExpandedLiveChat: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.black1000};
  height: 100%;
  width: 0;
  transition: width ${ANI_DURATION}s;
  ${({ $isExpandedLiveChat }) => css`
    position: absolute;
    width: 500px;
    right: -500px;
    transition: transform ${ANI_DURATION}s;
    ${$isExpandedLiveChat &&
    css`
      transform: translateX(-100%);
    `}
  `}
  ${({ theme, $isExpandedLiveChat }) => theme.mediaMinWidth.width1280`
    position: unset;
    transform: unset;
    transition: width ${ANI_DURATION}s;
    overflow: hidden;
    width: 0;
    ${
      $isExpandedLiveChat &&
      css`
        width: 35%;
      `
    }
  `}
`

const LiveChatPage = memo(() => {
  const isMobile = useIsMobile()
  const [{ userInfoId }] = useUserInfo()
  const [isExpandedLiveChat, setIsExpandedLiveChat] = useIsExpandedLiveChat()
  const [, setCurrentLiveChatData] = useCurrentLiveChatData()

  const closeExpandedLiveChat = useCallback(() => {
    setIsExpandedLiveChat(false)
    setCurrentLiveChatData(null)
  }, [setIsExpandedLiveChat, setCurrentLiveChatData])

  if (!userInfoId) {
    return (
      <LiveChatPageWrapper>
        <Pending isNotButtonLoading />
      </LiveChatPageWrapper>
    )
  }

  return (
    <LiveChatPageWrapper>
      <Empty />
      <InnerContent>
        <ContentWrapper>
          <LiveChat />
        </ContentWrapper>
      </InnerContent>
      {!isMobile && (
        <LiveChatDetailWrapper $isExpandedLiveChat={isExpandedLiveChat}>
          <ChatDetail />
        </LiveChatDetailWrapper>
      )}
      {isMobile && (
        <BottomSheet
          hideDragHandle
          hideClose={false}
          isOpen={isExpandedLiveChat}
          rootStyle={{ overflowY: 'hidden', height: `calc(100vh - ${vm(44)})` }}
          onClose={closeExpandedLiveChat}
        >
          <ChatDetail />
        </BottomSheet>
      )}
    </LiveChatPageWrapper>
  )
})

LiveChatPage.displayName = 'LiveChatPage'

export default LiveChatPage
