import useParsedQueryString from 'hooks/useParsedQueryString'
import MobileAgentDetailContent from './components/Content'
import { useCallback, useEffect } from 'react'
import { ROUTER } from 'pages/router'
import { useCurrentRouter } from 'store/application/hooks'
import { useAgentLastViewTimestamp } from 'store/myagentcache/hooks'

export default function MobileAgentDetail() {
  const { from, agentId } = useParsedQueryString()
  const [, setCurrentRouter] = useCurrentRouter()
  const [, updateAgentLastViewTimestamp] = useAgentLastViewTimestamp(agentId)

  // 记录进入页面的时间戳
  useEffect(() => {
    if (agentId) {
      updateAgentLastViewTimestamp()
    }
  }, [agentId, updateAgentLastViewTimestamp])

  const goBack = useCallback(() => {
    if (from === 'myagent') {
      setCurrentRouter(ROUTER.MY_AGENT)
    }
  }, [from, setCurrentRouter])

  return <MobileAgentDetailContent agentId={agentId || ''} callback={goBack} />
}
