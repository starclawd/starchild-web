import styled, { css } from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import { useCurrentAgentDetailData } from 'store/myagent/hooks'
import MobileHeader from '../components/MobileHeader'
import { Trans } from '@lingui/react/macro'
import MobileAgentDetailContent from '../MobileAgentDetail/components/Content'
import MyAgentsOverview from 'pages/MyAgent/components/MyAgentsOverview'
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
  const [currentAgentDetailData, setCurrentAgentDetailData] = useCurrentAgentDetailData()
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setIsPullDownRefreshing(true)
    // TODO: 刷新数据
    setTimeout(() => {
      setIsPullDownRefreshing(false)
    }, 1000)
  }, [setIsPullDownRefreshing])

  const callback = useCallback(() => {
    setCurrentAgentDetailData(null)
  }, [setCurrentAgentDetailData])

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
        ) : (
          <MobileAgentDetailContent
            isFromMyAgent
            agentId={currentAgentDetailData.id.toString() || ''}
            hideMenu={false}
            showBackIcon={false}
            callback={callback}
          />
        )}
      </PullDownRefresh>
    </MobileMyAgentWrapper>
  )
}
