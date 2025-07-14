import { memo } from 'react'
import { AgentThreadInfo } from 'store/agenthub/agenthub'
import AgentCardWithImage from './components/AgentCardWithImage'
import AgentCard from './components/AgentCard'
import { AGENT_HUB_TYPE } from 'constants/agentHub'

interface AgentCardListProps {
  agents: AgentThreadInfo[]
}

export default memo(function AgentCardList({ agents }: AgentCardListProps) {
  return agents.map((agent) => {
    if (agent.type === AGENT_HUB_TYPE.INDICATOR || agent.type === AGENT_HUB_TYPE.STRATEGY) {
      return <AgentCardWithImage key={agent.threadId} {...agent} />
    } else {
      return <AgentCard key={agent.threadId} {...agent} />
    }
  })
})
