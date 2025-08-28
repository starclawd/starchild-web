import useParsedQueryString from 'hooks/useParsedQueryString'
import MobileAgentDetailContent from './components/Content'
import { useCallback } from 'react'

export default function MobileAgentDetail() {
  const { from, agentId, taskId } = useParsedQueryString()

  const goBack = useCallback(() => {
    if (from) {
      history.back()
    }
  }, [from])

  return <MobileAgentDetailContent agentId={agentId || taskId || ''} hideMenu={!from} callback={goBack} />
}
