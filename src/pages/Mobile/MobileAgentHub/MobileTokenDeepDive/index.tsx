import { memo } from 'react'
import { AGENT_HUB_TYPE, TOKEN_DEEP_DIVE } from 'constants/agentHub'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'
import useParsedQueryString from 'hooks/useParsedQueryString'

export default memo(function MobileTokenDeepDive() {
  const { tokenId } = useParsedQueryString()

  return (
    <MobileAgentHubCategoryPage
      category={TOKEN_DEEP_DIVE}
      filterType={AGENT_HUB_TYPE.TOKEN_DEEP_DIVE}
      filterTag={tokenId}
      skeletonType='default'
    />
  )
})
