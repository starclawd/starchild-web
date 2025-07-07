import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import AgentMarketPlace from './components/AgentMarketPlace'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

const AgentHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: ${({ theme }) => theme.textL1};
    margin: 0;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  gap: 20px;
  flex: 1;
  margin: 0 auto;
`



export default function AgentHub() {
  const agentHubWrapperRef = useScrollbarClass<HTMLDivElement>()
  
  return (
    <AgentHubWrapper ref={agentHubWrapperRef as any} className="scroll-style">
      <Header>
        <h1>
          <Trans>Agent Hub</Trans>
        </h1>
      </Header>
      <Content>
        <AgentMarketPlace />
      </Content>
    </AgentHubWrapper>
  )
} 