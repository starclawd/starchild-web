import useParsedQueryString from 'hooks/useParsedQueryString'
import MobileAgentDetailContent from './components/Content'

export default function MobileAgentDetail() {
  const { from, agentId, taskId } = useParsedQueryString()

  return <MobileAgentDetailContent agentId={agentId || taskId || ''} showHeader={!!from} />
}
