import { memo } from 'react'
import { AGENT_HUB_TYPE, KOL_RADAR } from 'store/agenthub/agenthub.d'
import MobileAgentHubCategoryPage from '../components/MobileAgentHubCategoryPage'
import { useCurrentKolInfo } from 'store/agenthub/hooks'
import KolAgentList from 'pages/AgentHub/KolRadar/KolAgentList'

export default memo(function MobileKolRadar() {
  const [currentKolInfo] = useCurrentKolInfo()

  if (currentKolInfo) {
    return <KolAgentList initialTag={currentKolInfo.name} filterType={AGENT_HUB_TYPE.KOL_RADAR} />
  }
  return (
    <MobileAgentHubCategoryPage category={KOL_RADAR} filterType={AGENT_HUB_TYPE.KOL_RADAR} skeletonType='default' />
  )
})
