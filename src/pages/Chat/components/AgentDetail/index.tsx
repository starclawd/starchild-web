import styled, { css } from 'styled-components'
import { useAgentDetailData, useBacktestData } from 'store/agentdetail/hooks'
import { useAgentDetailPolling } from 'pages/AgentDetail/components/hooks'
import Code from 'pages/AgentDetail/components/Code'
import { vm } from 'pages/helper'
import Pending from 'components/Pending'

const AgentDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 16px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0;
      height: calc(100% - ${vm(56)});
    `}
`

export default function AgentDetail({ agentId, isFromUseCases }: { agentId: string; isFromUseCases?: boolean }) {
  const [agentDetailData] = useAgentDetailData()
  const [backtestData] = useBacktestData()
  const { isLoading } = useAgentDetailPolling({
    agentId,
    agentDetailData,
    backtestData,
  })
  return (
    <AgentDetailWrapper className='highlights-content'>
      {isLoading ? (
        <Pending isNotButtonLoading />
      ) : (
        <>
          <Code
            isFromChat
            agentDetailData={agentDetailData}
            backtestData={backtestData}
            isFromUseCases={isFromUseCases}
          />
        </>
      )}
    </AgentDetailWrapper>
  )
}
