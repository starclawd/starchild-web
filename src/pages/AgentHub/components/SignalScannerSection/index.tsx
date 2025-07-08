import styled from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import AgentCard from './components/AgentCard'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import AgentList from './components/AgentList'
import { ROUTER } from 'pages/router'
import { useNavigate } from 'react-router-dom'

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  
  ${({ theme }) => theme.isMobile && `
    gap: ${vm(24)};
  `}
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  ${({ theme }) => theme.isMobile && `
    gap: ${vm(8)};
    padding: 0 ${vm(16)};
  `}
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  
  ${({ theme }) => theme.isMobile && `
    font-size: ${vm(20)};
  `}
`

const SectionDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;
  
  ${({ theme }) => theme.isMobile && `
    font-size: ${vm(14)};
  `}
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
  
  ${({ theme }) => theme.isMobile && `
    grid-template-columns: 1fr;
    gap: ${vm(16)};
  `}
`

const RunAgentCard = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 20px;
  padding: 32px;
  color: white;
  position: relative;
  overflow: hidden;
  grid-row: span 2; /* RunAgent占据2行 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    z-index: 1;
  }
  
  > * {
    position: relative;
    z-index: 2;
  }
  
  ${({ theme }) => theme.isMobile && `
    margin: 0 ${vm(16)};
    padding: ${vm(24)};
    border-radius: ${vm(16)};
    grid-row: span 1;
  `}
`

const RunAgentTitle = styled.h3`
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px 0;
  line-height: 1.2;
  
  ${({ theme }) => theme.isMobile && `
    font-size: ${vm(24)};
    margin-bottom: ${vm(12)};
  `}
`

const RunAgentDescription = styled.p`
  font-size: 16px;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.5;
  
  ${({ theme }) => theme.isMobile && `
    font-size: ${vm(14)};
    margin-bottom: ${vm(20)};
  `}
`

const RunAgentButton = styled(ButtonCommon)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }
  
  ${({ theme }) => theme.isMobile && `
    padding: ${vm(10)} ${vm(20)};
    border-radius: ${vm(10)};
    font-size: ${vm(14)};
  `}
`

const agentData = [
  {
    id: '1',
    title: 'Price Triggers',
    description: 'Set alerts when tokens hit key price levels. Monitor breakouts, breakdowns, and support/resistance zones.',
    creator: 'Annabelle',
    usageCount: 231930,
    avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png'
  },
  {
    id: '2',
    title: 'Technical Indicators',
    description: 'Track RSI, MACD, MA, and more. Get notified when conditions match bullish or bearish signals.',
    creator: 'Jax',
    usageCount: 76534,
    avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png'
  },
  {
    id: '3',
    title: 'Market Conditions',
    description: 'Volume spikes, volatility Detect volatility spikes and momentum shifts. React instantly to abnormal volume, new...',
    creator: 'Vaughn',
    usageCount: 76100,
    avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png'
  },
  {
    id: '4',
    title: 'Whale Tracker',
    description: 'Follow smart money and whale activity. Get alerts when large wallets move or buy significant tokens.',
    creator: 'Marcellus',
    usageCount: 50008,
    avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png'
  },
  {
    id: '5',
    title: 'On-chain Patterns',
    description: 'Monitor wallet flows, gas activity, TVL changes. Catch early signs of accumulation or distribution.',
    creator: 'Ezekiel',
    usageCount: 49194,
    avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png'
  },
  {
    id: '6',
    title: 'Sentiment Signals',
    description: 'Track social media trends and narratives. React to viral mentions, Twitter trends, and sentiment shifts.',
    creator: 'Camden',
    usageCount: 43242,
    avatar: 'https://oss.woo.network/static/symbol_logo/WOO.png'
  },
]

interface Category {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  hasCustomComponent: boolean
}

interface SignalScannerProps {
  category: Category
}

export default memo(function SignalScanner({ category }: SignalScannerProps) {
  const navigate = useNavigate()
  const handleRunAgent = () => {
    console.log('Run Agent clicked')
    // Handle run agent action
  }

  return (
    <SectionWrapper id={category.id}>
      <SectionHeader>
        <SectionTitle>{category.title}</SectionTitle>
        <SectionDescription>{category.description}</SectionDescription>
      </SectionHeader>

      <ContentWrapper>
        {/* RunAgent - 占据左侧2行 */}
        <RunAgentCard>
          <RunAgentTitle>See how your AI Agent would respond</RunAgentTitle>
          <RunAgentDescription>
            Send alerts for any tweets that could impact the price of $HYPE.
          </RunAgentDescription>
          <RunAgentButton onClick={handleRunAgent}>
            Run Agent →
          </RunAgentButton>
        </RunAgentCard>

        {/* AgentCards */}
        <AgentList agents={agentData} onAgentClick={(agent) => {
          console.log('Agent clicked:', agent)
        }} />
      </ContentWrapper>
      <ButtonBorder onClick={() => navigate(ROUTER.AGENT_HUB_SIGNAL)}>
        <Trans>View more</Trans>
      </ButtonBorder>
    </SectionWrapper>
  )
})

