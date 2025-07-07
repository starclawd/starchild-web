import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'

const AgentHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
  flex: 1;
  gap: 20px;
`

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.bgT30};
  background-color: ${({ theme }) => theme.bgL0};
  
  span {
    font-size: 16px;
    color: ${({ theme }) => theme.textL3};
  }
`

export default function AgentHub() {
  return (
    <AgentHubWrapper>
      <Header>
        <h1>
          <Trans>Agent Hub</Trans>
        </h1>
      </Header>
      <Content>
        <Placeholder>
          <span>
            <Trans>AgentHub content will be added here</Trans>
          </span>
        </Placeholder>
      </Content>
    </AgentHubWrapper>
  )
} 