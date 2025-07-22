import NoData from 'components/NoData'
import { ANI_DURATION } from 'constants/index'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import AgentDescription from 'pages/AgentDetail/components/AgentDescription'
import ChatHistory from 'pages/AgentDetail/components/ChatHistory'
import Code from 'pages/AgentDetail/components/Code'
import { useMemo, useState } from 'react'
import { AGENT_TYPE, DEFAULT_AGENT_DETAIL_DATA } from 'store/agentdetail/agentdetail'
import { useBacktestData } from 'store/agentdetail/hooks'
import { useCurrentAgentDetailData } from 'store/myagent/hooks'
import styled, { css } from 'styled-components'

const MyAgentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: 20px;
`

const InnerContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 100%;
  .no-data-wrapper {
    height: 100%;
  }
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
  height: 100%;
  padding-bottom: 20px;
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

export default function MyAgent() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const leftContentRef = useScrollbarClass<HTMLDivElement>()
  const [currentAgentDetailData] = useCurrentAgentDetailData()
  const [backtestData] = useBacktestData()
  const { task_type } = currentAgentDetailData || DEFAULT_AGENT_DETAIL_DATA
  const shouldExpandRightSection = useMemo(() => {
    return task_type === AGENT_TYPE.BACKTEST_TASK
  }, [task_type])
  if (!currentAgentDetailData) {
    return (
      <MyAgentWrapper>
        <MessageList>
          <NoData />
        </MessageList>
      </MyAgentWrapper>
    )
  }
  return (
    <MyAgentWrapper>
      <InnerContent>
        <Left $shouldExpandRightSection={shouldExpandRightSection}>
          <AgentDescription
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            agentDetailData={currentAgentDetailData}
          />
          <LeftContent ref={leftContentRef} className='scroll-style'>
            <ChatHistory agentDetailData={currentAgentDetailData} backtestData={backtestData} />
          </LeftContent>
        </Left>
        <Right $shouldExpandRightSection={shouldExpandRightSection}>
          {/* <Title $borderColor={theme.lineDark8}>
                <IconBase className='icon-task-detail' />
                <Trans>Agent details</Trans>
              </Title> */}
          <RightContent>
            {/* <AgentDescription /> */}
            <Code agentDetailData={currentAgentDetailData} backtestData={backtestData} />
          </RightContent>
        </Right>
      </InnerContent>
    </MyAgentWrapper>
  )
}
