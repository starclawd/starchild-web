import styled from 'styled-components'

const MyAgentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: 20px;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 20px;
`

const AgentHistory = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`

export default function MyAgent() {
  return (
    <MyAgentWrapper>
      <InnerContent>
        <AgentHistory></AgentHistory>
      </InnerContent>
    </MyAgentWrapper>
  )
}
