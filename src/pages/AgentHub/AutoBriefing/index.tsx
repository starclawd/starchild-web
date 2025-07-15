import { memo } from 'react'
import { AGENT_HUB_TYPE, AUTO_BRIEFING } from 'constants/agentHub'
import AgentHubPage from '../components/AgentHubPage'

export default memo(function AutoBriefing() {
  return <AgentHubPage category={AUTO_BRIEFING} filterType={AGENT_HUB_TYPE.AUTO_BRIEFING} skeletonType='default' />
})
