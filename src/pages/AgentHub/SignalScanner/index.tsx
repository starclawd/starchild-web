import { memo } from 'react'
import { AGENT_HUB_TYPE, SIGNAL_SCANNER } from 'constants/agentHub'
import AgentHubPage from '../components/AgentHubPage'

export default memo(function SignalScanner() {
  return <AgentHubPage category={SIGNAL_SCANNER} filterType={AGENT_HUB_TYPE.SIGNAL_SCANNER} skeletonType='default' />
})
