import dayjs from 'dayjs'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Input, { InputType } from 'components/Input'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useDeleteThread, useGetThreadsList, useIsLoadingAiContent, useIsLoadingData, useIsRenderingData, useThreadsList } from 'store/tradeai/hooks'
import styled, { css, useTheme } from 'styled-components'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import { useUserInfo } from 'store/login/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import Pending from 'components/Pending'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

const ThreadListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
  gap: 20px;
  .input-wrapper {
    height: 40px;
    border-radius: 8px;
    input {
      padding-left: 26px;
    }
    .icon-search {
      left: 8px;
      top: calc(50% - 7px);
      font-size: 14px;
      color: ${({ theme }) => theme.textL2};
    }
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
`

const RecentChat = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  padding: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  margin-right: 0 !important;
  padding-right: 0 !important;
`

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  .time {
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
`

const TitleList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ThreadItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 36px;
  padding: 0 8px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  background-color: transparent;
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  color: ${({ theme }) => theme.textL2};
  .pending-wrapper {
    width: auto;
    .icon-loading {
      font-size: 16px;
    }
  }
  .icon-chat-rubbish {
    display: none;
    font-size: 16px;
    color: ${({ theme }) => theme.ruby50};
    transition: all ${ANI_DURATION}s;
    cursor: pointer;
  }
  &:hover {
    .icon-chat-rubbish {
      display: inline-block;
    }
  }
  span {
    max-width: 210px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ${({ $isActive, theme }) => $isActive && css`
    color: ${theme.textL1};
  `}
`

function ListItem({
  title,
  threadId,
  isActive,
}: {
  title: ReactNode
  threadId: string
  isActive: boolean
}) {
  const toast = useToast()
  const theme = useTheme()
  const [{ evmAddress }] = useUserInfo()
  const [isLoading, setIsLoading] = useState(false)
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteThread = useDeleteThread()
  const [isAiLoading] = useIsLoadingData()
  const [isRenderingData] = useIsRenderingData()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [isLoadingAiContent] = useIsLoadingAiContent()
  const changeThreadId = useCallback((threadId: string) => {
    return () => {
      if (isLoadingAiContent || isAiLoading || isRenderingData) return
      setCurrentAiThreadId(threadId)
    }
  }, [setCurrentAiThreadId, isLoadingAiContent, isAiLoading, isRenderingData])
  const deleteThread = useCallback((threadId: string) => {
    return async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (isLoading) return
      if (threadId === currentAiThreadId && (isAiLoading || isRenderingData)) return
      try {
        setIsLoading(true)
        const data = await triggerDeleteThread([threadId])
        await triggerGetAiBotChatThreads({
          evmAddress,
        })
        if ((data as any).isSuccess) { 
          toast({
            title: <Trans>Conversation Deleted</Trans>,
            description: <span><Trans><span style={{ color: theme.textL1 }}>{1}</span> conversations were successfully deleted.</Trans></span>,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-chat-rubbish',
            iconTheme: theme.ruby50,
          })
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }
  }, [isLoading, currentAiThreadId, isAiLoading, isRenderingData, evmAddress, theme, toast, triggerGetAiBotChatThreads, triggerDeleteThread])
  return <ThreadItem $isActive={isActive} onClick={changeThreadId(threadId)} key={threadId}>
    <span>{title}</span>
    {
      (isLoading || (isLoadingAiContent && threadId === currentAiThreadId))
        ? <Pending isFetching />
        : <IconBase onClick={deleteThread(threadId)} className="icon-chat-rubbish" />
    }
  </ThreadItem>
}

export default function ThreadList() {
  const [searchValue, setSearchValue] = useState('')
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const [threadsList] = useThreadsList()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const changeSearchValue = useCallback((e: any) => {
    setSearchValue(e.target.value)
  }, [])
  const getIsToday = useCallback((timestamp: number) => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, -1).getTime()
    return timestamp >= startOfDay && timestamp <= endOfDay
  }, [])
  const groupData = useMemo(() => {
    const sortedList = threadsList.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase())).sort((a, b) => b.createdAt - a.createdAt)
    return sortedList.reduce((acc: Record<string, any[]>, item) => {
      const date = new Date(item.createdAt)
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
      if (!acc[startOfDay]) {
        acc[startOfDay] = []
      }
      acc[startOfDay].push(item)
      return acc
    }, {})
  }, [threadsList, searchValue])
  const contentList = useMemo(() => {
    return Object.keys(groupData).map((time: string) => {
      const list = groupData[time]
      const isToday = getIsToday(Number(time))
      return {
        key: time,
        time: isToday ? <Trans>Today</Trans> : dayjs.tz(Number(time)).format('YYYY-MM-DD'),
        list: list.map((data) => {
          return {
            title: data.title,
            threadId: data.threadId,
          }
        })
      }
    })
  }, [groupData, getIsToday])
  return <ThreadListWrapper>
    <Input
      inputValue={searchValue}
      onChange={changeSearchValue}
      inputType={InputType.SEARCH}
      placeholder={t`Search chat`}
    />
    <Content>
      <RecentChat>
        <Trans>Recent Chats</Trans>
      </RecentChat>
      <List ref={scrollRef} className="scroll-style">
        {contentList.map((data) => {
          const { time, list, key } = data
          return <ContentItem key={key}>
            <span className="time">{time}</span>
            <TitleList>
              {list.map((data) => {
                const { title, threadId } = data
                const isActive = threadId === currentAiThreadId
                return <ListItem
                  key={threadId}
                  title={title}
                  threadId={threadId}
                  isActive={isActive}
                />
              })}
            </TitleList>
          </ContentItem>
        })}
      </List>
    </Content>
  </ThreadListWrapper>
}
