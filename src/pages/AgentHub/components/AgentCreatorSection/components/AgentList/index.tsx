import styled from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import AgentCard from '../AgentCard'
import { ButtonBorder } from 'components/Button'

interface AgentData {
  id: string
  title: string
  description: string
  creator: string
  usageCount: number
  avatar: string
}

interface AgentListProps {
  agents: AgentData[]
  onAgentClick?: (agent: AgentData) => void
  onViewMore?: () => void
}

export default memo(function AgentList({
  agents,
  onAgentClick,
}: AgentListProps) {
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