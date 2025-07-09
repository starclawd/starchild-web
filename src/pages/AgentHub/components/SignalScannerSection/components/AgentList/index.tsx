import styled from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import AgentCard from '../AgentCard'
import { ButtonBorder } from 'components/Button'
import { SignalScannerAgent } from 'store/agenthub/agenthub'

interface AgentListProps {
  agents: SignalScannerAgent[]
  onAgentClick?: (agent: SignalScannerAgent) => void
  onViewMore?: () => void
}

export default memo(function AgentList({ agents, onAgentClick }: AgentListProps) {
  return (
    <>
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          title={agent.title}
          description={agent.description}
          creator={agent.creator}
          usageCount={agent.usageCount}
          avatar={agent.avatar}
          onClick={() => onAgentClick?.(agent)}
        />
      ))}
    </>
  )
})
