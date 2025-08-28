import styled from 'styled-components'
import useParsedQueryString from 'hooks/useParsedQueryString'
import AgentDetailContent from './components/Content'

const AgentDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  width: 100%;
`

export default function AgentDetail() {
  const { agentId, taskId } = useParsedQueryString()

  return (
    <AgentDetailWrapper>
      <AgentDetailContent agentId={agentId || taskId || ''} showBackButton={false} />
    </AgentDetailWrapper>
  )
}
