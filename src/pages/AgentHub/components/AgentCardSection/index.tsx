import styled, { css } from 'styled-components'
import { memo, useCallback, ReactNode } from 'react'
import { vm } from 'pages/helper'
import { ButtonBorder } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import { ROUTER } from 'pages/router'
import { useNavigate } from 'react-router-dom'
import PullUpRefresh from 'components/PullUpRefresh'
import AgentCardList from '../AgentCardList'
import { AgentThreadInfo, AgentCategory } from 'store/agenthub/agenthub'
import { AGENT_HUB_TYPE } from 'constants/agentHub'

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

interface AgentCardSectionProps {
  category: AgentCategory
  showViewMore?: boolean
  isLoading: boolean
  maxAgents?: number
  customAgents?: AgentThreadInfo[]
  onLoadMore?: () => void
  isLoadMoreLoading?: boolean
  hasLoadMore?: boolean
  runAgentCard?: ReactNode
  skeletonType?: 'default' | 'with-image'
}

export default memo(function AgentCardSection({
  category,
  showViewMore = true,
  isLoading = false,
  maxAgents,
  customAgents,
  onLoadMore,
  isLoadMoreLoading = false,
  hasLoadMore = true,
  runAgentCard,
  skeletonType = 'default',
}: AgentCardSectionProps) {
  const navigate = useNavigate()

  // 根据category获取对应的路由
  const getRouteByCategory = useCallback((categoryId: string) => {
    const routeMap: Record<string, string> = {
      [AGENT_HUB_TYPE.INDICATOR]: ROUTER.AGENT_HUB_INDICATOR,
      [AGENT_HUB_TYPE.STRATEGY]: ROUTER.AGENT_HUB_STRATEGY,
      [AGENT_HUB_TYPE.SIGNAL_SCANNER]: ROUTER.AGENT_HUB_SIGNAL,
      [AGENT_HUB_TYPE.KOL_RADAR]: ROUTER.AGENT_HUB_KOL,
      [AGENT_HUB_TYPE.AUTO_BRIEFING]: ROUTER.AGENT_HUB_BRIEFING,
      [AGENT_HUB_TYPE.MARKET_PULSE]: ROUTER.AGENT_HUB_PULSE,
      [AGENT_HUB_TYPE.TOKEN_DEEP_DIVE]: ROUTER.AGENT_HUB_DEEP_DIVE,
    }
    return routeMap[categoryId] || ROUTER.AGENT_HUB
  }, [])

  // 使用传入的自定义数据，并根据 maxAgents 限制显示数量
  const agentsToShow = customAgents?.slice(0, maxAgents) || []

  // AgentCardList组件
  const agentCardList = (
    <AgentCardList
      agents={agentsToShow}
      isLoading={isLoading}
      maxAgents={maxAgents}
      skeletonType={skeletonType}
      runAgentCard={runAgentCard}
    />
  )

  return (
    <SectionWrapper id={category.id}>
      <SectionHeader>
        <SectionTitle>
          <Trans>{category.titleKey}</Trans>
        </SectionTitle>
        <SectionDescription>
          <Trans>{category.descriptionKey}</Trans>
        </SectionDescription>
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
          {agentCardList}
        </PullUpRefresh>
      ) : (
        agentCardList
      )}

      {showViewMore && (
        <ButtonBorder onClick={() => navigate(getRouteByCategory(category.id))}>
          <Trans>View more</Trans>
        </ButtonBorder>
      )}
    </SectionWrapper>
  )
})
