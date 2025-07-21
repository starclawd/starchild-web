import { memo } from 'react'
import { AGENT_HUB_TYPE, KOL_RADAR } from 'constants/agentHub'
import AgentHubPage from '../components/AgentHubPage'
import useParsedQueryString from 'hooks/useParsedQueryString'

export default memo(function KolRadar() {
  const { kolId } = useParsedQueryString()

  return (
    <AgentHubPage category={KOL_RADAR} filterType={AGENT_HUB_TYPE.KOL_RADAR} filterTag={kolId} skeletonType='default' />
  )
})
