import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import noDataImg from 'assets/chat/no-data.png'
import discoverAgentsBg from 'assets/myagent/my-agent-discover-agents-bg.png'
import { vm } from 'pages/helper'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import Divider from 'components/Divider'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useAgentsRecommendList, useFetchAgentsRecommendList } from 'store/myagent/hooks'
import AgentCardList from 'pages/AgentHub/components/AgentCardList'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 60px;
  gap: 40px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(24)} ${vm(16)};
      gap: ${vm(40)};
    `}
`

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

const NoDataIcon = styled.img`
  width: 64px;
  height: 64px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(64)};
      height: ${vm(64)};
    `}
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(18)};
      line-height: ${vm(26)};
    `}
`

const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
    `}
`

const QuickStartSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
      line-height: ${vm(24)};
    `}
`

const DiscoverButton = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: 80px;
  background-image: url(${discoverAgentsBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-size: 18px;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: ${({ theme }) => theme.textL1};
  user-select: none;

  > span {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 24px;
  }

  .left-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon-chat-back {
    font-size: 24px;
    transform: rotate(180deg);
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(60)};
      font-size: ${vm(16)};

      > span {
        padding: 0 ${vm(16)};
      }

      .icon-chat-back {
        font-size: ${vm(24)};
      }
    `}
`

function EmptyOverview() {
  const [, setRouter] = useCurrentRouter()
  const { isLoading } = useFetchAgentsRecommendList()
  const [agentsRecommendList] = useAgentsRecommendList()
  const scrollRef = useScrollbarClass<HTMLDivElement>()

  const handleDiscoverAgents = useCallback(() => {
    setRouter(ROUTER.AGENT_HUB)
  }, [setRouter])

  return (
    <Wrapper ref={scrollRef} className='scroll-style'>
      <EmptyStateContainer>
        <NoDataIcon src={noDataImg} alt='no-data' />
        <Title>
          <Trans>You haven't subscribed to any agents yet.</Trans>
        </Title>
        <Subtitle>
          <Trans>Start with a few defaults or explore thousands of strategies in our Agent Marketplace.</Trans>
        </Subtitle>
      </EmptyStateContainer>

      <Divider />

      <QuickStartSection>
        <SectionTitle>
          <Trans>Quick Start with Default Agents</Trans>
        </SectionTitle>

        <AgentCardList
          agents={agentsRecommendList}
          showDescriptionButton={true}
          forceGoToDetail={true}
          isLoading={isLoading}
          maxAgents={3}
          skeletonType='with-image'
        />
      </QuickStartSection>

      <DiscoverButton onClick={handleDiscoverAgents}>
        <span>
          <div className='left-content'>
            <span className='icon-discover-agents' />
            <Trans>Discover Agents</Trans>
          </div>
          <span className='icon-chat-back' />
        </span>
      </DiscoverButton>
    </Wrapper>
  )
}

export default memo(EmptyOverview)
