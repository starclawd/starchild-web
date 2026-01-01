import styled, { css } from 'styled-components'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useMemo, useState } from 'react'
import Pending from 'components/Pending'
import ChatHistory from '../ChatHistory'
import AgentDescription from '../AgentDescription'
import Code from '../Code'
import { AGENT_TYPE, AgentDetailDataType, BacktestDataType } from 'store/agentdetail/agentdetail'
import { ANI_DURATION } from 'constants/index'
import { useAgentDetailPolling } from '../hooks'
import {
  useAgentDetailData,
  useBacktestData,
  useIsGeneratingCode,
  useIsRunningBacktestAgent,
} from 'store/agentdetail/hooks'
import AiInput from 'pages/Chat/components/ChatInput'

const AgentDetailContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const Left = styled.div<{ $shouldExpandRightSection: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 65%;
  height: 100%;
  padding: 0 20px;
  transition: width ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.black900};
  ${({ $shouldExpandRightSection }) =>
    $shouldExpandRightSection &&
    css`
      width: 35%;
    `}
`

const LeftContent = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  padding-bottom: 20px;
  overflow: hidden;
`

const LeftInnerContent = styled.div<{ $isFromMyAgent: boolean; $isThinking: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 12px;
  overflow: hidden;
  /* padding-bottom: ${({ $isFromMyAgent }) => ($isFromMyAgent ? '132px' : '0')}; */
  ${({ $isThinking }) =>
    $isThinking &&
    css`
      padding: 0;
      max-width: unset;
    `}
`

const Right = styled.div<{ $shouldExpandRightSection: boolean }>`
  display: flex;
  flex-direction: column;
  width: 35%;
  height: 100%;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.black1000};
  transition: width ${ANI_DURATION}s;
  ${({ $shouldExpandRightSection }) =>
    $shouldExpandRightSection &&
    css`
      width: 65%;
    `}
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 0 20px;
  height: 100%;
`

export default function AgentDetailContent({
  agentId,
  isFromMyAgent = false,
  showBackButton = false,
  fromPage,
}: {
  agentId: string
  isFromMyAgent?: boolean
  showBackButton: boolean
  fromPage?: string
}) {
  const [agentDetailData] = useAgentDetailData()
  const [backtestData] = useBacktestData()
  const { task_type } = agentDetailData
  const { isLoading } = useAgentDetailPolling({
    agentId,
    agentDetailData,
    backtestData,
  })
  const [isCollapsed, setIsCollapsed] = useState(true)
  const isRunningBacktestAgent = useIsRunningBacktestAgent(agentDetailData, backtestData)
  const isGeneratingCode = useIsGeneratingCode(agentDetailData)
  const shouldExpandRightSection = useMemo(() => {
    return task_type === AGENT_TYPE.BACKTEST_TASK
  }, [task_type])

  return (
    <AgentDetailContentWrapper>
      {isLoading ? (
        <Pending isNotButtonLoading />
      ) : (
        <>
          <Left $shouldExpandRightSection={shouldExpandRightSection}>
            <AgentDescription
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              agentDetailData={agentDetailData}
              showBackButton={showBackButton}
              fromPage={fromPage}
            />
            <LeftContent>
              <LeftInnerContent $isThinking={isGeneratingCode || isRunningBacktestAgent} $isFromMyAgent={isFromMyAgent}>
                <ChatHistory agentDetailData={agentDetailData} backtestData={backtestData} />
                {/* {isFromMyAgent && <AiInput isFromMyAgent />} */}
              </LeftInnerContent>
            </LeftContent>
          </Left>
          <Right $shouldExpandRightSection={shouldExpandRightSection}>
            {/* <Title $borderColor={theme.lineDark8}>
              <IconBase className='icon-task-detail' />
              <Trans>Agent details</Trans>
            </Title> */}
            <RightContent>
              <Code agentDetailData={agentDetailData} backtestData={backtestData} />
            </RightContent>
          </Right>
        </>
      )}
    </AgentDetailContentWrapper>
  )
}
