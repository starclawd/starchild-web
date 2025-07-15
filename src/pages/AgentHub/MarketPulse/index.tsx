import { memo } from 'react'
import { AGENT_HUB_TYPE, MARKET_PULSE } from 'constants/agentHub'
import AgentHubPage from '../components/AgentHubPage'

export default memo(function MarketPulse() {
  return <AgentHubPage category={MARKET_PULSE} filterType={AGENT_HUB_TYPE.MARKET_PULSE} skeletonType='default' />
})
