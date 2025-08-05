import { memo, useEffect } from 'react'
import styled from 'styled-components'
import { useFetchMyAgentsOverviewList, useMyAgentsOverviewList } from 'store/myagent/hooks'
import EmptyOverview from './EmptyOverview'
import Pending from 'components/Pending'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

function MyAgentsOverview() {
  const { isLoading } = useFetchMyAgentsOverviewList()
  const [myAgentsOverviewList] = useMyAgentsOverviewList()

  if (isLoading) {
    return <Pending />
  }

  // If no subscribed agents, show empty state
  if (!myAgentsOverviewList || myAgentsOverviewList.length === 0) {
    return (
      <Wrapper>
        <EmptyOverview />
      </Wrapper>
    )
  }

  // TODO: Implement the overview list view for subscribed agents
  return (
    <Wrapper>
      <MessageList>{/* Agent list will be implemented here */}</MessageList>
    </Wrapper>
  )
}

export default memo(MyAgentsOverview)
