
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

const AiThreadsListWrapper = styled.div<{ isOrderHis: boolean }>`
  display: flex;
  flex-shrink: 0;
  width: 316px;
  height: 100%;
  padding: 8px;
  ${({ isOrderHis }) => isOrderHis && css`
    width: 100%;
  `}
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  padding: 0px 8px 20px 8px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
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
  padding-right: 4px;
  gap: 12px;
`

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  .time {
    display: flex;
    align-items: center;
    padding: 0 14px;
    height: 36px;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    color: ${({ theme }) => theme.text3};
  }
`

const TitleList = styled.div`
  display: flex;
  flex-direction: column;
  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    border-radius: 8px;
    background-color: transparent;
    transition: all ${ANI_DURATION}s;
    cursor: pointer;
    .icon-mobile-delete {
      display: none;
      color: ${({ theme }) => theme.red};
    }
    &:hover {
      background-color: ${({ theme }) => theme.bg10};
      .icon-mobile-delete {
        display: inline-block;
      }
    }
    &.active {
      background-color: ${({ theme }) => theme.bg10};
    }
    span {
      max-width: 260px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`

const ButtonNew = styled.div`
  width: 100%;
  height: 44px;
`

function ListItem({
  title,
  threadId,
  isActive,
  closeHistory
}: {
  title: ReactNode
  threadId: string
  isActive: boolean
  closeHistory?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  // const closeStream = useCloseStream()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteThread = useDeleteThread()
  // const resetTempAiContentData = useResetTempAiContentData()
  const [isAiLoading] = useIsLoadingData()
  const [isRenderingData] = useIsRenderingData()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const [isLoadingAiContent] = useIsLoadingAiContent()
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
  return <span className={isActive ? 'active' : ''} onClick={changeThreadId(threadId)} key={threadId}>
    <span>{title}</span>
    {
      (isLoading || (isLoadingAiContent && threadId === currentAiThreadId))
        ? <ButtonLoading type={BUTTON_LOADING_TYPE.TRANSPARENT_BUTTON} />
        : <IconBase onClick={deleteThread(threadId)} className="icon-mobile-delete" />
    }
  </span>
}

export default memo(function AiThreadsList({ isOrderHis = false, closeHistory }: { isOrderHis?: boolean, closeHistory?: () => void }) {
  // const { aiChatKey } = useUserCenterData()
  const [threadsList] = useThreadsList()
  const closeStream = useCloseStream()
  const [isAiLoading] = useIsLoadingData()
  const resetTempAiContentData = useResetTempAiContentData()
  const [isRenderingData, setIsRenderingData] = useIsRenderingData()
  const triggerGetAiBotChatThreads = useGetThreadsList()
  const [, setAiResponseContentList] = useAiResponseContentList()
  const [currentAiThreadId, setCurrentAiThreadId] = useCurrentAiThreadId()
  const getIsToday = useCallback((timestamp: number) => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, -1).getTime()
    return timestamp >= startOfDay && timestamp <= endOfDay
  }, [])
  const groupData = useMemo(() => {
    const sortedList = [...threadsList].sort((a, b) => b.createdAt - a.createdAt)
    return sortedList.reduce((acc: Record<string, any>, item: any) => {
      const date = new Date(item.createdAt)
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
      if (!acc[startOfDay]) {
        acc[startOfDay] = []
      }
      acc[startOfDay].push(item)
      return acc
    }, {})
  }, [threadsList])
  const contentList = useMemo(() => {
    return Object.keys(groupData).map((time: string) => {
      const list = groupData[time]
      const isToday = getIsToday(Number(time))
      return {
        key: time,
        time: isToday ? <Trans>Today</Trans> : dayjs.tz(Number(time)).format('YYYY-MM-DD'),
        list: list.map((data: any) => {
          return {
            title: data.title,
            threadId: data.threadId,
          }
        })
      }
    })
  }, [groupData, getIsToday])
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
  return <AiThreadsListWrapper isOrderHis={isOrderHis}>
    <ContentWrapper>
      {isOrderHis
        ? <OrderHisTop>
          <BackArrow onClick={closeHistory} />
          <Trans>History</Trans>
        </OrderHisTop>
        : <TopContent>
          <AiTitle>
            <AssistantIcon />
            <span><Trans>AI Agent</Trans></span>
          </AiTitle>
          <EditButton onClick={addNewThread}>
            <IconBase className="icon-add" />
          </EditButton>
        </TopContent>}
      <ContentList className="scroll-style">
        {contentList.map((data: any) => {
          const { time, list, key } = data
          return <ContentItem key={key}>
            <span className="time">{time}</span>
            <TitleList>
              {list.map((data: any) => {
                const { title, threadId } = data
                const isActive = threadId === currentAiThreadId
                return <ListItem
                  key={threadId}
                  title={title}
                  threadId={threadId}
                  isActive={isActive}
                  closeHistory={closeHistory}
                />
              })}
            </TitleList>
          </ContentItem>
        })}
      </ContentList>
      {isOrderHis && <ButtonNew onClick={addNewThread}>
        <Trans>New Chat</Trans>
      </ButtonNew>}
    </ContentWrapper>
  </AiThreadsListWrapper>
})
