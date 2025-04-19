
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { BackArrow, IconBase } from 'components/Icons'
import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useAiResponseContentList, useCloseStream, useDeleteThread, useGetThreadsList, useIsLoadingAiContent, useIsLoadingData, useIsRenderingData, useResetTempAiContentData, useThreadsList } from 'store/tradeai/hooks'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import ButtonLoading, { BUTTON_LOADING_TYPE } from 'components/ButtonLoading'
import AssistantIcon from '../AssistantIcon'
import { ANI_DURATION } from 'constants/index'
import NoData from 'components/NoData'
import { vm } from 'pages/helper'
import { ThreadData } from 'store/tradeai/tradeai'

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

const OrderHisTop = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: 18px;
  color: ${({ theme }) => theme.text3};
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

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const ContentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)};
    background-color: ${theme.bgL1};
    border-radius: ${vm(36)};
    gap: ${vm(12)};
    .content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: ${vm(4)};
      .time {
        font-size: .12rem;
        font-weight: 400;
        line-height: .18rem;
        color: ${theme.textL3};
      }
      .title {
        font-size: .12rem;
        font-weight: 400;
        line-height: .18rem;
        color: ${theme.textL3};
      }
    }
    .delete-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${vm(32)};
      height: ${vm(32)};
      border-radius: 50%;
      background-color: ${theme.bgL2};
      .icon-chat-delete {
        font-size: 0.18rem;
        color: ${theme.textL1};
      }
    }
  `}
`

function TitleItem({
  data,
  closeHistory
}: {
  data: ThreadData
  closeHistory?: () => void
}) {
  const { createdAt, title, threadId } = data
  const [isLoading, setIsLoading] = useState(false)
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteThread = useDeleteThread()
  const [isAiLoading] = useIsLoadingData()
  const [isRenderingData] = useIsRenderingData()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [isLoadingAiContent] = useIsLoadingAiContent()
  const isActive = threadId === currentAiThreadId
  const changeThreadId = useCallback((threadId: string) => {
    return () => {
      if (isLoadingAiContent || isAiLoading || isRenderingData) return
      setCurrentAiThreadId(threadId)
      closeHistory?.()
    }
  }, [setCurrentAiThreadId, isLoadingAiContent, isAiLoading, isRenderingData, closeHistory])
  const deleteThread = useCallback((threadId: string) => {
    return async (e: any) => {
      e.stopPropagation()
      if (isLoading) return
      if (threadId === currentAiThreadId && (isAiLoading || isRenderingData)) return
      try {
        setIsLoading(true)
        await triggerDeleteThread(threadId)
        await triggerGetAiBotChatThreads()
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        // promptInfo(PromptInfoType.ERROR, handleError(error).message)
      }
    }
  }, [isLoading, currentAiThreadId, isAiLoading, isRenderingData, triggerGetAiBotChatThreads, triggerDeleteThread])
  return <ContentItem onClick={changeThreadId(threadId)} key={threadId}>
    <span className="content-wrapper">
      <span className="title">{title}</span>
      <span className="time">{dayjs.tz(Number(createdAt)).format('YYYY-MM-DD')}</span>
    </span>
    <span className="delete-wrapper" onClick={deleteThread(threadId)}>
      <IconBase className="icon-chat-delete" />
    </span>
  </ContentItem>
}

export default memo(function AiThreadsList({ isMobileHistory = false, closeHistory }: { isMobileHistory?: boolean, closeHistory?: () => void }) {
  // const { aiChatKey } = useUserCenterData()
  const [threadsList] = useThreadsList()
  const closeStream = useCloseStream()
  const [isAiLoading] = useIsLoadingData()
  const resetTempAiContentData = useResetTempAiContentData()
  const [isRenderingData, setIsRenderingData] = useIsRenderingData()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [, setAiResponseContentList] = useAiResponseContentList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const addNewThread = useCallback(() => {
    if (isAiLoading || isRenderingData) return
    closeStream()
    setIsRenderingData(false)
    setCurrentAiThreadId('')
    setAiResponseContentList([])
    resetTempAiContentData()
    closeHistory?.()
  }, [isAiLoading, isRenderingData, resetTempAiContentData, setCurrentAiThreadId, setAiResponseContentList, closeStream, setIsRenderingData, closeHistory])

  useEffect(() => {
    // if (aiChatKey) {
    triggerGetAiBotChatThreads()
    // }
  }, [triggerGetAiBotChatThreads])
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
        {threadsList.length > 0
          ? <ContentList className="scroll-style">
            {threadsList.map((data: any) => {
              const { createdAt } = data
              return <TitleItem
                data={data}
                key={createdAt}
                closeHistory={closeHistory}
              />
            })}
          </ContentList>
          : <NoData />}
    </ContentWrapper>
  </AiThreadsListWrapper>
})
