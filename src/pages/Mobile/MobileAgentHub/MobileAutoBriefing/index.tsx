import { memo } from 'react'
import { AGENT_HUB_TYPE, AUTO_BRIEFING } from 'constants/agentHub'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'

export default memo(function MobileAutoBriefing() {
  return (
    <MobileAgentHubCategoryPage
      category={AUTO_BRIEFING}
      filterType={AGENT_HUB_TYPE.AUTO_BRIEFING}
      skeletonType='default'
    />
  )
})
