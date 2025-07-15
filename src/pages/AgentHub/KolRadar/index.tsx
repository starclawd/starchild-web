import { memo } from 'react'
import { AGENT_HUB_TYPE, KOL_RADAR } from 'constants/agentHub'
import AgentHubPage from '../components/AgentHubPage'

export default memo(function KolRadar() {
  return <AgentHubPage category={KOL_RADAR} filterType={AGENT_HUB_TYPE.KOL_RADAR} skeletonType='default' />
})
