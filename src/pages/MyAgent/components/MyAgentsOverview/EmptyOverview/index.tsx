import { memo, useCallback, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import noDataImg from 'assets/chat/no-data.png'
import discoverAgentsBg from 'assets/myagent/my-agent-discover-agents-bg.png'
import { vm } from 'pages/helper'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { ANI_DURATION } from 'constants/index'
import AgentCardWithImage from 'pages/AgentHub/components/AgentCardList/components/AgentCardWithImage'
import Divider from 'components/Divider'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import {
  useAgentsRecommendList,
  useFetchAgentsRecommendList,
  useFetchMyAgentsOverviewList,
  useMyAgentsOverviewList,
} from 'store/myagent/hooks'
import Pending from 'components/Pending'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding-top: 80px;
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

const AgentCardList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      grid-template-columns: 1fr;
      gap: ${vm(12)};
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

// Mock data for default agents
const mockDefaultAgents: AgentCardProps[] = [
  {
    id: 1,
    agentId: 'agent-1',
    title: 'Overbought Signal Tracker',
    description: 'Be alerted when RSI hits overbought or oversold zones across major assets.',
    creator: 'Sage Porter',
    subscriberCount: 1394,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
    types: [AGENT_HUB_TYPE.SIGNAL_SCANNER],
    agentImageUrl: 'https://placehold.co/200x200/1a1a1a/00ff00?text=Signal',
    stats: {
      wins: 78,
      apr: '12.5%',
      tokens: ['BTC', 'ETH', 'SOL'],
    },
    tags: ['RSI', 'Overbought', 'Technical'],
  },
  {
    id: 2,
    agentId: 'agent-2',
    title: 'Volatility Spike Detector',
    description: 'Identify Bollinger band breakouts and sharp price moves in real-time.',
    creator: 'Cassian Trent',
    subscriberCount: 194,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cassian',
    types: [AGENT_HUB_TYPE.INDICATOR],
    agentImageUrl: 'https://placehold.co/200x200/1a1a1a/ff9900?text=Volatility',
    stats: {
      wins: 65,
      apr: '18.3%',
      tokens: ['BTC', 'ETH'],
    },
    tags: ['Bollinger', 'Volatility', 'Technical'],
  },
  {
    id: 3,
    agentId: 'agent-3',
    title: 'RSI Strategy Signal',
    description: 'Generate entry and exit signals using RSI-based trading strategies.',
    creator: 'Astra Wells',
    subscriberCount: 24,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Astra',
    types: [AGENT_HUB_TYPE.STRATEGY],
    agentImageUrl: 'https://placehold.co/200x200/1a1a1a/0099ff?text=Strategy',
    stats: {
      wins: 45,
      apr: '8.7%',
      tokens: ['SOL', 'AVAX'],
    },
    tags: ['RSI', 'Strategy', 'Entry/Exit'],
  },
]

function EmptyOverview() {
  const [, setRouter] = useCurrentRouter()
  const { isLoading } = useFetchAgentsRecommendList()
  const [agentsRecommendList] = useAgentsRecommendList()

  const handleDiscoverAgents = useCallback(() => {
    setRouter(ROUTER.AGENT_HUB)
  }, [setRouter])

  return (
    <Wrapper>
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
        <AgentCardList>
          {isLoading ? (
            <Pending />
          ) : (
            mockDefaultAgents.map((agent) => (
              <AgentCardWithImage key={agent.id} {...agent} showDescriptionButton={true} />
            ))
          )}
        </AgentCardList>
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
