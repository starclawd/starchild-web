import { useEffect } from 'react'
import { useCurrentMyAgentDetailData } from 'store/myagent/hooks'
import { useAgentLastViewTimestamp } from 'store/myagentcache/hooks'
import { useUserInfo } from 'store/login/hooks'
import styled from 'styled-components'
import MyAgentsOverview from './components/MyAgentsOverview'
import AgentDetailContent from 'pages/AgentDetail/components/Content'
import NoData from 'components/NoData'
import Pending from 'components/Pending'

const MyAgentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export default function MyAgent() {
  const [currentAgentDetailData] = useCurrentMyAgentDetailData()
  const [, updateAgentLastViewTimestamp] = useAgentLastViewTimestamp(currentAgentDetailData?.task_id)
  const [{ telegramUserId }] = useUserInfo()

  // 记录进入页面的时间戳
  useEffect(() => {
    if (currentAgentDetailData?.task_id) {
      updateAgentLastViewTimestamp()
    }
  }, [currentAgentDetailData?.task_id, updateAgentLastViewTimestamp])

  // 如果没有 telegramUserId，显示加载状态
  if (!telegramUserId) {
    return <Pending isFetching />
  }

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
