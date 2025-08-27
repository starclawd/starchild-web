import dayjs from 'dayjs'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Input, { InputType } from 'components/Input'
import { useCallback, useMemo, useState } from 'react'
import { useThreadsList } from 'store/chat/hooks'
import styled, { css } from 'styled-components'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useIsMobile } from 'store/application/hooks'
import { vm } from 'pages/helper'
import ThreadItem from './components/ThreadItem'

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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      overflow: unset;
    `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      overflow: unset;
    `}
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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(32)};
      padding: ${vm(8)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .time {
        height: ${vm(24)};
        padding: 0 ${vm(8)};
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

const TitleList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function ThreadList({
  isMobileMenu,
  mobileMenuCallback,
}: {
  isMobileMenu?: boolean
  mobileMenuCallback?: () => void
}) {
  const isMobile = useIsMobile()
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
    const sortedList = threadsList
      .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
      .sort((a, b) => b.createdAt - a.createdAt)
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
        }),
      }
    })
  }, [groupData, getIsToday])
  return (
    <ThreadListWrapper>
      {!isMobile && (
        <Input
          inputValue={searchValue}
          onChange={changeSearchValue}
          inputType={InputType.SEARCH}
          onResetValue={() => setSearchValue('')}
          placeholder={t`Search chat`}
        />
      )}
      <Content>
        <RecentChat>
          <Trans>Recent Chats</Trans>
        </RecentChat>
        <List ref={scrollRef} className={!isMobile ? 'scroll-style' : ''}>
          {contentList.map((data) => {
            const { time, list, key } = data
            return (
              <ContentItem key={key}>
                <span className='time'>{time}</span>
                <TitleList>
                  {list.map((data) => {
                    const { title, threadId } = data
                    const isActive = threadId === currentAiThreadId
                    return (
                      <ThreadItem
                        key={threadId}
                        title={title}
                        threadId={threadId}
                        isActive={isActive}
                        isMobileMenu={isMobileMenu}
                        mobileMenuCallback={mobileMenuCallback}
                      />
                    )
                  })}
                </TitleList>
              </ContentItem>
            )
          })}
        </List>
      </Content>
    </ThreadListWrapper>
  )
}
