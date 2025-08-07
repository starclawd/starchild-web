import { memo, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { useFetchMyAgentsOverviewList, useMyAgentsOverviewList, useLastVisibleAgentId } from 'store/myagent/hooks'
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
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [lastVisibleAgentId, setLastVisibleAgentId] = useLastVisibleAgentId()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (!scrollRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        console.log('entries', entries)
        entries.forEach((entry) => {
          console.log('entry', entry)
          if (entry.isIntersecting) {
            const agentId = entry.target.getAttribute('data-agent-id')
            if (agentId) {
              console.log('Current visible agent:', agentId)
              setLastVisibleAgentId(agentId)
            }
          }
        })
      },
      { threshold: 0.5 },
    )

    const elements = scrollRef.current.querySelectorAll('[data-agent-id]')
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [myAgentsOverviewList, scrollRef, setLastVisibleAgentId])

  useEffect(() => {
    console.log('load lastVisibleAgentId', lastVisibleAgentId)
    if (!scrollRef.current || !lastVisibleAgentId || isLoading || !isInitialLoad.current) return

    const element = scrollRef.current.querySelector(`[data-agent-id="${lastVisibleAgentId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    isInitialLoad.current = false
  }, [isLoading, scrollRef, lastVisibleAgentId])

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
          <AgentOverviewCard key={agent.task_id} data={agent} data-agent-id={agent.task_id} />
        ))}
      </MessageList>
    </Wrapper>
  )
}

export default memo(MyAgentsOverview)
