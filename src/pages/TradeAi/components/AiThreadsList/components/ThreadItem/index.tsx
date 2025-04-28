import styled, { css } from 'styled-components'
import dayjs from 'dayjs'
import { IconBase } from 'components/Icons'
import { useCallback, useEffect, useMemo } from 'react'
import { useIsLoadingAiContent, useIsLoadingData, useIsRenderingData, useOpenDeleteThread, useSelectThreadIds } from 'store/tradeai/hooks'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import { vm } from 'pages/helper'
import { ThreadData } from 'store/tradeai/tradeai'

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
  ${({ theme }) => theme.isMobile && css`
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
  const [isAiLoading] = useIsLoadingData()
  const [isRenderingData] = useIsRenderingData()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [isLoadingAiContent] = useIsLoadingAiContent()
  const [isOpenDeleteThread] = useOpenDeleteThread()
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
    {isOpenDeleteThread && <span className="select-wrapper">
      {
        isSelected ? <IconBase className="icon-chat-complete" /> : <IconBase className="icon-chat-unselected" />
      }
    </span>}
  </ThreadItemWrapper>
}
