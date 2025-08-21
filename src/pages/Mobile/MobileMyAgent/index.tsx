import styled, { css } from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import { useCurrentAgentDetailData } from 'store/myagent/hooks'
import MobileHeader from '../components/MobileHeader'
import { Trans } from '@lingui/react/macro'
import MobileAgentDetailContent from '../MobileAgentDetail/components/Content'
const MobileMyAgentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: 8px;
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
          </OverviewWrapper>
        ) : (
          <MobileAgentDetailContent
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
