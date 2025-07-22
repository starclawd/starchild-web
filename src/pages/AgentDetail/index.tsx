import styled, { css } from 'styled-components'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useMemo, useState } from 'react'
import Pending from 'components/Pending'
import ChatHistory from './components/ChatHistory'
import AgentDescription from './components/AgentDescription'
import Code from './components/Code'
import { useAgentDetailData, useBacktestData } from 'store/agentdetail/hooks'
import { AGENT_TYPE } from 'store/agentdetail/agentdetail'
import { ANI_DURATION } from 'constants/index'
import { useAgentDetailPolling } from './components/hooks'

const AgentDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  width: 100%;
`

const Content = styled.div`
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

export default function AgentDetail() {
  const leftContentRef = useScrollbarClass<HTMLDivElement>()
  const [agentDetailData] = useAgentDetailData()
  const { task_type } = agentDetailData
  const [backtestData] = useBacktestData()
  const { isLoading } = useAgentDetailPolling(agentDetailData, backtestData)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const shouldExpandRightSection = useMemo(() => {
    return task_type === AGENT_TYPE.BACKTEST_TASK
  }, [task_type])

  return (
    <AgentDetailWrapper>
      <Content>
        {isLoading ? (
          <Pending isFetching />
        ) : (
          <>
            <Left $shouldExpandRightSection={shouldExpandRightSection}>
              <AgentDescription
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                agentDetailData={agentDetailData}
              />
              <LeftContent ref={leftContentRef} className='scroll-style'>
                <ChatHistory agentDetailData={agentDetailData} backtestData={backtestData} />
              </LeftContent>
            </Left>
            <Right $shouldExpandRightSection={shouldExpandRightSection}>
              {/* <Title $borderColor={theme.lineDark8}>
                <IconBase className='icon-task-detail' />
                <Trans>Agent details</Trans>
              </Title> */}
              <RightContent>
                {/* <AgentDescription /> */}
                <Code agentDetailData={agentDetailData} backtestData={backtestData} />
              </RightContent>
            </Right>
          </>
        )}
      </Content>
    </AgentDetailWrapper>
  )
}
