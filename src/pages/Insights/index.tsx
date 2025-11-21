import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import SystemSignalOverview from './components/Signals'
import LiveChat from './components/LiveChat'
import { useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'
import MoveTabList from 'components/MoveTabList'
import { vm } from 'pages/helper'
import { useCurrentLiveChatData, useIsExpandedLiveChat } from 'store/insights/hooks/useLiveChatHooks'
import { ANI_DURATION } from 'constants/index'
import ChatDetail from './components/LiveChat/components/ChatDetail'
import BottomSheet from 'components/BottomSheet'
import { useIsMobile } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'
import { useActiveTab } from 'store/insights/hooks'
import { INSIGHTS_ACTIVE_TAB } from 'store/insights/insights'

const InsightsWrapper = styled.div`
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

const TabWrapper = styled.div`
  margin: 0 auto;
  padding: 20px 0 12px;
  width: 800px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
      width: 100%;
    `}
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
  ${({ theme, $isExpandedLiveChat }) => theme.mediaMinWidth.minWidth1280`
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

const Insights = memo(() => {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useActiveTab()
  const [{ userInfoId }] = useUserInfo()
  const [isExpandedLiveChat, setIsExpandedLiveChat] = useIsExpandedLiveChat()
  const [, setCurrentLiveChatData] = useCurrentLiveChatData()

  const tabList = [
    {
      key: 0,
      text: <Trans>Signals</Trans>,
      clickCallback: () => setActiveTab(INSIGHTS_ACTIVE_TAB.SIGNALS),
    },
    {
      key: 1,
      text: <Trans>Live chat</Trans>,
      clickCallback: () => setActiveTab(INSIGHTS_ACTIVE_TAB.LIVECHAT),
    },
  ]

  const closeExpandedLiveChat = useCallback(() => {
    setIsExpandedLiveChat(false)
    setCurrentLiveChatData(null)
  }, [setIsExpandedLiveChat, setCurrentLiveChatData])

  return (
    <InsightsWrapper>
      <Empty />
      <InnerContent>
        <TabWrapper>
          <MoveTabList tabIndex={activeTab === INSIGHTS_ACTIVE_TAB.SIGNALS ? 0 : 1} tabList={tabList} />
        </TabWrapper>
        <ContentWrapper>
          {activeTab === INSIGHTS_ACTIVE_TAB.SIGNALS && <SystemSignalOverview />}
          {activeTab === INSIGHTS_ACTIVE_TAB.LIVECHAT && <LiveChat />}
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
    </InsightsWrapper>
  )
})

Insights.displayName = 'Insights'

export default Insights
