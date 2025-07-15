import { memo } from 'react'
import { AGENT_HUB_TYPE, STRATEGY_HUB } from 'constants/agentHub'
import AgentHubPage from '../components/AgentHubPage'

export default memo(function StrategyHub() {
  return <AgentHubPage category={STRATEGY_HUB} filterType={AGENT_HUB_TYPE.STRATEGY} skeletonType='with-image' />
})
