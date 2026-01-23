import { memo } from 'react'
import { AGENT_HUB_TYPE, KOL_RADAR } from 'store/agenthub/agenthub.d'
import { useCurrentKolInfo } from 'store/agenthub/hooks'
import AgentHubPage from '../components/AgentHubPage'
import KolAgentList from './KolAgentList'

export default memo(function KolRadar() {
  const [currentKolInfo] = useCurrentKolInfo()

  if (currentKolInfo) {
    return <KolAgentList initialTag={currentKolInfo.name} filterType={AGENT_HUB_TYPE.KOL_RADAR} />
  }

  return <AgentHubPage category={KOL_RADAR} filterType={AGENT_HUB_TYPE.KOL_RADAR} skeletonType='default' />
})
