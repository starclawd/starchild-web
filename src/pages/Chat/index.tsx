import styled, { css } from 'styled-components'
import AiThreadsList from './components/AiThreadsList'
import FileDrag from './components/FileDrag'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
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
} from 'store/chat/hooks'
import { useEffect, useMemo } from 'react'
import Pending from 'components/Pending'
import { useIsLogout } from 'store/login/hooks'
import { useCurrentRouter } from 'store/application/hooks'
import usePrevious from 'hooks/usePrevious'
import { ROUTER } from 'pages/router'
import TaskItem from 'pages/MyAgent/components/AgentItem'
import AgentOperator from 'pages/MyAgent/components/AgentOperator'
import DeepThinkDetail from './components/DeepThinkDetail'
import Highlights from './components/Highlights'

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

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
`

const HistoryButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 8px;
  width: fit-content;
  height: 100%;
  padding: 0 18px;
  border-radius: 44px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  cursor: pointer;
  z-index: 1;
  .icon-chat-history {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
  }
  span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
`

const NewThread = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.bgT30};
  cursor: pointer;
  .icon-chat-new {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
  }
`

const LeftContent = styled.div`
  visibility: hidden;
  width: 0px;
  height: 100%;
`

const RightContent = styled.div<{ $showHistory: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width ${ANI_DURATION}s;
  will-change: width;
  padding-right: 20px;
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

const DeepThinkContent = styled.div<{ $isShowRightContent: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -600px;
  gap: 20px;
  flex-shrink: 0;
  width: 600px;
  height: 100%;
  background-color: ${({ theme }) => theme.black1000};
  z-index: 2;
  ${({ theme, $isShowRightContent }) => theme.mediaMinWidth.minWidth1024`
    transition: transform ${ANI_DURATION}s;
    ${
      $isShowRightContent &&
      css`
        right: -600px;
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

const DeepThinkInnerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  width: 360px;
  height: 100%;
  padding: 16px;
  .think-list-wrapper {
    height: calc(100% - 64px);
  }
  .sources-wrapper {
    height: calc(100% - 64px);
  }
`

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  .top-right {
    width: 28px;
    height: 28px;
    opacity: 1;
    .icon-chat-more {
      font-size: 28px;
      color: ${({ theme }) => theme.textL3};
    }
  }
`

export default function Chat() {
  const [currentRouter] = useCurrentRouter()
  const preCurrentRouter = usePrevious(currentRouter)
  const isLogout = useIsLogout()
  const addNewThread = useAddNewThread()
  const [, setIsChatPageLoaded] = useIsChatPageLoaded()
  const [hasLoadThreadsList] = useHasLoadThreadsList()
  const [isShowDeepThink] = useIsShowDeepThink()
  const [isShowAgentDetail] = useIsShowAgentDetail()
  const [showHistory, setShowHistory] = useShowHistory()
  const [isOpenFullScreen] = useIsOpenFullScreen()
  const [currentFullScreenBacktestData] = useCurrentFullScreenBacktestData()
  const [{ taskId, backtestData }] = useCurrentAiContentDeepThinkData()

  const isShowRightContent = useMemo(() => {
    return isShowDeepThink || isShowAgentDetail
  }, [isShowDeepThink, isShowAgentDetail])

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
      <LeftContent>
        {/* <TopWrapper>
        <HistoryButton onClick={() => setShowHistory(!showHistory)}>
          <IconBase className="icon-chat-history" />
          <span><Trans>History</Trans></span>
        </HistoryButton>
        <NewThread onClick={addNewThread}>
          <IconBase className="icon-chat-new" />
        </NewThread>
      </TopWrapper>
      <AiThreadsList /> */}
      </LeftContent>
      <RightContent $showHistory={showHistory} className='right-content'>
        {hasLoadThreadsList || isLogout ? <FileDrag /> : <Pending isFetching />}
      </RightContent>
      <Empty />
      <DeepThinkContent $isShowRightContent={isShowRightContent}>
        {isShowDeepThink && (taskId ? <Highlights isWebChatPage backtestData={backtestData} /> : <DeepThinkDetail />)}
        {/* {isShowAgentDetail && currentAgentData && (
          <DeepThinkInnerContent>
            <TopContent>
              <Trans>Task Details</Trans>
              <AgentOperator data={currentAgentData} operatorType={1} />
            </TopContent>
            <TaskItem data={currentAgentData} isTaskDetail />
          </DeepThinkInnerContent>
        )} */}
      </DeepThinkContent>
      {isOpenFullScreen && currentFullScreenBacktestData && (
        <BackTestWrapper>
          {/* <Content isLoading={false} showFullScreen={true} backtestData={currentFullScreenBacktestData} /> */}
        </BackTestWrapper>
      )}
    </ChatWrapper>
  )
}
