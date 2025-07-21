import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { ROUTER } from 'pages/router'
import AgentTableListPage from '../../components/AgentTableList'

export default memo(function TokenAgentList() {
  const { tokenId } = useParams<{ tokenId: string }>()

  return (
    <AgentTableListPage
      initialTag={tokenId || ''}
      filterType={AGENT_HUB_TYPE.TOKEN_DEEP_DIVE}
      backRoute={ROUTER.AGENT_HUB_DEEP_DIVE}
      title={tokenId || ''}
      description={tokenId || ''}
      backButtonText={AGENT_HUB_TYPE.TOKEN_DEEP_DIVE}
    />
  )
})
