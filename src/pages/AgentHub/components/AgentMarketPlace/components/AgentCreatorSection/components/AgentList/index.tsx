import styled from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import AgentCard from '../AgentCard'
import { ButtonBorder } from 'components/Button'

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  
  ${({ theme }) => theme.isMobile && `
    grid-template-columns: 1fr;
    gap: ${vm(12)};
    padding: 0 ${vm(16)};
  `}
`

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
  onViewMore
}: AgentListProps) {
  return (
    <>
      <ListWrapper>
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
      </ListWrapper>
      {onViewMore && (
        <ButtonBorder onClick={onViewMore}>
          View more →
        </ButtonBorder>
      )}
    </>
  )
}) 