import { memo } from 'react'
import { AGENT_HUB_TYPE, KOL_RADAR } from 'constants/agentHub'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'

export default memo(function MobileKolRadar() {
  return (
    <MobileAgentHubCategoryPage category={KOL_RADAR} filterType={AGENT_HUB_TYPE.KOL_RADAR} skeletonType='default' />
  )
})
