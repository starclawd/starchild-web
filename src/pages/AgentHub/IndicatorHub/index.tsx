import { memo } from 'react'
import { AGENT_HUB_TYPE, INDICATOR_HUB } from 'constants/agentHub'
import AgentHubPage from '../components/AgentHubPage'

export default memo(function IndicatorHub() {
  return <AgentHubPage category={INDICATOR_HUB} filterType={AGENT_HUB_TYPE.INDICATOR} skeletonType='with-image' />
})
