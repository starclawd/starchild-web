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
import { useActiveLocale } from 'hooks/useActiveLocale'
import { LOCAL_TEXT } from 'constants/locales'
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
  const activeLocale = useActiveLocale()
  const changeSearchValue = useCallback((e: any) => {
    setSearchValue(e.target.value)
  }, [])

  const groupData = useMemo(() => {
    const sortedList = threadsList
      .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
      .sort((a, b) => b.updatedAt - a.updatedAt)

    const now = Date.now()
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const startOf7DaysAgo = startOfToday - 6 * 24 * 60 * 60 * 1000 // 7 days including today
    const startOf30DaysAgo = startOfToday - 29 * 24 * 60 * 60 * 1000 // 30 days including today

    return sortedList.reduce((acc: Record<string, any[]>, item) => {
      const itemTime = item.updatedAt

      if (itemTime >= startOfToday) {
        // Today
        if (!acc['today']) {
          acc['today'] = []
        }
        acc['today'].push(item)
      } else if (itemTime >= startOf7DaysAgo) {
        // First 7 days (excluding today)
        if (!acc['first7days']) {
          acc['first7days'] = []
        }
        acc['first7days'].push(item)
      } else if (itemTime >= startOf30DaysAgo) {
        // First 30 days (excluding first 7 days)
        if (!acc['first30days']) {
          acc['first30days'] = []
        }
        acc['first30days'].push(item)
      } else {
        // Group by month for older items
        const date = new Date(itemTime)
        const currentYear = new Date().getFullYear()
        const itemYear = date.getFullYear()

        if (itemYear === currentYear) {
          // Current year: group by month
          const monthKey = `${itemYear}-${String(date.getMonth() + 1).padStart(2, '0')}`
          if (!acc[monthKey]) {
            acc[monthKey] = []
          }
          acc[monthKey].push(item)
        } else {
          // Previous years: group all together
          if (!acc['beforeThisYear']) {
            acc['beforeThisYear'] = []
          }
          acc['beforeThisYear'].push(item)
        }
      }
      return acc
    }, {})
  }, [threadsList, searchValue])
  const contentList = useMemo(() => {
    // Define the order of groups to display
    const groupOrder = ['today', 'first7days', 'first30days']

    // Get month keys (current year) and sort them in descending order
    const monthKeys = Object.keys(groupData)
      .filter((key) => !groupOrder.includes(key) && key !== 'beforeThisYear')
      .sort((a, b) => b.localeCompare(a))

    // Combine all keys in the desired order: today -> first7days -> first30days -> current year months -> before this year
    const allKeys = [
      ...groupOrder.filter((key) => groupData[key]),
      ...monthKeys,
      ...(groupData['beforeThisYear'] ? ['beforeThisYear'] : []),
    ]

    return allKeys.map((key: string) => {
      const list = groupData[key]
      let displayTime

      switch (key) {
        case 'today':
          displayTime = <Trans>Today</Trans>
          break
        case 'first7days':
          displayTime = <Trans>First 7 days</Trans>
          break
        case 'first30days':
          displayTime = <Trans>First 30 days</Trans>
          break
        case 'beforeThisYear':
          displayTime = <Trans>Before this year</Trans>
          break
        default: {
          // Current year month format: YYYY-MM
          const [year, month] = key.split('-')
          if (activeLocale === LOCAL_TEXT.CN) {
            // Chinese format: 1月, 2月, etc.
            displayTime = `${parseInt(month)}月`
          } else {
            // English format: January, February, etc.
            displayTime = dayjs(`${year}-${month}-01`).format('MMMM')
          }
          break
        }
      }

      return {
        key,
        time: displayTime,
        list: list.map((data) => ({
          title: data.title,
          threadId: data.threadId,
        })),
      }
    })
  }, [groupData, activeLocale])
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
