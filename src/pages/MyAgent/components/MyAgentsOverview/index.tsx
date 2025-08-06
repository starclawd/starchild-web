import { memo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useFetchMyAgentsOverviewList, useMyAgentsOverviewList } from 'store/myagent/hooks'
import EmptyOverview from './components/EmptyOverview'
import AgentOverviewCard from './components/AgentOverviewCard'
import Pending from 'components/Pending'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(40)} ${vm(20)};
    `}
`

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
  gap: 20px;
  overflow-y: auto;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      gap: ${vm(20)};
    `}
`

function MyAgentsOverview() {
  const { isLoading } = useFetchMyAgentsOverviewList()
  const [myAgentsOverviewList] = useMyAgentsOverviewList()
  const scrollRef = useScrollbarClass<HTMLDivElement>()

  if (isLoading) {
    return (
      <Wrapper>
        <Pending />
      </Wrapper>
    )
  }

  // If no subscribed agents, show empty state
  if (!myAgentsOverviewList || myAgentsOverviewList.length === 0) {
    return (
      <Wrapper>
        <EmptyOverview />
      </Wrapper>
    )
  }

  // Render the overview list of subscribed agents
  return (
    <Wrapper>
      <MessageList className='scroll-style' ref={scrollRef}>
        {myAgentsOverviewList.map((agent) => (
          <AgentOverviewCard key={agent.task_id} data={agent} />
        ))}
      </MessageList>
    </Wrapper>
  )
}

export default memo(MyAgentsOverview)
