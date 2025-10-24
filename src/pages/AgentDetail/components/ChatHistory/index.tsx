import { useMemo, useRef, useState, useCallback } from 'react'
import { useIsGeneratingCode, useIsRunningBacktestAgent } from 'store/agentdetail/hooks'
import styled, { css } from 'styled-components'
import Thinking from '../Thinking'
import Pending from 'components/Pending'
import { AgentDetailDataType, BacktestDataType } from 'store/agentdetail/agentdetail'
import CheckedLogs from '../CheckedLogs'
import { useGetTriggerHistory } from 'store/myagent/hooks'
import PullUpRefresh from 'components/PullUpRefresh'
import ChatHistoryContent from './components/HistoryContent'

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
  const { trigger_history, check_log, id } = agentDetailData
  const isRunningBacktestAgent = useIsRunningBacktestAgent(agentDetailData, backtestData)
  const isGeneratingCode = useIsGeneratingCode(agentDetailData)

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
  // 如果外层已经处理了分页（移动版），则不使用内部的 PullUpRefresh
  if (externalPaginationResult) {
    return (
      <ChatHistoryWrapper>
        <ChatHistoryContent list={list} />
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
        <ChatHistoryContent list={list} />
      </PullUpRefresh>
    </ChatHistoryWrapper>
  )
}
