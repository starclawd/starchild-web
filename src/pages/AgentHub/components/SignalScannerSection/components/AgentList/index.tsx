import { memo } from 'react'
import AgentCard from '../AgentCard'
import { AgentThreadInfo } from 'store/agenthub/agenthub'

interface AgentListProps {
  agents: AgentThreadInfo[]
}

export default memo(function AgentList({ agents }: AgentListProps) {
  return agents.map((agent) => (
    <AgentCard
      key={agent.threadId}
      threadId={agent.threadId}
      title={agent.title}
      description={agent.description}
      creator={agent.creator}
      subscriberCount={agent.subscriberCount}
      avatar={agent.avatar}
      subscribed={agent.subscribed || false}
    />
  ))
})
