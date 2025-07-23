import styled, { css } from 'styled-components'
import { memo, useCallback, ReactNode } from 'react'
import { vm } from 'pages/helper'
import { BaseButton, ButtonBorder, ButtonCommon } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import { ROUTER } from 'pages/router'
import PullUpRefresh from 'components/PullUpRefresh'
import AgentCardList from '../AgentCardList'
import { AgentInfo, AgentCategory } from 'store/agenthub/agenthub'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { IconBase } from 'components/Icons'
import { useCurrentRouter } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding: ${vm(12)};
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
    `}
`

const SectionTitle = styled.h2`
  font-size: 26px;
  line-height: 34px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  text-transform: capitalize;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.26rem;
      line-height: 0.34rem;
    `}
`

const SectionDescription = styled.p`
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL3};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`

const SectionFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ViewMoreButton = styled(BaseButton)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  width: fit-content;
  height: 40px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.bgT10};
  border-radius: 8px;
  padding: 10px;
  gap: 4px;
  transition: background-color ${ANI_DURATION}s;

  &:hover {
    background: ${({ theme }) => theme.bgT20};
  }

  > i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      height: ${vm(40)};
      padding: ${vm(10)};
      border-radius: ${vm(8)};
      gap: ${vm(4)};
      > i {
        font-size: 0.18rem;
      }
    `}
`

interface AgentCardSectionProps {
  category: AgentCategory
  isSectionMode: boolean
  showViewMore?: boolean
  isLoading: boolean
  maxAgents?: number
  customAgents?: AgentInfo[]
  onLoadMore?: () => void
  isLoadMoreLoading?: boolean
  hasLoadMore?: boolean
  runAgentCard?: ReactNode
  skeletonType?: 'default' | 'with-image'
}

export default memo(function AgentCardSection({
  category,
  isSectionMode = false,
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
  const [, setCurrentRouter] = useCurrentRouter()

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
      {isSectionMode && (
        <SectionHeader>
          <SectionTitle>
            <Trans>{category.titleKey}</Trans>
          </SectionTitle>
          <SectionDescription>
            <Trans>{category.descriptionKey}</Trans>
          </SectionDescription>
        </SectionHeader>
      )}

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

      <SectionFooter>
        {showViewMore && (
          <ViewMoreButton onClick={() => setCurrentRouter(getRouteByCategory(category.id))}>
            <Trans>View more</Trans>
            <IconBase className='icon-chat-expand' />
          </ViewMoreButton>
        )}
      </SectionFooter>
    </SectionWrapper>
  )
})
