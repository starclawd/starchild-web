import { memo } from 'react'
import { AGENT_HUB_TYPE, TOKEN_DEEP_DIVE } from 'store/agenthub/agenthub.d'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'
import { useCurrentTokenInfo } from 'store/agenthub/hooks'
import TokenAgentList from 'pages/AgentHub/TokenDeepDive/TokenAgentList'

export default memo(function MobileTokenDeepDive() {
  const [currentTokenInfo] = useCurrentTokenInfo()

  if (currentTokenInfo) {
    return <TokenAgentList initialTag={currentTokenInfo.fullName} filterType={AGENT_HUB_TYPE.TOKEN_DEEP_DIVE} />
  }

  return (
    <MobileAgentHubCategoryPage
      category={TOKEN_DEEP_DIVE}
      filterType={AGENT_HUB_TYPE.TOKEN_DEEP_DIVE}
      skeletonType='default'
    />
  )
})
