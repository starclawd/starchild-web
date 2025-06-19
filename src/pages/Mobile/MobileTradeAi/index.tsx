import styled, { css } from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TradeAi from './components/TradeAi'
import BottomSheet from 'components/BottomSheet'
import { useTheme } from 'store/themecache/hooks'
import { useCurrentAiContentDeepThinkData, useGetAiBotChatContents, useGetThreadsList, useHasLoadThreadsList, useIsShowDeepThink, useIsShowTaskDetails } from 'store/tradeai/hooks'
import ThinkList from 'pages/TradeAi/components/DeepThink/components/ThinkList'
import Sources from 'pages/TradeAi/components/DeepThink/components/Sources'
import { vm } from 'pages/helper'
import { useIsLogout, useUserInfo } from 'store/login/hooks'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import Pending from 'components/Pending'
import { useCurrentTaskData } from 'store/setting/hooks'
import TaskItem from 'pages/Tasks/components/TaskItem'
import { Trans } from '@lingui/react/macro'
import TaskOperator from 'pages/Tasks/components/TaskOperator'
import MoveTabList from 'components/MoveTabList'
import DeepThinkDetail from 'pages/TradeAi/components/DeepThinkDetail'
import Highlights from 'pages/BackTest/components/Highlights'

const MobileTradeAiWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: 8px;
  flex-grow: 1;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`

const DeepThinkContent = styled.div<{ $isShowTaskDetails?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${vm(20)};
  flex-shrink: 0;
  width: 100%;
  height: calc(100% - ${vm(31)});
  padding: ${vm(12)} ${vm(20)} ${vm(20)};
  border-radius: ${vm(24)};
  ${({ $isShowTaskDetails }) => $isShowTaskDetails && css`
    gap: ${vm(12)};
  `}
`

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0.44rem;
  font-size: 0.2rem;
  font-weight: 500;
  line-height: 0.28rem;
  color: ${({ theme }) => theme.textL1};
  .top-right {
    width: ${vm(28)};
    height: ${vm(28)};
    opacity: 1;
    .icon-chat-more {
      font-size: 0.28rem;
      color: ${({ theme }) => theme.textL3};
    }
  }
`

export default function MobileTradeAi() {
  const theme = useTheme()
  const isLogout = useIsLogout()
  const [{ evmAddress }] = useUserInfo()
  const [tabIndex, setTabIndex] = useState(0)
  const [hasLoadThreadsList] = useHasLoadThreadsList()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [isShowTaskDetails, setIsShowTaskDetails] = useIsShowTaskDetails()
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const [{ sourceListDetails, taskId, backtestData }] = useCurrentAiContentDeepThinkData()
  const [currentTaskData] = useCurrentTaskData()
  const isShowBottomSheet = useMemo(() => {
    return isShowDeepThink || isShowTaskDetails
  }, [isShowDeepThink, isShowTaskDetails])
  const changeTabIndex = useCallback((index: number) => {
    return () => {
      setTabIndex(index)
    }
  }, [setTabIndex])
  
  const tabList = useMemo(() => {
    const sourceListLength = sourceListDetails.length
    return [
      {
        key: 0,
        text: <Trans>Activity</Trans>,
        clickCallback: changeTabIndex(0)
      },
      {
        key: 1,
        text: <Trans>{sourceListLength} sources</Trans>,
        clickCallback: changeTabIndex(1)
      },
    ]
  }, [sourceListDetails.length, changeTabIndex])
  const closeDeepThink = useCallback(() => {
    setIsShowDeepThink(false)
    setIsShowTaskDetails(false)
  }, [setIsShowDeepThink, setIsShowTaskDetails])
  const onRefresh = useCallback(async () => {
    try {
      setIsPullDownRefreshing(true)
      if (evmAddress) {
        await triggerGetAiBotChatThreads({
          evmAddress,
        })
      }
      if (currentAiThreadId && evmAddress) {
        await triggerGetAiBotChatContents({
          threadId: currentAiThreadId,
          evmAddress,
        })
      }
      setTimeout(() => {
        setIsPullDownRefreshing(false)
      }, 1000)
    } catch (error) {
      setIsPullDownRefreshing(false)
    }
  }, [triggerGetAiBotChatThreads, evmAddress, currentAiThreadId, triggerGetAiBotChatContents])

  useEffect(() => {
    if (evmAddress) {
      triggerGetAiBotChatThreads({
        evmAddress,
      })
    }
  }, [triggerGetAiBotChatThreads, evmAddress])
  return <MobileTradeAiWrapper>
    <PullDownRefresh
      onRefresh={onRefresh}
      isRefreshing={isPullDownRefreshing}
      setIsRefreshing={setIsPullDownRefreshing}
      scrollContainerId="#aiContentInnerEl"
    >
      {/* <PullUpRefresh
        disabledPull={true}
        onRefresh={onRefresh}
        isRefreshing={false}
        setIsRefreshing={setIsPullDownRefreshing}
      >
      </PullUpRefresh> */}
        <ContentWrapper>
          {(hasLoadThreadsList || isLogout) ? (
            <TradeAi />
          ) : (
            <Pending isFetching />
          )}
        </ContentWrapper>
    </PullDownRefresh>
    <BottomSheet
      placement="mobile"
      rootStyle={{
        bottom: '0 !important',
        height: isShowDeepThink ? '100%' : 'auto',
        backgroundColor: theme.bgL1
      }}
      isOpen={isShowBottomSheet}
      onClose={closeDeepThink}
    >
      {isShowDeepThink && <DeepThinkContent>
        {taskId ? <Highlights isMobileChatPage backtestData={backtestData} /> : <DeepThinkDetail />}
      </DeepThinkContent>}
      {isShowTaskDetails && currentTaskData && <DeepThinkContent $isShowTaskDetails={isShowTaskDetails}>
        <TopContent>
          <Trans>Task Details</Trans>
          <TaskOperator data={currentTaskData} operatorType={1} />
        </TopContent>
        <TaskItem data={currentTaskData} isTaskDetail />
      </DeepThinkContent>}
    </BottomSheet>
  </MobileTradeAiWrapper>
}
