import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { ROUTER } from 'pages/router'
import AgentTableListPage from '../../components/AgentTableList'

export default memo(function KolAgentList() {
  const { kolId } = useParams<{ kolId: string }>()

  return (
    <AgentTableListPage
      initialTag={kolId || ''}
      filterType={AGENT_HUB_TYPE.KOL_RADAR}
      backRoute={ROUTER.AGENT_HUB_KOL}
      title={kolId || ''}
      description={kolId || ''}
      backButtonText={AGENT_HUB_TYPE.KOL_RADAR}
    />
  )
})
