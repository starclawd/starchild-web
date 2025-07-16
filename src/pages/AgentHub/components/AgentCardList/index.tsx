import { memo, ReactNode } from 'react'
import { AgentInfo } from 'store/agenthub/agenthub'
import AgentCardWithImage from './components/AgentCardWithImage'
import AgentCard from './components/AgentCard'
import AgentCardSkeleton from './components/AgentCardSkeleton'
import AgentCardWithImageSkeleton from './components/AgentCardWIthImageSkeleton'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import NoData from 'components/NoData'
import { styled, css } from 'styled-components'
import { vm } from 'pages/helper'
import TokenCard from './components/TokenCard'

type SkeletonType = 'default' | 'with-image'

const ContentWrapper = styled.div<{ $hasImageCard: boolean }>`
  display: grid;
  grid-template-columns: ${({ $hasImageCard }) => ($hasImageCard ? '1fr 1fr 1fr' : '1fr 1fr')};
  gap: ${({ $hasImageCard }) => ($hasImageCard ? '20px' : '32px')};
  align-items: start;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      grid-template-columns: 1fr;
      gap: ${vm(16)};
    `}
`

interface AgentCardListProps {
  agents: AgentInfo[]
  isLoading?: boolean
  maxAgents?: number
  skeletonType?: SkeletonType
  runAgentCard?: ReactNode
}

export default memo(function AgentCardList({
  agents,
  isLoading = false,
  maxAgents,
  skeletonType = 'default',
  runAgentCard,
}: AgentCardListProps) {
  // 判断是否有带图片的卡片类型
  // 如果正在加载，根据skeletonType决定；否则根据agents的类型决定
  const hasImageCard = isLoading
    ? skeletonType === 'with-image'
    : agents.some((agent) => agent.type === AGENT_HUB_TYPE.INDICATOR || agent.type === AGENT_HUB_TYPE.STRATEGY)

  // 如果正在加载，显示骨架屏
  if (isLoading) {
    const SkeletonComponent = skeletonType === 'with-image' ? AgentCardWithImageSkeleton : AgentCardSkeleton
    return (
      <ContentWrapper $hasImageCard={hasImageCard}>
        {runAgentCard}
        {Array.from({ length: maxAgents || 6 }).map((_, index) => (
          <SkeletonComponent key={`skeleton-${index}`} />
        ))}
      </ContentWrapper>
    )
  }

  // 如果没有数据，显示空状态
  if (!agents.length) {
    return <NoData />
  }

  // 渲染实际的agent列表
  return (
    <ContentWrapper $hasImageCard={hasImageCard}>
      {runAgentCard}
      {agents.map((agent) => {
        if (agent.type === AGENT_HUB_TYPE.TOKEN_DEEP_DIVE) {
          return <TokenCard key={agent.agentId} {...agent} />
        } else if (hasImageCard) {
          return <AgentCardWithImage key={agent.agentId} {...agent} />
        } else {
          return <AgentCard key={agent.agentId} {...agent} />
        }
      })}
    </ContentWrapper>
  )
})
