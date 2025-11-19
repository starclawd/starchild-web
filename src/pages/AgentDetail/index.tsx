import styled from 'styled-components'
import useParsedQueryString from 'hooks/useParsedQueryString'
import AgentDetailContent from './components/Content'
import { useAgentLastViewTimestamp } from 'store/myagentcache/hooks'
import { useEffect } from 'react'

const AgentDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  width: 100%;
`

export default function AgentDetail() {
  const { agentId, from } = useParsedQueryString()
  const [, updateAgentLastViewTimestamp] = useAgentLastViewTimestamp(agentId)

  // 记录进入页面的时间戳
  useEffect(() => {
    if (agentId) {
      updateAgentLastViewTimestamp()
    }
  }, [agentId, updateAgentLastViewTimestamp])

  return (
    <AgentDetailWrapper>
      <AgentDetailContent
        agentId={agentId || ''}
        showBackButton={from === 'myagents' || from === 'insights'}
        fromPage={from}
      />
    </AgentDetailWrapper>
  )
}
