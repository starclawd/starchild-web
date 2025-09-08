import styled, { css } from 'styled-components'
import FileDrag from './components/FileDrag'
import { ANI_DURATION } from 'constants/index'
import { useShowHistory } from 'store/chatcache/hooks'
import {
  useAddNewThread,
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
import { useCurrentRouter } from 'store/application/hooks'
import usePrevious from 'hooks/usePrevious'
import { ROUTER } from 'pages/router'
import DeepThinkDetail from './components/DeepThinkDetail'
import AgentDetail from './components/AgentDetail'
import { AGENT_TYPE } from 'store/agentdetail/agentdetail'
import { useAgentDetailData } from 'store/agentdetail/hooks'

// 扩展window对象类型
declare global {
  interface Window {
    checkChatPageLoaded?: () => boolean
  }
}

const ChatWrapper = styled.div<{ $showHistory: boolean; $isShowRightContent: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  ${({ theme, $showHistory }) => theme.mediaMinWidth.minWidth1024`
    .right-content {
      width: 778px;
      max-width: 778px;
      min-width: 600px;
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
    .right-content {
      width: 778px;
      max-width: 778px;
      min-width: 440px;
      flex-shrink: 1;
    }
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1920`
    .right-content {
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
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  padding: 0 20px;
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
  right: -35%;
  gap: 20px;
  flex-shrink: 0;
  width: ${({ $shouldExpandRightSection }) => (!$shouldExpandRightSection ? '35%' : '65%')};
  height: 100%;
  background-color: ${({ theme }) => theme.black1000};
  z-index: 2;
  ${({ theme, $isShowRightContent, $shouldExpandRightSection }) => theme.mediaMinWidth.minWidth1024`
    transition: transform ${ANI_DURATION}s;
    ${
      $isShowRightContent &&
      css`
        right: ${!$shouldExpandRightSection ? '-35%' : '-65%'};
        transform: translateX(-100%);
      `
    }
  `}
  ${({ theme, $isShowRightContent }) => theme.mediaMinWidth.minWidth1280`
    position: unset;
    transform: unset;
    transition: width ${ANI_DURATION}s;
    overflow: hidden;
    ${
      !$isShowRightContent &&
      css`
        width: 0;
        border: none;
      `
    }
  `}
`

export default function Chat() {
  const [currentRouter] = useCurrentRouter()
  const preCurrentRouter = usePrevious(currentRouter)
  const isLogout = useIsLogout()
  const addNewThread = useAddNewThread()
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
    return () => {
      if (preCurrentRouter === ROUTER.CHAT && currentRouter !== ROUTER.CHAT) {
        // setIsFromTaskPage(false)
      }
    }
  }, [preCurrentRouter, currentRouter])

  return (
    <ChatWrapper $showHistory={showHistory} $isShowRightContent={isShowRightContent}>
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
