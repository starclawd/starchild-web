import styled, { css } from 'styled-components'
import FileDrag from './components/FileDrag'
import { ANI_DURATION } from 'constants/index'
import { useCurrentAiThreadId, useShowHistory } from 'store/chatcache/hooks'
import {
  useCurrentAiContentDeepThinkData,
  useHasLoadThreadsList,
  useIsShowDeepThink,
  useIsChatPageLoaded,
  useIsShowAgentDetail,
  useIsOpenFullScreen,
  useCurrentFullScreenBacktestData,
  useIsShowDeepThinkSources,
} from 'store/chat/hooks'
import { useEffect, useMemo } from 'react'
import Pending from 'components/Pending'
import { useIsLogout } from 'store/login/hooks'
import DeepThinkDetail from './components/DeepThinkDetail'
import AgentDetail from './components/AgentDetail'
import { AGENT_TYPE } from 'store/agentdetail/agentdetail'
import { useAgentDetailData } from 'store/agentdetail/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'

// 扩展window对象类型
declare global {
  interface Window {
    checkChatPageLoaded?: () => boolean
  }
}

const ChatWrapper = styled.div<{
  $showHistory: boolean
}>`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  ${({ theme, $showHistory }) => theme.mediaMinWidth.minWidth1024`
    #aiScrollContent,
    #aiInputOutWrapper,
    #recommendationsWrapper {
      width: 100%;
      max-width: 778px;
      min-width: 0;
      flex-shrink: 1;
      transition: max-width 0.2s;
    }
    ${
      !$showHistory &&
      css`
        .left-content {
          max-width: 182px;
        }
      `
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    #aiScrollContent,
    #aiInputOutWrapper,
    #recommendationsWrapper {
      width: 100%;
      max-width: 778px;
      min-width: 0;
      flex-shrink: 1;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    #aiScrollContent,
    #aiInputOutWrapper,
    #recommendationsWrapper {
      width: 780px;
    }
  `}
`

const BackTestWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: ${({ theme }) => theme.bgL0};
  .backtest-content {
    padding-top: 20px;
  }
`

const LeftContent = styled.div`
  visibility: hidden;
  width: 0px;
  height: 100%;
`

const ChatContent = styled.div<{ $showHistory: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  /* padding: 0 20px; */
  ${({ $showHistory }) =>
    !$showHistory &&
    css`
      margin-left: 0 !important;
    `}
`

const Empty = styled.div`
  display: flex;
  visibility: hidden;
  width: 0;
  height: 100%;
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    display: none;
  `}
`

const DeepThinkContent = styled.div<{ $isShowRightContent: boolean; $shouldExpandRightSection: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  gap: 20px;
  flex-shrink: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.black1000};
  z-index: 2;
  ${({ $isShowRightContent, $shouldExpandRightSection }) => css`
    width: ${$shouldExpandRightSection ? '640px' : '500px'};
    right: ${$shouldExpandRightSection ? '-640px' : '-500px'};
    transition: transform ${ANI_DURATION}s;
    ${$isShowRightContent &&
    css`
      transform: translateX(-100%);
    `}
  `}
  ${({ theme, $isShowRightContent, $shouldExpandRightSection }) => theme.mediaMinWidth.minWidth1280`
    position: unset;
    transform: unset;
    transition: width ${ANI_DURATION}s;
    overflow: hidden;
    width: 0;
    ${
      $isShowRightContent &&
      css`
        width: ${!$shouldExpandRightSection ? '35%' : '65%'};
      `
    }
  `}
`

export default function Chat() {
  const isLogout = useIsLogout()
  const [agentDetailData] = useAgentDetailData()
  const [, setIsChatPageLoaded] = useIsChatPageLoaded()
  const [hasLoadThreadsList] = useHasLoadThreadsList()
  const [isShowDeepThink] = useIsShowDeepThink()
  const [isShowAgentDetail] = useIsShowAgentDetail()
  const [showHistory, setShowHistory] = useShowHistory()
  const [isOpenFullScreen] = useIsOpenFullScreen()
  const [isShowDeepThinkSources] = useIsShowDeepThinkSources()
  const [currentFullScreenBacktestData] = useCurrentFullScreenBacktestData()
  const [{ agentId }] = useCurrentAiContentDeepThinkData()
  const { threadId } = useParsedQueryString()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [, setCurrentRouter] = useCurrentRouter()

  const isShowRightContent = useMemo(() => {
    return isShowDeepThink || isShowAgentDetail
  }, [isShowDeepThink, isShowAgentDetail])

  const shouldExpandRightSection = useMemo(() => {
    return !!(agentDetailData.task_type === AGENT_TYPE.BACKTEST_TASK && agentId)
  }, [agentId, agentDetailData.task_type])

  useEffect(() => {
    setIsChatPageLoaded(hasLoadThreadsList || isLogout)
  }, [hasLoadThreadsList, isLogout, setIsChatPageLoaded])

  useEffect(() => {
    if (threadId) {
      setCurrentAiThreadId(threadId)
      setCurrentRouter(ROUTER.CHAT)
    }
  }, [threadId, setCurrentRouter, setCurrentAiThreadId])

  return (
    <ChatWrapper $showHistory={showHistory}>
      <LeftContent />
      <ChatContent $showHistory={showHistory} className='right-content'>
        {hasLoadThreadsList || isLogout ? <FileDrag /> : <Pending isFetching />}
      </ChatContent>
      <Empty />
      <DeepThinkContent $shouldExpandRightSection={shouldExpandRightSection} $isShowRightContent={isShowRightContent}>
        {isShowDeepThink &&
          (agentId && !isShowDeepThinkSources ? <AgentDetail agentId={agentId} /> : <DeepThinkDetail />)}
      </DeepThinkContent>
      {isOpenFullScreen && currentFullScreenBacktestData && (
        <BackTestWrapper>
          {/* <Content isLoading={false} showFullScreen={true} backtestData={currentFullScreenBacktestData} /> */}
        </BackTestWrapper>
      )}
    </ChatWrapper>
  )
}
