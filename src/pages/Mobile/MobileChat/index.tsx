import styled from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useEffect, useState } from 'react'
import Chat from './components/Chat'
import BottomSheet from 'components/BottomSheet'
import {
  useCurrentAiContentDeepThinkData,
  useGetAiBotChatContents,
  useGetThreadsList,
  useHasLoadThreadsList,
  useIsShowDeepThink,
  useIsShowAgentDetail,
  useIsShowDeepThinkSources,
} from 'store/chat/hooks'
import { vm } from 'pages/helper'
import { useIsLogout, useUserInfo } from 'store/login/hooks'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import Pending from 'components/Pending'
import { Trans } from '@lingui/react/macro'
import DeepThinkDetail from 'pages/Chat/components/DeepThinkDetail'
import AgentDetail from 'pages/Chat/components/AgentDetail'

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
  const isLogout = useIsLogout()
  const [{ telegramUserId }] = useUserInfo()
  const [hasLoadThreadsList] = useHasLoadThreadsList()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [isShowDeepThinkSources] = useIsShowDeepThinkSources()
  const [, setIsShowAgentDetail] = useIsShowAgentDetail()
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const [{ agentId }] = useCurrentAiContentDeepThinkData()
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
            {agentId && !isShowDeepThinkSources ? <AgentDetail agentId={agentId} /> : <DeepThinkDetail />}
          </DeepThinkContent>
        )}
      </BottomSheet>
    </MobileChatWrapper>
  )
}
