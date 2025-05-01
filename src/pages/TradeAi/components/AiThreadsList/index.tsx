
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useAddNewThread, useDeleteThread, useGetThreadsList, useOpenDeleteThread, useSelectThreadIds, useThreadsList } from 'store/tradeai/hooks'
import { useCurrentAiThreadId, useShowHistory } from 'store/tradeaicache/hooks'
import { ANI_DURATION } from 'constants/index'
import NoData from 'components/NoData'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import ThreadItem from './components/ThreadItem'
import { ButtonCommon } from 'components/Button'
import { useIsMobile } from 'store/application/hooks'
import TransitionWrapper from 'components/TransitionWrapper'
import { useWindowSize } from 'hooks/useWindowSize'
import useToast, { TOAST_STATUS } from 'components/Toast'
import Pending from 'components/Pending'

const AiThreadsListWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding: 84px 0 0;
  ${({ theme }) => theme.isMobile && css`
    padding: 0 ${vm(12)};
    padding-top: ${vm(8)};
  `}
`

const ContentWrapper = styled.div<{ $noData: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  .transition-wrapper {
    height: 100%;
    flex: 1;
  }
  ${({ theme, $noData }) => theme.isMobile && css`
    justify-content: space-between;
    background-color: transparent;
    ${$noData && css`
      width: 100%;
      height: ${vm(304)};
      padding: ${vm(20)};
      border-radius: ${vm(36)};
      background-color: ${theme.bgL1};
    `}
  `}
`

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: fit-content;
  height: 44px;
  padding: 0 18px;
  border-radius: 44px;
  border: 1px solid ${({ theme }) => theme.textL6};
  cursor: pointer;
  .icon-chat-history {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  span {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
`

const TransitionInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.isMobile && css`
    justify-content: space-between;
  `}
`

const ContentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-right: 12px;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    padding-right: 0;
  `}
`

const CurrentThread = styled(BorderAllSide1PxBox)<{ $isLoading: boolean }>`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  padding: 20px;
  .current-thread-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
    gap: 16px;
    > span {
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
      color: ${({ theme }) => theme.jade10};
    }
  }
  ${({ theme, $isLoading }) => theme.isMobile
  ? css`
    padding: ${vm(20)};
    .thread-item-wrapper {
      padding: 0;
      height: auto;
    }
    .current-thread-left {
      gap: ${vm(12)};
      > span {
        font-size: .12rem;
        font-weight: 500;
        line-height: .18rem;
      }
    }
  `: css`
    .thread-item-wrapper {
      padding: 0;
      height: auto;
    }
    .current-thread-right {
      display: none;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid ${({ theme }) => theme.bgT30};
      cursor: pointer;
      transition: all ${ANI_DURATION}s;
      .icon-chat-rubbish {
        font-size: 24px;
        color: ${({ theme }) => theme.ruby50};
      }
      &:hover {
        border: 1px solid transparent;
        background-color: ${({ theme }) => theme.bgT30};
      }
    }
    &:hover {
      .current-thread-left {
        .content-wrapper {
          .time {
            display: none;
          }
        }
      }
      .current-thread-right {
        display: flex;
      }
    }
    ${$isLoading && css`
      .current-thread-left {
        .content-wrapper {
          .time {
            display: none;
          }
        }
      }
      .current-thread-right {
        display: flex;
        border: 1px solid transparent;
      }
    `}
  `}
`

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
  ${({ theme }) => theme.isMobile
  ? css`
    padding: ${vm(20)};
    gap: ${vm(30)};
    background-color: ${theme.bgL1};
    border-radius: ${vm(36)};
  ` : css`
    .thread-item-wrapper {
      padding: 20px;
    }
  `}
`

const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
  width: 100%;
  height: 60px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    height: ${vm(60)};
  `}
`

const ButtonCancel = styled(ButtonCommon)`
  width: 50%;
  height: 100%;
  background-color: ${({ theme }) => theme.sfC2};
  ${({ theme }) => theme.isMobile && css`
    font-size: .18rem;
    font-weight: 500;
    line-height: .26rem; 
    border-radius: ${vm(60)};
    color: ${theme.textL1};
    &:active {
      background-color: ${theme.sfC2};
    }
  `}
`

const ButtonDelete = styled(ButtonCancel)`
  background-color: ${({ theme }) => theme.ruby60};
  ${({ theme }) => theme.isMobile && css`
    &:active {
      background-color: ${theme.ruby60};
    }
  `}
`

export default memo(function AiThreadsList({
  closeHistory
}: {
  closeHistory?: () => void
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const { width } = useWindowSize()
  const toast = useToast()
  const [currentDeleteThreadId, setCurrentDeleteThreadId] = useState('')
  const [threadsList] = useThreadsList()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteThread = useDeleteThread()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [selectThreadIds, setSelectThreadIds] = useSelectThreadIds()
  const [isOpenDeleteThread, setIsOpenDeleteThread] = useOpenDeleteThread()
  const [showHistoryThread, setShowHistoryThread] = useState(true)
  const [showHistory] = useShowHistory()
  const currentThreadData = useMemo(() => {
    return threadsList.find((data: any) => data.threadId === currentAiThreadId)
    // return threadsList[0]
  }, [threadsList, currentAiThreadId])
  const isLoading = currentDeleteThreadId === currentThreadData?.threadId
  const otherThreadList = useMemo(() => {
    return threadsList.filter((data: any) => data.threadId !== currentAiThreadId)
  }, [threadsList, currentAiThreadId])
  const deleteThreads = useCallback(async (selectThreadIds: string[], e: any) => {
    e.stopPropagation()
    try {
      if (isLoading || selectThreadIds.length === 0) return
      setCurrentDeleteThreadId(selectThreadIds[0])
      await triggerDeleteThread(selectThreadIds[0])
      await triggerGetAiBotChatThreads()
      toast({
        title: <Trans>Conversation Deleted</Trans>,
        description: <span><Trans><span style={{ color: theme.textL1 }}>{selectThreadIds.length}</span> conversations were successfully deleted.</Trans></span>,
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-rubbish',
        iconTheme: theme.ruby50,
      })
      setCurrentDeleteThreadId('')
    } catch (error) {
      setCurrentDeleteThreadId('')
    }
    setIsOpenDeleteThread(false)
    setSelectThreadIds([])
  }, [isLoading, theme, toast, setIsOpenDeleteThread, setSelectThreadIds, triggerDeleteThread, triggerGetAiBotChatThreads])
  useEffect(() => {
    triggerGetAiBotChatThreads()
  }, [triggerGetAiBotChatThreads])
  useEffect(() => {
    return () => {
      setSelectThreadIds([])
      setIsOpenDeleteThread(false)
    }
  }, [setSelectThreadIds, setIsOpenDeleteThread])
  return <AiThreadsListWrapper>
    <ContentWrapper $noData={threadsList.length === 0}>
      <TransitionWrapper
        key={width}
        transitionType="width"
        visible={showHistory || isMobile}
      >
        <TransitionInnerWrapper className="threads-list-wrapper">
          {threadsList.length > 0
            ? showHistoryThread
              ? <ContentListWrapper className="scroll-style">
              {currentThreadData && <CurrentThread
                $borderColor={theme.jade10}
                $borderRadius={36}
                $isLoading={isLoading}
              >
                <span className="current-thread-left">
                  <span>
                    {
                      isMobile
                        ? <Trans>Continue your last chat</Trans>
                        : <Trans>Current Session</Trans>
                    }
                  </span>
                  <ThreadItem
                    isCurrentThread={true}
                    data={currentThreadData}
                    key={currentThreadData.createdAt}
                    closeHistory={closeHistory}
                    currentDeleteThreadId={currentDeleteThreadId}
                    setCurrentDeleteThreadId={setCurrentDeleteThreadId}
                  />
                </span>
                {!isMobile && <span onClick={(e) => deleteThreads([currentThreadData.threadId], e)} className="current-thread-right">
                  {
                    isLoading
                      ? <Pending />
                      : <IconBase className="icon-chat-rubbish" />
                  }
                </span>}
              </CurrentThread>}
              <ContentList>
                {otherThreadList.map((data: any) => {
                  const { createdAt } = data
                return <ThreadItem
                  data={data}
                  key={createdAt}
                  isCurrentThread={false}
                  closeHistory={closeHistory}
                  currentDeleteThreadId={currentDeleteThreadId}
                  setCurrentDeleteThreadId={setCurrentDeleteThreadId}
                />
              })}
              </ContentList>
            </ContentListWrapper> : null
            : <NoData />}
          {isOpenDeleteThread && isMobile && <OperatorWrapper>
            <ButtonCancel onClick={() => setIsOpenDeleteThread(false)}><Trans>Cancel</Trans></ButtonCancel>
            <ButtonDelete onClick={(e) => deleteThreads(selectThreadIds, e)}>
              {
                currentDeleteThreadId
                  ? <Pending iconStyle={{ color: theme.black, fontSize: isMobile ? '.24rem' : '24px' }} />
                  : <Trans>Delete</Trans>
              }
            </ButtonDelete>
          </OperatorWrapper>}
        </TransitionInnerWrapper>
      </TransitionWrapper>
    </ContentWrapper>
  </AiThreadsListWrapper>
})
