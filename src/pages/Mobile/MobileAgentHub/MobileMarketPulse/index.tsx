import { memo } from 'react'
import { AGENT_HUB_TYPE, MARKET_PULSE } from 'constants/agentHub'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'

export default memo(function MobileMarketPulse() {
  return (
    <MobileAgentHubCategoryPage
      category={MARKET_PULSE}
      filterType={AGENT_HUB_TYPE.MARKET_PULSE}
      skeletonType='default'
    />
  )
})
