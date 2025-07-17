import { memo } from 'react'
import { AGENT_HUB_TYPE, STRATEGY_HUB } from 'constants/agentHub'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'

export default memo(function MobileStrategyHub() {
  return (
    <MobileAgentHubCategoryPage
      category={STRATEGY_HUB}
      filterType={AGENT_HUB_TYPE.STRATEGY}
      skeletonType='with-image'
    />
  )
})
