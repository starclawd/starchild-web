import styled, { css } from 'styled-components'
import { useAgentDetailData, useBacktestData } from 'store/agentdetail/hooks'
import { useAgentDetailPolling } from 'pages/AgentDetail/components/hooks'
import Code from 'pages/AgentDetail/components/Code'
import { vm } from 'pages/helper'

const HighlightsContent = styled.div`
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

export default function Highlights({ agentId }: { agentId: string }) {
  const [agentDetailData] = useAgentDetailData()
  const [backtestData] = useBacktestData()
  useAgentDetailPolling({
    agentId,
    agentDetailData,
    backtestData,
  })
  return (
    <HighlightsContent className='highlights-content'>
      <Code isFromChat agentDetailData={agentDetailData} backtestData={backtestData} />
    </HighlightsContent>
  )
}
