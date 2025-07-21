import { memo } from 'react'
import { AGENT_HUB_TYPE, TOKEN_DEEP_DIVE } from 'constants/agentHub'
import AgentHubPage from '../components/AgentHubPage'
import useParsedQueryString from 'hooks/useParsedQueryString'

export default memo(function TokenDeepDive() {
  const { tokenId } = useParsedQueryString()

  return (
    <AgentHubPage
      category={TOKEN_DEEP_DIVE}
      filterType={AGENT_HUB_TYPE.TOKEN_DEEP_DIVE}
      filterTag={tokenId}
      skeletonType='default'
    />
  )
})
