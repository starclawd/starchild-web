import { memo } from 'react'
import AgentCard from '../AgentCard'
import { SignalScannerAgent } from 'store/agenthub/agenthub'

interface AgentListProps {
  agents: SignalScannerAgent[]
}

export default memo(function AgentList({ agents }: AgentListProps) {
  return agents.map((agent) => (
    <AgentCard
      key={agent.id}
      id={agent.id}
      title={agent.title}
      description={agent.description}
      creator={agent.creator}
      subscriberCount={agent.subscriberCount}
      avatar={agent.avatar}
      subscribed={agent.subscribed || false}
    />
  ))
})
