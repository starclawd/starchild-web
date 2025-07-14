import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { ButtonBorder } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import AgentCardList from '../../../components/AgentCardList'
import { ROUTER } from 'pages/router'
import { useNavigate } from 'react-router-dom'
import { AgentThreadInfo } from 'store/agenthub/agenthub'
import PullUpRefresh from 'components/PullUpRefresh'
import AgentCardSkeleton from '../../../components/AgentCardList/components/AgentCardSkeleton'

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(24)};
    `}
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: 0 ${vm(16)};
    `}
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(20)};
    `}
`

const SectionDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
    `}
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      grid-template-columns: 1fr;
      gap: ${vm(16)};
    `}
`

interface Category {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  hasCustomComponent: boolean
}

interface KolRadarSectionProps {
  category: Category
  showViewMore?: boolean
  isLoading: boolean
  maxAgents?: number
  customAgents?: AgentThreadInfo[]
  onLoadMore?: () => void
  isLoadMoreLoading?: boolean
  hasLoadMore?: boolean
}

export default memo(function KolRadarSection({
  category,
  showViewMore = true,
  isLoading = false,
  maxAgents,
  customAgents,
  onLoadMore,
  isLoadMoreLoading = false,
  hasLoadMore = true,
}: KolRadarSectionProps) {
  const navigate = useNavigate()

  // 使用传入的自定义数据，并根据 maxAgents 限制显示数量
  const agentsToShow = customAgents?.slice(0, maxAgents) || []

  // 渲染内容区域
  const renderContent = () => (
    <ContentWrapper>
      {isLoading ? (
        Array.from({ length: maxAgents || 6 }).map((_, index) => <AgentCardSkeleton key={`skeleton-${index}`} />)
      ) : (
        <AgentCardList agents={agentsToShow || []} />
      )}
    </ContentWrapper>
  )

  return (
    <SectionWrapper id={category.id}>
      <SectionHeader>
        <SectionTitle>{category.title}</SectionTitle>
        <SectionDescription>{category.description}</SectionDescription>
      </SectionHeader>

      {/* 如果有 onLoadMore 回调，使用 PullUpRefresh 包裹 */}
      {onLoadMore ? (
        <PullUpRefresh
          onRefresh={onLoadMore}
          isRefreshing={isLoading || isLoadMoreLoading}
          disabledPull={isLoading || isLoadMoreLoading}
          setIsRefreshing={() => {}}
          hasLoadMore={hasLoadMore}
        >
          {renderContent()}
        </PullUpRefresh>
      ) : (
        renderContent()
      )}

      {showViewMore && (
        <ButtonBorder onClick={() => navigate(ROUTER.AGENT_HUB_KOL)}>
          <Trans>View more</Trans>
        </ButtonBorder>
      )}
    </SectionWrapper>
  )
})
