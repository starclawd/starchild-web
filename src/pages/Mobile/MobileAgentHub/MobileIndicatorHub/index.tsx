import { memo } from 'react'
import { AGENT_HUB_TYPE, INDICATOR_HUB } from 'constants/agentHub'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'

export default memo(function MobileIndicatorHub() {
  return (
    <MobileAgentHubCategoryPage
      category={INDICATOR_HUB}
      filterType={AGENT_HUB_TYPE.INDICATOR}
      skeletonType='with-image'
    />
  )
})
