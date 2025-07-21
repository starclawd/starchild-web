import { memo } from 'react'
import { AGENT_HUB_TYPE, TOKEN_DEEP_DIVE } from 'constants/agentHub'
import { useCurrentTokenInfo } from 'store/agenthub/hooks'
import AgentHubPage from '../components/AgentHubPage'
import TokenAgentList from './TokenAgentList'

export default memo(function TokenDeepDive() {
  const [currentTokenInfo] = useCurrentTokenInfo()

  if (currentTokenInfo) {
    return <TokenAgentList initialTag={currentTokenInfo.fullName} filterType={AGENT_HUB_TYPE.TOKEN_DEEP_DIVE} />
  }

  return <AgentHubPage category={TOKEN_DEEP_DIVE} filterType={AGENT_HUB_TYPE.TOKEN_DEEP_DIVE} skeletonType='default' />
})
