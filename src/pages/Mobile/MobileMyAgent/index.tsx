import styled from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState, useRef } from 'react'
import {
  useCurrentMyAgentDetailData,
  useMyAgentsOverviewListPaginated,
  useFetchAgentsRecommendList,
} from 'store/myagent/hooks'
import MobileHeader from '../components/MobileHeader'
import { Trans } from '@lingui/react/macro'
import MobileAgentDetailContent from '../MobileAgentDetail/components/Content'
import MyAgentsOverview from 'pages/MyAgent/components/MyAgentsOverview'
import NoData from 'components/NoData'
import { useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'
const MobileMyAgentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const OverviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

export default function MobileMyAgent() {
  const [currentAgentDetailData, setCurrentAgentDetailData] = useCurrentMyAgentDetailData()
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)

  // 获取概览页面的刷新方法
  const { refreshAgents, reset: resetOverview, loadFirstPage } = useMyAgentsOverviewListPaginated()

  // 获取推荐智能体的刷新方法 (用于EmptyOverview页面)
  const { refetch: refetchRecommendList } = useFetchAgentsRecommendList()

  // 用于存储详情页面刷新方法的ref
  const agentDetailRefreshRef = useRef<(() => Promise<void>) | null>(null)

  const onRefresh = useCallback(async () => {
    setIsPullDownRefreshing(true)

    try {
      if (!currentAgentDetailData) {
        // 在概览页面，刷新概览数据和推荐数据
        resetOverview()
        await Promise.all([loadFirstPage(), refetchRecommendList()])
      } else {
        // 在详情页面，刷新详情数据
        if (agentDetailRefreshRef.current) {
          await agentDetailRefreshRef.current()
        }
      }
    } catch (error) {
      console.error('刷新数据失败:', error)
    } finally {
      setIsPullDownRefreshing(false)
    }
  }, [currentAgentDetailData, resetOverview, loadFirstPage, refetchRecommendList])

  const callback = useCallback(() => {
    setCurrentAgentDetailData(null)
  }, [setCurrentAgentDetailData])
  const [{ telegramUserId }] = useUserInfo()

  if (!telegramUserId) {
    return <Pending isFetching />
  }

  return (
    <MobileMyAgentWrapper>
      <PullDownRefresh
        onRefresh={onRefresh}
        isRefreshing={isPullDownRefreshing}
        setIsRefreshing={setIsPullDownRefreshing}
        // scrollContainerId='#aiContentInnerEl'
      >
        {!currentAgentDetailData ? (
          <OverviewWrapper>
            <MobileHeader title={<Trans>My Agent</Trans>} />
            <MyAgentsOverview />
          </OverviewWrapper>
        ) : currentAgentDetailData.id ? (
          <MobileAgentDetailContent
            isFromMyAgent={true}
            agentId={currentAgentDetailData.id.toString() || ''}
            hideMenu={false}
            showBackIcon={true}
            callback={callback}
            refreshRef={agentDetailRefreshRef}
          />
        ) : (
          <NoData />
        )}
      </PullDownRefresh>
    </MobileMyAgentWrapper>
  )
}
