
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useAddNewThread, useDeleteThread, useGetThreadsList, useOpenDeleteThread, useSelectThreadIds, useThreadsList } from 'store/tradeai/hooks'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import { ANI_DURATION } from 'constants/index'
import NoData from 'components/NoData'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import ThreadItem from './components/ThreadItem'
import { ButtonCommon } from 'components/Button'
import { useIsMobile } from 'store/application/hooks'

const AiThreadsListWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding: 32px 0 0;
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

const ContentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-right: 16px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const CurrentThread = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
  gap: 16px;
  > span {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.jade10};
  }
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)};
    gap: ${vm(12)};
    > span {
      font-size: .12rem;
      font-weight: 500;
      line-height: .18rem;
    }
  `}
`

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 20px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)};
    gap: ${vm(20)};
    background-color: ${theme.bgL1};
    border-radius: ${vm(36)};
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
  const [isLoading, setIsLoading] = useState(false)
  const [threadsList] = useThreadsList()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteThread = useDeleteThread()
  const addNewThread = useAddNewThread()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [selectThreadIds, setSelectThreadIds] = useSelectThreadIds()
  const [isOpenDeleteThread, setIsOpenDeleteThread] = useOpenDeleteThread()
  const [showHistoryThread, setShowHistoryThread] = useState(true)
  const currentThreadData = useMemo(() => {
    return threadsList.find((data: any) => data.threadId === currentAiThreadId)
    // return threadsList[0]
  }, [threadsList, currentAiThreadId])
  const otherThreadList = useMemo(() => {
    return threadsList.filter((data: any) => data.threadId !== currentAiThreadId)
  }, [threadsList, currentAiThreadId])
  const deleteThreads = useCallback(async () => {
    try {
      if (isLoading || selectThreadIds.length === 0) return
      setIsLoading(true)
      await triggerDeleteThread(selectThreadIds[0])
      await triggerGetAiBotChatThreads()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      // promptInfo(PromptInfoType.ERROR, handleError(error).message)
    }
    setIsOpenDeleteThread(false)
    setSelectThreadIds([])
  }, [isLoading, selectThreadIds, setIsOpenDeleteThread, setSelectThreadIds, triggerDeleteThread, triggerGetAiBotChatThreads])
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
      {isMobile
        ? null
        : <TopContent>
          <IconBase className="icon-chat-history" />
          <span><Trans>History</Trans></span>
        </TopContent>}
        {otherThreadList.length > 0
          ? showHistoryThread
            ? <ContentListWrapper className="scroll-style">
            {currentThreadData && <CurrentThread
              $borderColor={theme.jade10}
              $borderRadius={36}
            >
              <span>
                {
                  isMobile
                    ? <Trans>Continue your last chat</Trans>
                    : <Trans>Current Session</Trans>
                }
              </span>
              <ThreadItem
                data={currentThreadData}
                key={currentThreadData.createdAt}
                closeHistory={closeHistory}
              />
            </CurrentThread>}
            <ContentList>
              {otherThreadList.map((data: any) => {
                const { createdAt } = data
              return <ThreadItem
                data={data}
                key={createdAt}
                closeHistory={closeHistory}
              />
            })}
            </ContentList>
          </ContentListWrapper> : null
          : <NoData />}
        {isOpenDeleteThread && <OperatorWrapper>
          <ButtonCancel onClick={() => setIsOpenDeleteThread(false)}><Trans>Cancel</Trans></ButtonCancel>
          <ButtonDelete onClick={deleteThreads}><Trans>Delete</Trans></ButtonDelete>
        </OperatorWrapper>}
    </ContentWrapper>
  </AiThreadsListWrapper>
})
