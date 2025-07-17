import { memo } from 'react'
import { AGENT_HUB_TYPE, SIGNAL_SCANNER } from 'constants/agentHub'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'

export default memo(function MobileSignalScanner() {
  return (
    <MobileAgentHubCategoryPage
      category={SIGNAL_SCANNER}
      filterType={AGENT_HUB_TYPE.SIGNAL_SCANNER}
      skeletonType='default'
    />
  )
})
