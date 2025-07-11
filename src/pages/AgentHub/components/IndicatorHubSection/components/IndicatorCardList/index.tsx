import { memo } from 'react'
import IndicatorCard from '../IndicatorCard'
import { AgentThreadInfo } from 'store/agenthub/agenthub'

interface IndicatorCardListProps {
  agents: AgentThreadInfo[]
}

export default memo(function IndicatorCardList({ agents }: IndicatorCardListProps) {
  return agents.map((agent) => <IndicatorCard key={agent.threadId} {...agent} />)
})
