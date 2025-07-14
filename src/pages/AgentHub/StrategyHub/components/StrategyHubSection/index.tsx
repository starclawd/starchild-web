import styled, { css } from 'styled-components'
import { memo, useState, useEffect } from 'react'
import { vm } from 'pages/helper'
import { ButtonBorder } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import { ROUTER } from 'pages/router'
import { useNavigate } from 'react-router-dom'
import PullUpRefresh from 'components/PullUpRefresh'
import AgentCardList from '../../../components/AgentCardList'
import { AgentThreadInfo } from 'store/agenthub/agenthub'

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

interface Category {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  hasCustomComponent: boolean
}

interface StrategyHubSectionProps {
  category: Category
  showViewMore?: boolean
  isLoading: boolean
  maxAgents?: number
  customAgents?: AgentThreadInfo[]
  onLoadMore?: () => void
  isLoadMoreLoading?: boolean
  hasLoadMore?: boolean
}

export default memo(function StrategyHubSection({
  category,
  showViewMore = true,
  isLoading = false,
  maxAgents,
  customAgents,
  onLoadMore,
  isLoadMoreLoading = false,
  hasLoadMore = true,
}: StrategyHubSectionProps) {
  const navigate = useNavigate()

  // 管理agents状态
  const [agents, setAgents] = useState<AgentThreadInfo[]>([])

  // 使用传入的自定义数据初始化agents状态
  useEffect(() => {
    if (customAgents) {
      setAgents(customAgents)
    }
  }, [customAgents])

  // 根据 maxAgents 限制显示数量
  const agentsToShow = agents.slice(0, maxAgents)

  const handleRunAgent = () => {
    console.log('Run Strategy Agent clicked')
    // Handle run strategy agent action
  }

  // AgentCardList组件
  const agentCardList = (
    <AgentCardList agents={agentsToShow} isLoading={isLoading} maxAgents={maxAgents} skeletonType='with-image' />
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
          {agentCardList}
        </PullUpRefresh>
      ) : (
        agentCardList
      )}

      {showViewMore && (
        <ButtonBorder onClick={() => navigate(ROUTER.AGENT_HUB_STRATEGY)}>
          <Trans>View more</Trans>
        </ButtonBorder>
      )}
    </SectionWrapper>
  )
})
