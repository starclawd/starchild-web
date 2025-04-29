import styled, { css } from 'styled-components'
import dayjs from 'dayjs'
import { IconBase } from 'components/Icons'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDeleteThread, useGetThreadsList, useIsLoadingAiContent, useIsLoadingData, useIsRenderingData, useOpenDeleteThread, useSelectThreadIds } from 'store/tradeai/hooks'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import { vm } from 'pages/helper'
import { ThreadData } from 'store/tradeai/tradeai'
import { ANI_DURATION } from 'constants/index'
import { useIsMobile } from 'store/application/hooks'

const ThreadItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 100%;
    flex: 1;
    overflow: hidden;
    .time {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:first-child {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        color: ${({ theme }) => theme.textL1};
      }
      span:last-child {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: ${({ theme }) => theme.textL3};
      }
    }
    .title {
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px; 
      color: ${({ theme }) => theme.textL3};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  ${({ theme }) => theme.isMobile
  ? css`
    width: 100%;
    gap: ${vm(12)};
    .content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: ${vm(4)};
      width: 100%;
      flex: 1;
      overflow: hidden;
      .time {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span:first-child {
          font-size: .18rem;
          font-weight: 500;
          line-height: .26rem;
          color: ${theme.textL1};
        }
        span:last-child {
          font-size: .12rem;
          font-weight: 400;
          line-height: .18rem;
          color: ${theme.textL3};
        }
      }
      .title {
        width: 100%;
        font-size: .12rem;
        font-weight: 400;
        line-height: .18rem;
        color: ${theme.textL3};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .select-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: ${vm(18)};
      height: 100%;
      border-radius: 50%;
      .icon-chat-unselected {
        font-size: 0.18rem;
        color: ${theme.textL5};
      }
      .icon-chat-complete {
        font-size: 0.18rem;
        color: ${theme.ruby50};
      }
    }
  `: css`
    cursor: pointer;
    border-radius: 36px;
    transition: all ${ANI_DURATION}s;
    border: 1px solid transparent;
    .select-wrapper {
      display: none;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid ${theme.bgT30};
      cursor: pointer;
      .icon-chat-rubbish {
        font-size: 24px;
        color: ${theme.ruby50};
      }
      &:hover {
        border: 1px solid transparent;
        background-color: ${theme.bgT30};
      }
    }
    &:hover {
      border: 1px solid ${theme.bgT30};
      .select-wrapper {
        display: flex;
      }
      .content-wrapper {
        .time {
          span:last-child {
            display: none;
          }
        }
      }
    }
  `}
`


export default function ThreadItem({
  data,
  closeHistory
}: {
  data: ThreadData
  closeHistory?: () => void
}) {
  const { createdAt, title, threadId } = data
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [isAiLoading] = useIsLoadingData()
  const [isRenderingData] = useIsRenderingData()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [isLoadingAiContent] = useIsLoadingAiContent()
  const [isOpenDeleteThread] = useOpenDeleteThread()
  const triggerDeleteThread = useDeleteThread()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [selectThreadIds, setSelectThreadIds] = useSelectThreadIds()
  const isSelected = useMemo(() => {
    return selectThreadIds.includes(threadId)
  }, [selectThreadIds, threadId])
  const toggleSelect = useCallback((threadId: string) => {
    return (e: any) => {
      e.stopPropagation()
      setSelectThreadIds(isSelected ? selectThreadIds.filter(id => id !== threadId) : [...selectThreadIds, threadId])
    }
  }, [selectThreadIds, setSelectThreadIds, isSelected])
  const changeThreadId = useCallback((threadId: string) => {
    return () => {
      if (isLoadingAiContent || isAiLoading || isRenderingData) return
      setCurrentAiThreadId(threadId)
      closeHistory?.()
    }
  }, [setCurrentAiThreadId, isLoadingAiContent, isAiLoading, isRenderingData, closeHistory])
  const deleteThread = useCallback(async (threadId: string) => {
    try {
      if (isLoadingAiContent || isAiLoading || isRenderingData) return
      setIsLoading(true)
      await triggerDeleteThread(threadId)
      await triggerGetAiBotChatThreads()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      // promptInfo(PromptInfoType.ERROR, handleError(error).message)
    }
  }, [isLoadingAiContent, isAiLoading, isRenderingData, triggerDeleteThread, triggerGetAiBotChatThreads])
  useEffect(() => {
    if (!isOpenDeleteThread) {
      setSelectThreadIds([])
    }
  }, [isOpenDeleteThread, setSelectThreadIds])
  return <ThreadItemWrapper className="thread-item-wrapper" onClick={isOpenDeleteThread ? toggleSelect(threadId) : changeThreadId(threadId)} key={threadId}>
    <span className="content-wrapper">
      <span className="time">
        <span>XXXXXXXX</span>
        <span>{dayjs.tz(Number(createdAt)).format('YYYY-MM-DD')}</span>
      </span>
      <span className="title">{title}</span>
    </span>
    {
      !isMobile && <span className="select-wrapper" onClick={() => deleteThread(threadId)}>
        <IconBase className="icon-chat-rubbish" />
      </span>
    }
    {isOpenDeleteThread && <span className="select-wrapper">
      {
        isSelected ? <IconBase className="icon-chat-complete" /> : <IconBase className="icon-chat-unselected" />
      }
    </span>}
  </ThreadItemWrapper>
}
