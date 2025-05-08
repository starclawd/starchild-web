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
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Pending from 'components/Pending'
import { useUserInfo } from 'store/login/hooks'
import { useTimezone } from 'store/timezonecache/hooks'

const ThreadItemWrapper = styled.div<{ $isCurrentThread: boolean, $isLoading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 20px;
  gap: 16px;
  .content-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .title {
      width: 100%;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      flex-grow: 1;
      color: ${({ theme }) => theme.textL1};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      white-space: nowrap;
      color: ${({ theme }) => theme.textL3};
    }
  }
  ${({ theme, $isCurrentThread, $isLoading }) => theme.isMobile
  ? css`
    gap: ${vm(12)};
    padding: 0;
    height: auto;
    .content-wrapper {
      .title {
        width: 100%;
        font-size: .16rem;
        font-weight: 500;
        line-height: .24rem;
      }
      .time {
        font-size: .12rem;
        font-weight: 400;
        line-height: .18rem;
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
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid ${theme.bgT30};
      cursor: pointer;
      transition: all ${ANI_DURATION}s;
      .icon-chat-rubbish {
        font-size: 18px;
        color: ${theme.ruby50};
      }
      &:hover {
        border: 1px solid transparent;
        background-color: ${theme.bgT30};
      }
    }
    ${!$isCurrentThread && css`
      &:hover {
        border: 1px solid ${theme.bgT30};
        .select-wrapper {
          display: flex;
        }
        .content-wrapper {
          .time {
            display: none;
          }
        }
      }
    `}
    ${$isLoading && css`
      .select-wrapper {
        display: flex;
        border: 1px solid transparent;
      }
      .content-wrapper {
        .time {
          display: none;
        }
      }
    `}
  `}
`


export default function ThreadItem({
  data,
  isCurrentThread = false,
  closeHistory,
  currentDeleteThreadId,
  setCurrentDeleteThreadId
}: {
  data: ThreadData
  isCurrentThread: boolean
  closeHistory?: () => void
  currentDeleteThreadId: string
  setCurrentDeleteThreadId: (threadId: string) => void
}) {
  const { createdAt, title, threadId } = data
  const isMobile = useIsMobile()
  const theme = useTheme()
  const toast = useToast()
  const [timezone] = useTimezone()
  const [{ evmAddress }] = useUserInfo()
  const isLoading = currentDeleteThreadId === threadId
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
  const deleteThread = useCallback(async (threadId: string, e: any) => {
    e.stopPropagation()
    try {
      if (isLoadingAiContent || isAiLoading || isRenderingData || isLoading) return
      setCurrentDeleteThreadId(threadId)
      const data = await triggerDeleteThread([threadId])
      await triggerGetAiBotChatThreads({
        evmAddress,
      })
      if ((data as any).isSuccess) {
        toast({
          title: <Trans>Conversation Deleted</Trans>,
          description: <span><Trans><span style={{ color: theme.textL1 }}>1</span> conversations were successfully deleted.</Trans></span>,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-rubbish',
          iconTheme: theme.ruby50,
        })
      }
      setCurrentDeleteThreadId('')
    } catch (error) {
      setCurrentDeleteThreadId('')
    }
  }, [isLoadingAiContent, isLoading, isAiLoading, isRenderingData, theme, evmAddress, setCurrentDeleteThreadId, toast, triggerDeleteThread, triggerGetAiBotChatThreads])
  useEffect(() => {
    if (!isOpenDeleteThread) {
      setSelectThreadIds([])
    }
  }, [isOpenDeleteThread, setSelectThreadIds])
  return <ThreadItemWrapper $isLoading={isLoading} $isCurrentThread={isCurrentThread} className="thread-item-wrapper" onClick={isOpenDeleteThread ? toggleSelect(threadId) : changeThreadId(threadId)} key={threadId}>
    <span className="content-wrapper">
      <span className="title">{title}</span>
      <span className="time">{dayjs.tz(Number(createdAt), timezone).format('YYYY-MM-DD')}</span>
    </span>
    {
      !isMobile && !isCurrentThread && <span className="select-wrapper" onClick={(e) => deleteThread(threadId, e)}>
        {
          isLoading
            ? <Pending text="" />
            : <IconBase className="icon-chat-rubbish" />
        }
      </span>
    }
    {isOpenDeleteThread && <span className="select-wrapper">
      {
        isSelected ? <IconBase className="icon-chat-complete" /> : <IconBase className="icon-chat-unselected" />
      }
    </span>}
  </ThreadItemWrapper>
}
