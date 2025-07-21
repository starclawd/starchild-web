import styled, { css } from 'styled-components'
import { memo, useCallback, useState } from 'react'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import PullUpRefresh from 'components/PullUpRefresh'
import AgentTableRow from './AgentTableRow'
import { Skeleton, SkeletonAvatar, SkeletonText } from 'components/Skeleton'
import { AgentInfo } from 'store/agenthub/agenthub'
import { useIsMobile } from 'store/application/hooks'
import NoData from 'components/NoData'

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.bgL0};
  border-radius: 8px;
  overflow: hidden;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-radius: ${vm(8)};
    `}
`

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: ${({ theme }) => theme.bgL0};
  border-bottom: 1px solid ${({ theme }) => theme.bgL2};
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
      font-size: ${vm(11)};
      line-height: ${vm(16)};
    `}
`

const HeaderAgentTitle = styled.div`
  flex: 1;
  padding-right: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding-right: ${vm(12)};
    `}
`

const HeaderCreator = styled.div`
  width: 200px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 120px;
    `}
`

const HeaderSubscribers = styled.div`
  width: 120px;
  text-align: right;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 80px;
    `}
`

const TableBody = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 600px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      max-height: 500px;
    `}
`

const TableContent = styled.div`
  padding: 0 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(16)};
    `}
`

// 骨架屏行组件样式
const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.bgL2};

  &:last-child {
    border-bottom: none;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} 0;
    `}
`

const SkeletonDescription = styled.div`
  flex: 1;
  padding-right: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding-right: ${vm(12)};
    `}
`

const SkeletonCreator = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 120px;
      gap: ${vm(6)};
    `}
`

const SkeletonSubscriber = styled.div`
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 80px;
    `}
`

interface AgentTableProps {
  agents: AgentInfo[]
  isLoading?: boolean
  onLoadMore?: () => Promise<void>
  hasLoadMore?: boolean
  isLoadMoreLoading?: boolean
}

export default memo(function AgentTable({
  agents,
  isLoading = false,
  onLoadMore,
  hasLoadMore = false,
  isLoadMoreLoading = false,
}: AgentTableProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isMobile = useIsMobile()

  const handleRefresh = useCallback(async () => {
    if (onLoadMore && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onLoadMore()
      } finally {
        setIsRefreshing(false)
      }
    }
  }, [onLoadMore, isRefreshing])

  // 渲染骨架屏行
  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <SkeletonRow key={index}>
        <SkeletonDescription>
          <SkeletonText width='80%' />
        </SkeletonDescription>
        <SkeletonCreator>
          <SkeletonText width='80px' />
        </SkeletonCreator>
        <SkeletonSubscriber>
          <SkeletonText width='60px' />
        </SkeletonSubscriber>
      </SkeletonRow>
    ))
  }

  const renderContent = () => {
    if (isLoading) {
      return <TableContent>{renderSkeletonRows()}</TableContent>
    }

    if (agents.length === 0) {
      return <NoData />
    }

    return (
      <TableContent>
        {agents.map((agent) => (
          <AgentTableRow key={agent.agentId} agent={agent} />
        ))}
      </TableContent>
    )
  }

  return (
    <TableContainer>
      {!isMobile && (
        <TableHeader>
          <HeaderAgentTitle>
            <Trans>Agent title</Trans>
          </HeaderAgentTitle>
          <HeaderCreator>
            <Trans>Created by</Trans>
          </HeaderCreator>
          <HeaderSubscribers>
            <Trans>Subscribers</Trans>
          </HeaderSubscribers>
        </TableHeader>
      )}
      <TableBody>
        <PullUpRefresh
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          setIsRefreshing={setIsRefreshing}
          disabledPull={!hasLoadMore || isLoadMoreLoading}
          hasLoadMore={hasLoadMore}
        >
          {renderContent()}
        </PullUpRefresh>
      </TableBody>
    </TableContainer>
  )
})
