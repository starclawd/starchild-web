
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useAddNewThread, useDeleteThread, useGetThreadsList, useOpenDeleteThread, useSelectThreadIds, useThreadsList } from 'store/tradeai/hooks'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import AssistantIcon from '../AssistantIcon'
import { ANI_DURATION } from 'constants/index'
import NoData from 'components/NoData'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/theme'
import { useTheme } from 'store/themecache/hooks'
import ThreadItem from './components/ThreadItem'
import { ButtonCommon } from 'components/Button'

const AiThreadsListWrapper = styled.div<{ $isMobileHistory: boolean }>`
  display: flex;
  flex-shrink: 0;
  width: 316px;
  height: 100%;
  padding: 8px;
  ${({ $isMobileHistory }) => $isMobileHistory && css`
    width: 100%;
    padding: 0 ${vm(12)};
    ${$isMobileHistory && css`
      padding-top: ${vm(8)};
    `}
  `}
`

const ContentWrapper = styled.div<{ $noData: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
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
  flex-shrink: 0;
  padding-right: 8px;
  padding-left: 6px;
  width: 100%;
  height: 64px;
`

const AiTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 800;
  line-height: 24px;
  color: ${({ theme }) => theme.text1};
  img {
    width: 32px;
    height: 32px;
  }
`

const EditButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.bg7};
  .icon-add {
    font-size: 20px;
    color: ${({ theme }) => theme.text1};
    transition: all ${ANI_DURATION}s;
  }
  &:hover {
    .icon-add {
      color: ${({ theme }) => theme.green};
    }
  }
`

const ContentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const CurrentThread = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 12px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)};
    gap: ${vm(12)};
    > span {
      font-size: .12rem;
      font-weight: 500;
      line-height: .18rem;
      color: ${theme.jade10};
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
  isMobileHistory = false,
  closeHistory
}: {
  isMobileHistory?: boolean
  closeHistory?: () => void
}) {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [threadsList] = useThreadsList()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteThread = useDeleteThread()
  const addNewThread = useAddNewThread()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [selectThreadIds, setSelectThreadIds] = useSelectThreadIds()
  const [isOpenDeleteThread, setIsOpenDeleteThread] = useOpenDeleteThread()
  const currentThreadData = useMemo(() => {
    return threadsList.find((data: any) => data.threadId === currentAiThreadId)
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
  return <AiThreadsListWrapper $isMobileHistory={isMobileHistory}>
    <ContentWrapper $noData={threadsList.length === 0}>
      {isMobileHistory
        ? null
        : <TopContent>
          <AiTitle>
            <AssistantIcon />
            <span><Trans>AI Agent</Trans></span>
          </AiTitle>
          <EditButton onClick={addNewThread}>
            <IconBase className="icon-add" />
          </EditButton>
        </TopContent>}
        {otherThreadList.length > 0
          ? <ContentListWrapper className="scroll-style">
            {currentThreadData && <CurrentThread
              $borderColor={theme.jade10}
              $borderRadius={36}
            >
              <span><Trans>Continue your last chat</Trans></span>
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
          </ContentListWrapper>
          : <NoData />}
        {isOpenDeleteThread && <OperatorWrapper>
          <ButtonCancel onClick={() => setIsOpenDeleteThread(false)}><Trans>Cancel</Trans></ButtonCancel>
          <ButtonDelete onClick={deleteThreads}><Trans>Delete</Trans></ButtonDelete>
        </OperatorWrapper>}
    </ContentWrapper>
  </AiThreadsListWrapper>
})
