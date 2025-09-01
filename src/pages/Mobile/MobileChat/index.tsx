import styled, { css } from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Chat from './components/Chat'
import BottomSheet from 'components/BottomSheet'
import { useTheme } from 'store/themecache/hooks'
import {
  useCurrentAiContentDeepThinkData,
  useGetAiBotChatContents,
  useGetThreadsList,
  useHasLoadThreadsList,
  useIsShowDeepThink,
  useIsShowAgentDetail,
} from 'store/chat/hooks'
import { vm } from 'pages/helper'
import { useIsLogout, useUserInfo } from 'store/login/hooks'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import Pending from 'components/Pending'
import TaskItem from 'pages/MyAgent/components/AgentItem'
import { Trans } from '@lingui/react/macro'
import AgentOperator from 'pages/MyAgent/components/AgentOperator'
import DeepThinkDetail from 'pages/Chat/components/DeepThinkDetail'
import Highlights from 'pages/Chat/components/Highlights'

const MobileChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`

const DeepThinkContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 ${vm(12)} ${vm(12)};
  background-color: ${({ theme }) => theme.black700};
  .deep-think-inner-content {
    height: calc(100% - ${vm(56)});
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: ${vm(56)};
  margin-bottom: ${vm(12)};
  padding: ${vm(20)} ${vm(8)} ${vm(8)};
  font-size: 0.2rem;
  font-weight: 500;
  line-height: 0.28rem;
  color: ${({ theme }) => theme.textL1};
`

export default function MobileChat() {
  const theme = useTheme()
  const isLogout = useIsLogout()
  const [{ telegramUserId }] = useUserInfo()
  const [tabIndex, setTabIndex] = useState(0)
  const [hasLoadThreadsList] = useHasLoadThreadsList()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [isShowAgentDetail, setIsShowAgentDetail] = useIsShowAgentDetail()
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const [{ sourceListDetails, taskId, backtestData }] = useCurrentAiContentDeepThinkData()
  const isShowBottomSheet = useMemo(() => {
    return isShowDeepThink || isShowAgentDetail
  }, [isShowDeepThink, isShowAgentDetail])
  const changeTabIndex = useCallback(
    (index: number) => {
      return () => {
        setTabIndex(index)
      }
    },
    [setTabIndex],
  )

  const tabList = useMemo(() => {
    const sourceListLength = sourceListDetails.length
    return [
      {
        key: 0,
        text: <Trans>Activity</Trans>,
        clickCallback: changeTabIndex(0),
      },
      {
        key: 1,
        text: <Trans>{sourceListLength} sources</Trans>,
        clickCallback: changeTabIndex(1),
      },
    ]
  }, [sourceListDetails.length, changeTabIndex])
  const closeDeepThink = useCallback(() => {
    setIsShowDeepThink(false)
    setIsShowAgentDetail(false)
  }, [setIsShowDeepThink, setIsShowAgentDetail])
  const onRefresh = useCallback(async () => {
    try {
      setIsPullDownRefreshing(true)
      if (telegramUserId) {
        await triggerGetAiBotChatThreads({
          telegramUserId,
        })
      }
      if (currentAiThreadId && telegramUserId) {
        await triggerGetAiBotChatContents({
          threadId: currentAiThreadId,
          telegramUserId,
        })
      }
      setTimeout(() => {
        setIsPullDownRefreshing(false)
      }, 1000)
    } catch (error) {
      setIsPullDownRefreshing(false)
    }
  }, [triggerGetAiBotChatThreads, telegramUserId, currentAiThreadId, triggerGetAiBotChatContents])

  useEffect(() => {
    if (telegramUserId) {
      triggerGetAiBotChatThreads({
        telegramUserId,
      })
    }
  }, [triggerGetAiBotChatThreads, telegramUserId])
  return (
    <MobileChatWrapper>
      <PullDownRefresh
        onRefresh={onRefresh}
        isRefreshing={isPullDownRefreshing}
        setIsRefreshing={setIsPullDownRefreshing}
        scrollContainerId='#aiContentInnerEl'
      >
        {/* <PullUpRefresh
        disabledPull={true}
        onRefresh={onRefresh}
        isRefreshing={false}
        setIsRefreshing={setIsPullDownRefreshing}
      >
      </PullUpRefresh> */}
        <ContentWrapper>{hasLoadThreadsList || isLogout ? <Chat /> : <Pending isFetching />}</ContentWrapper>
      </PullDownRefresh>
      <BottomSheet
        hideDragHandle
        hideClose={false}
        isOpen={isShowDeepThink}
        rootStyle={{ overflowY: 'hidden', height: `calc(100vh - ${vm(44)})` }}
        onClose={closeDeepThink}
      >
        {isShowDeepThink && (
          <DeepThinkContent>
            <Header>
              <Trans>Thinking</Trans>
            </Header>
            {taskId ? <Highlights isMobileChatPage backtestData={backtestData} /> : <DeepThinkDetail />}
          </DeepThinkContent>
        )}
      </BottomSheet>
    </MobileChatWrapper>
  )
}
