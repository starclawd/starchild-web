import styled, { css } from 'styled-components'
import { memo, useCallback, useState, useRef } from 'react'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import PullUpRefresh from 'components/PullUpRefresh'
import AgentTableRow from './AgentTableRow'
import { Skeleton, SkeletonAvatar, SkeletonMultilineText, SkeletonText } from 'components/Skeleton'
import { AgentInfo } from 'store/agenthub/agenthub'
import { useIsMobile } from 'store/application/hooks'
import NoData from 'components/NoData'

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.bgT20};
  font-size: 13px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL4};
  font-weight: 400;
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
`

const TableContent = styled.div`
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0;
    `}
`

const MobileSkeletonRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${vm(16)} ${vm(20)};
  gap: ${vm(12)};
`

const MobileSkeletonDescription = styled.div`
  width: 100%;
  font-size: 0.14rem;
  line-height: 0.2rem;
`

const MobileSkeletonCreatorAndSubscriber = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${vm(8)};
`

// 骨架屏行组件样式
const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.bgL2};

  &:last-child {
    border-bottom: none;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)} ${vm(12)};
    `}
`

const SkeletonDescription = styled.div`
  flex: 1;
  padding-right: 16px;
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
  const isRefreshingRef = useRef(false)

  const handleRefresh = useCallback(async () => {
    // 使用ref和state双重检查，确保在React状态异步更新时也能正确防重
    if (onLoadMore && !isRefreshing && !isRefreshingRef.current) {
      setIsRefreshing(true)
      isRefreshingRef.current = true
      try {
        await onLoadMore()
      } catch (error) {
        console.error('Load more failed:', error)
        throw error
      } finally {
        setIsRefreshing(false)
        isRefreshingRef.current = false
      }
    }
  }, [onLoadMore, isRefreshing])

  // 渲染骨架屏行
  const renderSkeletonRows = () => {
    return Array.from({ length: 6 }).map((_, index) =>
      isMobile ? (
        <MobileSkeletonRow key={index}>
          <MobileSkeletonDescription>
            <SkeletonMultilineText lines={2} />
          </MobileSkeletonDescription>
          <MobileSkeletonCreatorAndSubscriber>
            <SkeletonText width={'40%'} />
            <SkeletonText width={'30%'} />
          </MobileSkeletonCreatorAndSubscriber>
        </MobileSkeletonRow>
      ) : (
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
      ),
    )
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
