import { memo } from 'react'
import IndicatorCard from '../IndicatorCard'
import { IndicatorAgent } from '../..'

interface IndicatorCardListProps {
  agents: IndicatorAgent[]
}

export default memo(function IndicatorCardList({ agents }: IndicatorCardListProps) {
  return agents.map((agent) => <IndicatorCard key={agent.id} {...agent} />)
})
