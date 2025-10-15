import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import useCopyContent from 'hooks/useCopyContent'
import { vm } from 'pages/helper'
import { useMemo, useRef, useState, useCallback } from 'react'
import { useIsGeneratingCode, useIsRunningBacktestAgent } from 'store/agentdetail/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderBottom1PxBox } from 'styles/borderStyled'
import { useTimezone } from 'store/timezonecache/hooks'
import { useIsMobile } from 'store/application/hooks'
import Thinking from '../Thinking'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import { AgentDetailDataType, BacktestDataType } from 'store/agentdetail/agentdetail'
import CheckedLogs from '../CheckedLogs'
import { useGetTriggerHistory } from 'store/myagent/hooks'
import PullUpRefresh from 'components/PullUpRefresh'

const ChatHistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  .pull-up-children {
    align-items: center;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: fit-content;
      min-width: 100%;
    `}
`

const ChatInnerContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  height: 100%;
  width: 100%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      overflow: auto;
    `}
`

const ChatHistoryItem = styled(BorderBottom1PxBox)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
  padding-bottom: 40px;
  margin-bottom: 40px;
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(28)};
      padding-bottom: ${vm(40)};
      margin-bottom: ${vm(40)};
      &:last-child {
        margin-bottom: 0;
        border-bottom: none;
        padding-bottom: 0;
      }
    `}
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(28)};
    `}
`

const Title = styled.div`
  .markdown-wrapper {
    font-size: 26px;
    font-weight: 500;
    line-height: 34px;
    color: ${({ theme }) => theme.textL1};
    em {
      font-style: normal;
    }
    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: 0.26rem;
        line-height: 0.34rem;
      `}
  }
`

const UpdateTime = styled.div`
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`

const Content = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.textL2};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      line-height: 0.26rem;
    `}
`

const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  .icon-chat-copy {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(4)};
          font-size: 0.14rem;
          line-height: 0.2rem;
          .icon-chat-copy {
            font-size: 0.18rem;
          }
        `
      : css`
          cursor: pointer;
        `}
`

export default function ChatHistory({
  agentDetailData,
  backtestData,
  paginationResult: externalPaginationResult,
  shouldUsePagination: externalShouldUsePagination,
}: {
  agentDetailData: AgentDetailDataType
  backtestData: BacktestDataType
  paginationResult?: any
  shouldUsePagination?: boolean
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [timezone] = useTimezone()
  const { trigger_history, check_log, id } = agentDetailData
  const isRunningBacktestAgent = useIsRunningBacktestAgent(agentDetailData, backtestData)
  const isGeneratingCode = useIsGeneratingCode(agentDetailData)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const { copyFromElement } = useCopyContent({ mode: 'element' })

  // 如果外层传递了分页参数，使用外层的；否则使用自己的分页逻辑
  const shouldUsePagination =
    externalShouldUsePagination !== undefined
      ? externalShouldUsePagination
      : useMemo(() => {
          return Array.isArray(trigger_history) && trigger_history.length > 0
        }, [trigger_history])

  // 条件性使用分页功能 - 如果外层已经处理分页，则不再重复调用
  const internalPaginationResult = useGetTriggerHistory(
    externalPaginationResult ? '' : shouldUsePagination ? id?.toString() || '' : '',
  )

  const paginationResult = externalPaginationResult || internalPaginationResult

  const [isRefreshing, setIsRefreshing] = useState(false)

  // 只使用分页API获取的数据
  const list = useMemo(() => {
    if (shouldUsePagination) {
      // 如果启用分页，只使用分页API获取的数据
      const historyData = paginationResult.triggerHistory || []

      if (!Array.isArray(historyData)) {
        return []
      }
      return [...historyData]
        .sort((a, b) => b.trigger_time - a.trigger_time)
        .map((item: any) => {
          return {
            updateTime: item?.trigger_time || 0,
            content: item?.message || item?.error || '',
          }
        })
    } else {
      // 如果不启用分页，直接使用原有的trigger_history
      if (!Array.isArray(trigger_history)) {
        return []
      }
      return [...trigger_history]
        .sort((a, b) => b.trigger_time - a.trigger_time)
        .map((item: AgentDetailDataType['trigger_history'][number]) => {
          return {
            updateTime: item?.trigger_time || 0,
            content: item?.message || item?.error || '',
          }
        })
    }
  }, [shouldUsePagination, paginationResult.triggerHistory, trigger_history])

  const handleCopy = (index: number) => {
    const contentElement = contentRefs.current[index]
    if (contentElement) {
      copyFromElement(contentElement)
    }
  }

  // 处理加载更多
  const handleLoadMore = useCallback(async () => {
    if (shouldUsePagination && paginationResult.hasNextPage && !paginationResult.isLoadingMore) {
      await paginationResult.loadMoreTriggerHistory()
      setIsRefreshing(false)
    }
  }, [shouldUsePagination, paginationResult])

  if (isGeneratingCode || isRunningBacktestAgent) {
    return <Thinking agentDetailData={agentDetailData} backtestData={backtestData} />
  }

  // 如果启用分页功能且正在加载，显示Pending
  if (shouldUsePagination && paginationResult.isLoading) {
    return (
      <ChatHistoryWrapper>
        <Pending isFetching={paginationResult.isLoading} />
      </ChatHistoryWrapper>
    )
  }

  if (list.length === 0 && check_log) {
    return <CheckedLogs agentDetailData={agentDetailData} />
  }

  const RenderContent = () => {
    return (
      <ChatInnerContent>
        {list.length > 0 ? (
          list.map((item: any, index: number) => {
            const { updateTime, content, error } = item
            const splitContent = content.split('\n\n')
            const title = splitContent[0]
            const messageContent = splitContent.slice(1).join('\n\n')
            const formatTime = dayjs.tz(updateTime, timezone).format('YYYY-MM-DD HH:mm:ss')
            return (
              <ChatHistoryItem key={index} $borderColor={theme.lineDark8}>
                <ContentWrapper
                  ref={(el) => {
                    contentRefs.current[index] = el
                  }}
                >
                  <Title>
                    <Markdown>{title}</Markdown>
                  </Title>
                  <UpdateTime>
                    <Trans>Trigger time: {formatTime}</Trans>
                  </UpdateTime>
                  <Content>
                    <Markdown>{messageContent}</Markdown>
                  </Content>
                </ContentWrapper>
                <CopyWrapper onClick={() => handleCopy(index)}>
                  <IconBase className='icon-chat-copy' />
                  <Trans>Copy</Trans>
                </CopyWrapper>
              </ChatHistoryItem>
            )
          })
        ) : (
          <NoData />
        )}
      </ChatInnerContent>
    )
  }
  // 如果外层已经处理了分页（移动版），则不使用内部的 PullUpRefresh
  if (externalPaginationResult) {
    return (
      <ChatHistoryWrapper>
        <RenderContent />
      </ChatHistoryWrapper>
    )
  }

  // PC版或没有外层分页处理时，使用内部的 PullUpRefresh
  return (
    <ChatHistoryWrapper>
      <PullUpRefresh
        onRefresh={handleLoadMore}
        isRefreshing={isRefreshing}
        setIsRefreshing={setIsRefreshing}
        disabledPull={!shouldUsePagination || !paginationResult.hasNextPage}
        hasLoadMore={shouldUsePagination && paginationResult.hasNextPage}
        enableWheel={true}
        wheelThreshold={50}
      >
        <RenderContent />
      </PullUpRefresh>
    </ChatHistoryWrapper>
  )
}
