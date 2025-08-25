import { useEffect } from 'react'
import { useCurrentAgentDetailData } from 'store/myagent/hooks'
import { useAgentLastViewTimestamp } from 'store/myagentcache/hooks'
import styled from 'styled-components'
import MyAgentsOverview from './components/MyAgentsOverview'
import AgentDetailContent from 'pages/AgentDetail/components/Content'
import NoData from 'components/NoData'

const MyAgentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export default function MyAgent() {
  const [currentAgentDetailData] = useCurrentAgentDetailData()
  const [, updateAgentLastViewTimestamp] = useAgentLastViewTimestamp(currentAgentDetailData?.task_id)

  // 记录进入页面的时间戳
  useEffect(() => {
    if (currentAgentDetailData?.task_id) {
      updateAgentLastViewTimestamp()
    }
  }, [currentAgentDetailData?.task_id, updateAgentLastViewTimestamp])
  if (!currentAgentDetailData) {
    return <MyAgentsOverview />
  }
  return (
    <MyAgentWrapper>
      {currentAgentDetailData.id ? (
        <AgentDetailContent isFromMyAgent agentId={currentAgentDetailData.id.toString()} showBackButton={true} />
      ) : (
        <NoData />
      )}
    </MyAgentWrapper>
  )
}
